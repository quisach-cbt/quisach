import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    if (!locals.user) return { currentUser: null };

    const { password, ...safeUser } = locals.user; void password;
    return { currentUser: safeUser }
}) satisfies LayoutServerLoad;