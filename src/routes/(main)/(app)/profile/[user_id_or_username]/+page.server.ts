import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params, locals }) => {
  const userIdOrUsername = params.user_id_or_username;

  if (!userIdOrUsername) {
    throw error(404, 'User not found');
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: userIdOrUsername },
        { username: userIdOrUsername }
      ]
    }
  });

  if (!user) {
    throw error(404, 'User not found');
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id
    }
  })

  if (!profile) {
    throw error(404, 'Profile not found');
  }

  return {
    user: {
      isOwnProfile: locals.user?.id === user.id,
      aboutMe: profile.aboutMe,
    }
  }
}) satisfies PageServerLoad;