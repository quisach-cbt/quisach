import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";

export const load = (async ({ params, locals }) => {
    const organizationId = params.organization_id;
    const userIdLoadMember = locals.user?.id;
    
    const organization = await prisma.organization.findUnique({
        where: {
            id: organizationId
        },
        include: {
            OrganizationMember: {
                include: {
                    user: true
                }
            },
        }
    });

    if (!organization) {
        throw error(404, "Organization not found");
    }

    const currentUserMembership = await prisma.organizationMember.findFirst({
        where: {
            organizationId,
            userId: userIdLoadMember
        }
    });
    
    if (!currentUserMembership) {
        throw error(403, "You are not a member of this organization");
    }

    return {
        organizationMember: organization.OrganizationMember,
        currentUserLoadMember: {
            id: userIdLoadMember,
            role: currentUserMembership.role
        }
    };
}) satisfies PageServerLoad;