import { prisma } from '$lib/server/prisma';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const userId = locals.user?.id;
  
  if (!userId) {
    throw error(401, 'You must be logged in to perform this action');
  }
  
  try {
    const { id } = await request.json();
    
    if (!id) {
      return json({ success: false, message: 'ID is required' }, { status: 400 });
    }
    
    const membership = await prisma.organizationMember.findFirst({
      where: {
        id
      },
      include: {
        organization: {
          include: {
            OrganizationMember: {
              where: {
                role: 'ADMIN'
              }
            }
          }
        }
      }
    });
    
    if (!membership) {
      return json({ success: false, message: 'You are not a member of this organization' }, { status: 404 });
    }
    
    if (
      membership.role === 'ADMIN' && 
      membership.organization.OrganizationMember.length === 1
    ) {
      return json({ 
        success: false, 
        message: 'You cannot leave the organization as you are the last admin. Please promote another member to admin first.' 
      }, { status: 400 });
    }
    
    await prisma.organizationMember.delete({
      where: {
        id: membership.id
      }
    });
    
    return json({ success: true, message: 'Successfully left the organization' });
  } catch (err) {
    console.error('Error leaving organization:', err);
    return json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
};