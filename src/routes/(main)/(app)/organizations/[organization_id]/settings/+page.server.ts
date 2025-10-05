import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";

export const load = (async ({ params, locals }) => {
  const organizationId = params.organization_id;

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    }
  })

  const inviteLinks = await prisma.organizationInviteLink.findMany({
    where: {
      organizationId
    },
    include: {
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    organization,
    inviteLinks
  }
}) satisfies PageServerLoad;