import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const problem = await prisma.problem.findUnique({
		where: {
			id: params.problem_id
		},
		include: {
			problemDetail: {
				include: {
					sampleTestCases: {
						orderBy: {
							id: 'asc'
						}
					},
				}
			}
		}
	});

	if (!problem) error(404, 'No problem found');
    if (problem.visibility === 'UNPUBLISHED') error(403, 'Problem not available')

	return { problem };
}) satisfies PageServerLoad;
