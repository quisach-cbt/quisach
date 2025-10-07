import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	cookies.delete('session', { path: '/' });
    locals.user = null;
    locals.session = null;
	return new Response(null, { status: 303, headers: { Location: '/' } });
};
