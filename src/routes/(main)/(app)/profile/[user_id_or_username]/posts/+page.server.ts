import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";

export const load = (async ({ url, params }) => {
  const userIdOrUsername = params.user_id_or_username;

  if (!userIdOrUsername) {
    throw error(404, "User not found");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: userIdOrUsername },
        { username: userIdOrUsername }
      ]
    }
  })

  if (!user) {
    throw error(404, "User not found");
  }

  const cursor = url.searchParams.get("cursor");
  const limit = 20;

  console.log('Cursor:', cursor);
  
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: user.id,
        visibility: "PUBLIC"
      },
      orderBy: {
        createdAt: "desc"
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
            reactions: true,
            reposts: true
          }
        }
      }
    })

    let nextCursor: string | null = null;
    if (posts.length === limit) {
      nextCursor = posts[posts.length - 1].id;
    }

    return {
      posts,
      nextCursor
    }
  } catch (err) {
    console.error("Error fetching user reposts:", err);
    throw error(500, "Internal server error");
  }
}) satisfies PageServerLoad;