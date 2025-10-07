import type { RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma";

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  const body = await request.formData();
  const postId = body.get("postId") as string;

  if (!postId) {
    return new Response(JSON.stringify({ error: "Post ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  const userId = locals.user.id;

  const isLiked = await prisma.postReaction.findFirst({
    where: {
      postId: postId,
      userId: userId
    }
  }) ? true : false;

  const isReposted = await prisma.postRepost.findFirst({
    where: {
      postId: postId,
      userId: userId
    }
  }) ? true : false;

  return new Response(JSON.stringify({ isLiked, isReposted }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}