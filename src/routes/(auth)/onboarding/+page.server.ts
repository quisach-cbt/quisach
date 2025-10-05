import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';
import type { Action } from '@sveltejs/kit';
import { CDN_API_KEY } from '$env/static/private';
import type { Gender } from '@prisma/client';

export const load = (async ({ url }) => {
    const username = url.searchParams.get('username') ?? '';
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (!user) {
        return {
            status: 404,
            error: new Error('User not found')
        };
    }

    const userid = user.id;

    return {
        userid,
        redirectTo: '/home',
    }
}) satisfies PageServerLoad;