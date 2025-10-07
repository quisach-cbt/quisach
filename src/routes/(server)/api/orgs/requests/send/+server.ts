import { prisma } from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
    const userId = locals.user?.id;
    const { orgId } = await request.json();
    
    if (!orgId || !userId) {
        return new Response(JSON.stringify({ status: 'failed', message: 'Org ID and User ID are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const joinRequest = await prisma.organizationJoinRequest.create({
            data: {
                userId,
                organizationId: orgId,
            }
        });

        return new Response(JSON.stringify({ status: 'success', message: 'Join request sent successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error sending join request:', error);
        return new Response(JSON.stringify({ status: 'failed', message: 'An error occurred while sending the join request' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}