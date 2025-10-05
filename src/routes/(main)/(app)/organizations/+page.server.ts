import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const myOrganizations = await prisma.organization.findMany({
		where: {
			OrganizationMember: {
				some: {
					userId: locals.user?.id
				}
			}
		},
		include: {
			_count: {
				select: {
					OrganizationMember: true,
				}
			}
		}
	});
	const organizations = await prisma.organization.findMany({
		where: {
			NOT: {
				OrganizationMember: {
					some: {
						userId: locals.user?.id
					}
				}
			}
		},
		include: {
			_count: {
				select: {
					OrganizationMember: true,
				}
			}
		}
	});

	return { myOrganizations, organizations };
}) satisfies PageServerLoad;
