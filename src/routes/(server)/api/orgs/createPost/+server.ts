import { prisma } from "$lib/server/prisma";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const data = await request.formData();
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  const organizationId = data.get('organizationId') as string;

  if (!title || !content || !organizationId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const isAdmin = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      userId: locals.user.id,
      OR: [
        { role: 'ADMIN' },
        { role: 'STAFF' }
      ]
    }
  })

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        organizationId,
        authorId: locals.user.id,
        visibility: 'PUBLIC',
        pinned: false,
      }
    });

    return new Response(JSON.stringify(post), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to create post' }), { status: 500 });
  }
}