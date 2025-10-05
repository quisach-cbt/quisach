import { prisma } from '$lib/server/prisma';
import { hash } from 'bcryptjs';
import type { Actions } from './$types';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { object, string } from 'zod';

const signUpSchema = object({
	email: string({ required_error: 'Email cannot be blank' }).email('Invalid email'),
	username: string({ required_error: 'Username cannot be blank' })
		.regex(/^[a-zA-Z0-9_]+$/, {
			message: 'Invalid username'
		})
		.min(3, { message: 'Minimum of 3 characters' })
		.max(32, { message: 'Maximum of 32 characters' }),
	password: string({ required_error: 'Password is required' })
		.min(8, 'Password must be more than 8 characters')
		.regex(/^(?=.*[a-z])(?=.*\d).{8,}$/, { message: 'Invalid password' }),
	confirmPassword: string({ required_error: 'Comfirm your password' })
}).refine((data) => data.password === data.confirmPassword, {
	message: 'Password is not match',
	path: ['confirmPassword']
});

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const username = data.get('username') as string;
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const confirmPassword = data.get('confirmPassword') as string;

        if (!username || !email || !password || !confirmPassword) {
            return fail(400, { 
                status: 'failed', 
                message: 'All fields are required' 
            });
        }

        if (password !== confirmPassword) {
            return fail(400, { 
                status: 'failed', 
                message: 'Passwords do not match' 
            });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return fail(400, { 
                status: 'failed', 
                message: existingUser.username === username 
                    ? 'Username is already taken' 
                    : 'Email is already registered' 
            });
        }

        try {
            const hashedPassword = await hash(password, 12);
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    displayName: username,
                    profile: {
                        create: {} 
                    }
                }
            });

            const token = generateSessionToken();
            const session = await createSession(token, user.id);
            setSessionTokenCookie(event, token, session.expiresAt);

            return {
                status: 'success',
                username: user.username,
                redirect: `/success?username=${user.username}`
            };
        } catch (error) {
            console.error("Signup error:", error);
            return fail(500, { 
                status: 'failed', 
                message: 'An error occurred during signup. Please try again.' 
            });
        }
    }
} satisfies Actions;

