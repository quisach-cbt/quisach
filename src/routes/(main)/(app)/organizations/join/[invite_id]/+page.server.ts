import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
  const inviteId = params.invite_id;

  const inviteLink = await prisma.organizationInviteLink.findUnique({
    where: {
      id: inviteId
    },
    include: {
      user: true,
      organization: true
    }
  });

  if (!inviteLink) {
    throw error(404, 'Invite link not found');
  }

  return {
    inviteLink
  };
}) satisfies PageServerLoad;