import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";

export const load = (async ({ params }) => {
  const userIdOrUsername = params.user_id_or_username;

  if (!userIdOrUsername) {
    throw error(404, "User not found");
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userIdOrUsername },
          { username: userIdOrUsername }
        ]
      },
      include: {
        reposts: {
          include: {
            post: {
              include: {
                author: true,
                reactions: true,
                _count: {
                  select: {
                    reactions: true,
                    reposts: true,
                    comments: true
                  }
                }
              },
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!user) {
      throw error(404, "User not found");
    }

    return {
      user
    };
  } catch (err) {
    console.error("Error fetching user reposts:", err);
    throw error(500, "Internal server error");
  }
}) satisfies PageServerLoad;