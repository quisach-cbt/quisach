import { prisma } from '$lib/server/prisma';
import { compare } from 'bcryptjs';
import type { Actions } from './$types';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const emailOrUsername = data.get('email') as string;
        const password = data.get('password') as string;

        if (!emailOrUsername || !password) return { message: 'Vui lòng nhập email' };

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: emailOrUsername },
                    { email: emailOrUsername },
                ]
            }
        });

        if (!user || !(await compare(password, user.password)))
            return { message: 'Sai email hoặc mật khẩu' };

        const token = generateSessionToken();
        const session = await createSession(token, user.id);
        setSessionTokenCookie(event, token, session.expiresAt);

        return redirect(302, '/');
    },
} satisfies Actions;