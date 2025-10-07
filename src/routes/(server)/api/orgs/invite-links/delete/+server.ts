import { prisma } from '$lib/server/prisma';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const userId = locals.user?.id;

  if (!userId) {
    throw error(401, 'You must be logged in to perform this action');
  }
  
  try {
    const { linkId } = await request.json();
    await prisma.organizationInviteLink.delete({
        where: {
            id: linkId
        }
    });
    return json({
        success: true,
        message: 'Invite link deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting invite link:', error);
    return json({ success: false, message: 'Failed to delete invite link' }, { status: 500 });
  }
};