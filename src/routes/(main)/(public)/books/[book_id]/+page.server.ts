import { prisma } from '$prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({params}) => {
    const book = await prisma.book.findFirst({
        where: {
            id: params.book_id
        },
        include: {
            owner: {
                select: {
                    displayName: true,
                    username: true
                }
            }
        }
    });
    if (!book) error(404)
    return {
        book
    };
};
