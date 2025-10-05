import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const organizationId = params.organization_id;
	const userId = locals.user?.id;

	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const userMembership = await prisma.organizationMember.findFirst({
		where: {
			organizationId: organizationId,
			userId: userId,
			role: 'ADMIN'
		}
	});

	if (!userMembership) {
		throw error(403, 'You do not have permission to view join requests for this organization');
	}

	const joinRequests = await prisma.organizationJoinRequest.findMany({
		where: {
			organizationId: organizationId
		},
		include: {
			user: {
				select: {
					id: true,
					username: true,
					displayName: true,
					avatarUrl: true
				}
			}
		},
		orderBy: [
			{ status: 'asc' },
			{ createdAt: 'desc' }
		]
	});

	return {
		joinRequests
	};
};