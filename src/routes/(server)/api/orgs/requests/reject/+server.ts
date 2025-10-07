import { prisma } from '$lib/server/prisma';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.user?.id;
	
	if (!userId) {
		throw error(401, 'Unauthorized');
	}
	
	try {
		const { requestId } = await request.json();
		
		if (!requestId) {
			return json({ success: false, message: 'Request ID is required' }, { status: 400 });
		}
		
		const joinRequest = await prisma.organizationJoinRequest.findUnique({
			where: { id: requestId },
			include: { organization: true }
		});
		
		if (!joinRequest) {
			return json({ success: false, message: 'Join request not found' }, { status: 404 });
		}
		
		const userMembership = await prisma.organizationMember.findFirst({
			where: {
				organizationId: joinRequest.organizationId,
				userId: userId,
				role: 'ADMIN'
			}
		});
		
		if (!userMembership) {
			return json(
				{ success: false, message: 'You do not have permission to reject join requests' },
				{ status: 403 }
			);
		}
		
		const updatedRequest = await prisma.organizationJoinRequest.update({
			where: { id: requestId },
			data: { status: 'REJECTED' }
		});
		
		return json({ 
			success: true, 
			message: 'Join request rejected successfully' 
		});
	} catch (err) {
		console.error('Error rejecting join request:', err);
		return json(
			{ success: false, message: 'An error occurred while processing the request' },
			{ status: 500 }
		);
	}
};