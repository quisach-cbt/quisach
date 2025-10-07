import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return json({ message: 'You must be logged in to follow users' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const { userId } = data;
        
        if (!userId) {
            return json({ message: 'User ID is required' }, { status: 400 });
        }
        
        if (locals.user.id === userId) {
            return json({ message: "You can't follow yourself" }, { status: 400 });
        }
        
        const userToFollow = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!userToFollow) {
            return json({ message: 'User not found' }, { status: 404 });
        }
        
        await prisma.userFollow.create({
            data: {
                followerId: locals.user.id,
                followeeId: userId
            }
        });
        
        return json({ success: true, message: 'User followed successfully' });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return json({ message: 'You are already following this user' }, { status: 400 });
        }
        
        console.error('Error following user:', error);
        return json({ message: 'Failed to follow user' }, { status: 500 });
    }
};