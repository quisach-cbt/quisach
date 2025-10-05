import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    if (!locals.user) error(401, 'Unauthorized');
    if (locals.user.role !== 'ADMIN') error(403, 'Forbidden');
}) satisfies PageServerLoad;