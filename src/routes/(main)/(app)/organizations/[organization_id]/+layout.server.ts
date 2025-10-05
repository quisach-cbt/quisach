import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
	const organization = await prisma.organization.findUnique({
		where: {
			id: params.organization_id
		},
		include: {
			_count: {
				select: {
					OrganizationMember: true
				}
			}
		}
	});

	if (!organization) error(404, { message: 'No organization found' });

	const user = locals.user;
	const membershipfetch = user
		? await prisma.organizationMember.findFirst({
				where: {
					organizationId: organization.id,
					userId: user.id
				}
			})
		: null;
	const joinRequest = user
		? await prisma.organizationJoinRequest.findFirst({
				where: {
					organizationId: organization.id,
					userId: user.id
				}
			})
		: null;
	const memberStatus = membershipfetch
		? 'member'
		: joinRequest?.status === 'PENDING'
			? 'pending'
			: 'not_member';

	const isAdmin = membershipfetch?.role === 'ADMIN';

	return {
		organization,
		memberStatus,
		isAdmin,
		currentUserLoadMember: membershipfetch
	};
}) satisfies LayoutServerLoad;
