import { prisma } from '$prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const results = await prisma.book.findMany({
        include: {
            owner: {
                select: {
                    username: true
                }
            }
        }
    });
	return {
		results
	};
};
