import type { RequestHandler } from "@sveltejs/kit";
import { CDN_API_KEY } from "$env/static/private";
import { prisma } from "$lib/server/prisma";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user || locals.user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  }

  const data = await request.formData();
  const id = data.get('id') as string;
  const name = data.get('name') as string;
  const description = data.get('description') as string;
  const adminUsername = data.get('adminUsername') as string;
  const website = data.get('website') as string;
  const logoFile = data.get('logoFile') as File ?? null;
  const bannerFile = data.get('bannerFile') as File ?? null;

  if (id && /\s/.test(id)) {
    return new Response(JSON.stringify({ error: 'Organization ID cannot contain spaces' }), { status: 400 });
  }

  if (!id || !name || !description || !adminUsername) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    let logoUrl = '';
    let bannerUrl = '';

    if (logoFile) {
      const logoFormData = new FormData();
      logoFormData.append('file', logoFile);

      const logoResponse = await fetch('https://cdn.btoi.info.vn/upload', {
        method: 'POST',
        headers: {
          'X-API-Key': CDN_API_KEY
        },
        body: logoFormData
      });

      if (!logoResponse.ok) {
        return new Response(JSON.stringify({ error: 'Failed to upload logo' }), { status: 500 });
      }

      const logoData = await logoResponse.json();
      logoUrl = logoData.url;
    }

    if (bannerFile) {
      const bannerFormData = new FormData();
      bannerFormData.append('file', bannerFile);

      const bannerResponse = await fetch('https://cdn.btoi.info.vn/upload', {
        method: 'POST',
        headers: {
          'X-API-Key': CDN_API_KEY
        },
        body: bannerFormData
      });

      if (!bannerResponse.ok) {
        return new Response(JSON.stringify({ error: 'Failed to upload banner' }), { status: 500 });
      }

      const bannerData = await bannerResponse.json();
      bannerUrl = bannerData.url;
    }

    const adminUser = await prisma.user.findUnique({
      where: {
        username: adminUsername
      }
    });

    if (!adminUser) {
      return new Response(JSON.stringify({ error: 'Admin user not found' }), { status: 404 });
    }
    
    try {
      const organization = await prisma.organization.create({
        data: {
          id,
          name,
          description,
          website,
          logoUrl,
          bannerUrl,
          OrganizationMember: {
            create: {
              userId: adminUser.id,
              role: 'ADMIN'
            }
          }
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to create organization' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Organization created successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}