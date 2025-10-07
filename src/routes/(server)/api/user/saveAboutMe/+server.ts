import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ message: 'You must be logged in to unfollow users' }, { status: 401 });
	}

	try {
		const data = await request.json();

		const { aboutMe } = data;

		if (!aboutMe) {
			return json({ message: 'About me is required' }, { status: 400 });
		}

		const result = await prisma.profile.update({
			where: {
				userId: locals.user.id
			},
			data: {
				aboutMe
			}
		});

		if (!result) {
			return json({ message: 'Failed to update about me' }, { status: 400 });
		}

		return json({ success: true, message: 'About me updated successfully' });
	} catch (error) {
		if ((error as any).code === 'P2025') {
			return json({ message: 'Failed to update about me' }, { status: 400 });
		}

		console.error('Error updating about me:', error);
		return json({ message: 'Failed to update about me' }, { status: 500 });
	}
};