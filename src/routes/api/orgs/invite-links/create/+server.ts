import { prisma } from '$lib/server/prisma';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const userId = locals.user?.id;

  if (!userId) {
    throw error(401, 'You must be logged in to perform this action');
  }

  try {
    const { organizationId, expiresIn } = await request.json();

    if (!organizationId) {
      return json({ success: false, message: 'Organization ID is required' }, { status: 400 });
    }

    if (!expiresIn) {
      return json({ success: false, message: 'Expiration time is required' }, { status: 400 });
    }

    const inviteLink = await prisma.organizationInviteLink.create({
      data: {
        organizationId,
        expiredAt: new Date(expiresIn),
        userId
      }
    })

    if (!inviteLink) {
      return json({ success: false, message: 'Failed to create invite link' }, { status: 500 });
    }

    return json({
      success: true,
      message: 'Invite link created successfully',
      inviteLink: {
        id: inviteLink.id,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error creating invite link:', error);
    return json({ success: false, message: 'Failed to create invite link' }, { status: 500 });
  }
};