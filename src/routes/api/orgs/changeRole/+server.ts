import { prisma } from "$lib/server/prisma";
import type { RequestHandler } from "./$types";
import type { OrganizationRole } from "@prisma/client";

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    const role = formData.get('role') as OrganizationRole;
    const memberId = formData.get('memberId') as string;

    if (!role || !memberId) {
        return new Response(JSON.stringify({ status: 'failed', message: 'Role and memberId are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    try {
        const member = await prisma.organizationMember.findUnique({
            where: {
                id: memberId
            }
        });

        if (!member) {
            return new Response(JSON.stringify({ status: 'failed', message: 'Member not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        await prisma.organizationMember.update({
            where: {
                id: memberId
            },
            data: {
                role: role
            }
        });

        return new Response(JSON.stringify({ status: 'success', message: 'Role changed successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error changing role:', error);
        return new Response(JSON.stringify({ status: 'failed', message: 'An error occurred while changing the role' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}