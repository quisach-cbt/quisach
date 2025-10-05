import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ locals }) => {
	const pinnedPosts = await prisma.post.findMany({
		take: 5,
		where: {
			pinned: true,
			organizationId: null,
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			author: true,
			comments: true,
			_count: {
				select: {
					reactions: true,
					reposts: true
				}
			}
		},
	});

	const normalPosts = await prisma.post.findMany({
		take: 20,
		where: {
			pinned: false,
			organizationId: null,
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			author: true,
			_count: {
				select: {
					reactions: true,
					reposts: true,
					comments: true
				}
			}
		},
	});

	return {
		pinnedPosts,
		normalPosts,
	};
}) satisfies PageServerLoad;