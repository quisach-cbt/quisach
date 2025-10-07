import type { RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import type { PostVisibility } from "@prisma/client";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  }

  const data = await request.formData();
  const postId = data.get('postId') as string;
  const isLiked = data.get('like') === 'true' ? true : false;

  if (!postId) {
    return new Response(JSON.stringify({ error: 'Post ID is required' }), { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
  }
  
  if (isLiked) {
    try {
      await prisma.postReaction.create({
        data: {
          postId: post.id,
          userId: locals.user.id,
        }
      })
      return new Response(JSON.stringify({ message: 'Post liked' }), { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      } else {
        return new Response(JSON.stringify({ error: 'Unknown error' }), { status: 500 });
      }
    }
  } else {
    try {
      await prisma.postReaction.delete({
        where: {
          userId_postId: {
            userId: locals.user.id,
            postId: post.id,
          }
        }
      })
      return new Response(JSON.stringify({ message: 'Post unliked' }), { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      } else {
        return new Response(JSON.stringify({ error: 'Unknown error' }), { status: 500 });
      }
    }
  }
}