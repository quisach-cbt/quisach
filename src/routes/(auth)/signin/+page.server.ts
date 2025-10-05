import { prisma } from '$lib/server/prisma';
import { compare } from 'bcryptjs';
import type { Actions } from './$types';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const emailOrUsername = data.get('email_or_username') as string;
        const password = data.get('password') as string;

        if (!emailOrUsername || !password) return { message: 'Please enter email/username and password' };

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: emailOrUsername },
                    { email: emailOrUsername },
                ]
            }
        });

        if (!user || !(await compare(password, user.password)))
            return { message: 'Invalid username/email or password' };

        const token = generateSessionToken();
        const session = await createSession(token, user.id);
        setSessionTokenCookie(event, token, session.expiresAt);

        return redirect(302, '/home');
    },
} satisfies Actions;