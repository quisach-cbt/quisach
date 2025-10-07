import { prisma } from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = locals.user;
  const data = await request.json();
  const orgId = data.orgId;

  if (!user) {
    return new Response(JSON.stringify({ status: 'failed', message: 'User not found' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  if (!orgId) {
    return new Response(JSON.stringify({ status: 'failed', message: 'Organization ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const isAdmin = await prisma.organizationMember.findFirst({
    where: {
      userId: user.id,
      organizationId: orgId,
      role: 'ADMIN'
    }
  })

  if (!isAdmin && user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ status: 'failed', message: 'User is not an admin of the organization' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    await prisma.organization.delete({
      where: {
        id: orgId
      },
    })
    return new Response(
      JSON.stringify({ status: 'success', message: 'Organization deleted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error deleting organization:', error);
    return new Response(JSON.stringify({ status: 'failed', message: 'Failed to delete organization' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}