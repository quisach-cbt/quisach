import { prisma } from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
    const user = await prisma.user.findFirstOrThrow({
            where: {
                OR: [
                    { username: params.user_id_or_username },
                    { id: params.user_id_or_username },
                ]
            },
            include: {
                profile: true
            },
        });
    return new Response()
};