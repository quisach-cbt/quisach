import { prisma } from '$lib/server/prisma';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const userId = locals.user?.id;

  if (!userId) {
    throw error(401, 'You must be logged in to perform this action');
  }
  
  try {
    const { inviteId } = await request.json();
    const inviteLink = await prisma.organizationInviteLink.findUnique({
      where: {
        id: inviteId
      }
    });

    if (!inviteLink) {
      return json({ success: false, message: 'Invite link not found' }, { status: 404 });
    }

    await prisma.organizationMember.create({
      data: {
        userId,
        organizationId: inviteLink.organizationId,
        role: 'MEMBER'
      }
    });

    await prisma.organizationInviteLink.update({
      where: {
        id: inviteId
      },
      data: {
        joinAmount: {
          increment: 1
        }
      }
    });

    return json({ success: true, message: 'Successfully joined organization' }, { status: 200 });
  } catch (error) {
    console.error('Error invite link:', error);
    return json({ success: false, message: 'Failed to join organization' }, { status: 500 });
  }
};