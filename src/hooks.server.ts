import type { Handle, HandleFetch } from '@sveltejs/kit';
import { validateSessionToken, setSessionTokenCookie, deleteSessionTokenCookie } from './lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session') ?? null;
    if (!token) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user } = await validateSessionToken(token);
    if (session) 
        setSessionTokenCookie(event, token, session.expiresAt);
    else 
        deleteSessionTokenCookie(event);

    event.locals.user = user;
    event.locals.session = session;

    return resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
    if (process.env.NODE_ENV !== 'development') {
        if (request.url.startsWith('https://judge.btoi.info.vn/')) {
            request = new Request(
                request.url.replace('https://judge.btoi.info.vn/', 'http://localhost:8008/'),
                request
            );
        }
    }

	return fetch(request);
};