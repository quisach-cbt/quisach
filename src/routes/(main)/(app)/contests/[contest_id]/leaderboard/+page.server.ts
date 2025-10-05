import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params }) => {
    const { problem_id } = params;
    
    const problem = await prisma.problem.findUnique({
        where: { id: problem_id },
        include: {
            authors: {
                include: {
                    user: true
                }
            },
            category: true
        }
    });

    if (!problem) {
        throw error(404, {
            message: `Problem with ID '${problem_id}' not found`
        });
    }
    
    return {
        problem
    };
}) satisfies PageServerLoad;