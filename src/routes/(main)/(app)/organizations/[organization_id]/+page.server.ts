import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";

export const load = (async ({ params, locals }) => {
	if (!locals.user)  {
		throw error(401, { message: 'Unauthorized' });
	}

	const posts = await prisma.post.findMany({
		where: {
			organizationId: params.organization_id,
		},
		include: {
			author: true,
			_count: {
				select: {
					comments: true,
					reactions: true,
					reposts: true,
				}
			}
		},
		take: 10,
		orderBy: {
			createdAt: 'desc'
		}
	});

	if (!posts) throw error(404, { message: 'No posts found' });

	return {
		posts
	}
}) satisfies PageServerLoad;