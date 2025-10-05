import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return json({ message: 'You must be logged in to unfollow users' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const { userId } = data;
        
        if (!userId) {
            return json({ message: 'User ID is required' }, { status: 400 });
        }
        
        const result = await prisma.userFollow.delete({
            where: {
                followerId_followeeId: {
                    followerId: locals.user.id,
                    followeeId: userId
                }
            }
        });
        
        if (!result) {
            return json({ message: 'You are not following this user' }, { status: 400 });
        }
        
        return json({ success: true, message: 'User unfollowed successfully' });
    } catch (error) {
        if ((error as any).code === 'P2025') {
            return json({ message: 'You are not following this user' }, { status: 400 });
        }
        
        console.error('Error unfollowing user:', error);
        return json({ message: 'Failed to unfollow user' }, { status: 500 });
    }
};