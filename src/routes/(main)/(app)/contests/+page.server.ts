import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async () => {
    const contests = await prisma.contest.findMany({
            take: 10,
        });
    return { ...contests };
}) satisfies PageServerLoad;