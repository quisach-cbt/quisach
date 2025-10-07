import type { RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  }

  const data = await request.formData();
  const postId = data.get('postId') as string;
  const isReposted = data.get('repost') === 'true' ? true : false;

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

  if (isReposted) {
    try {
      await prisma.postRepost.create({
        data: {
          postId: post.id,
          userId: locals.user.id,
        }
      });
      return new Response(JSON.stringify({ message: 'Post reposted' }), { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      } else {
        return new Response(JSON.stringify({ error: 'Unknown error' }), { status: 500 });
      }
    }
  } else {
    try {
      await prisma.postRepost.delete({
        where: {
          userId_postId: {
            userId: locals.user.id,
            postId: post.id,
          }
        }
      });
      return new Response(JSON.stringify({ message: 'Post un-reposted' }), { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      } else {
        return new Response(JSON.stringify({ error: 'Unknown error' }), { status: 500 });
      }
    }
  }
}