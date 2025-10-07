import type { RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import type { PostVisibility } from "@prisma/client";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  }

  const data = await request.formData();
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  const isPinned = data.get('isPinned') === 'on' ? true : false;
  const visibility = data.get('visibility') as string;

  if (!title || !content) {
    return new Response(JSON.stringify({ error: 'Title and content are required' }), { status: 400 });
  }

  if (title.length > 100) {
    return new Response(JSON.stringify({ error: 'Title is too long' }), { status: 400 });
  }

  if (content.length > 5000) {
    return new Response(JSON.stringify({ error: 'Content is too long' }), { status: 400 });
  }

  const visibilityInType = visibility as PostVisibility;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      pinned: isPinned,
      visibility: visibilityInType,
      authorId: locals.user.id,
    },
  })

  if (!post) {
    return new Response(JSON.stringify({ error: 'Failed to create post' }), { status: 500 });
  }

  return new Response(JSON.stringify({ post }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}