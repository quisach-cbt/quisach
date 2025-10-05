import { prisma } from "$lib/server/prisma";
import { CDN_API_KEY } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.formData();
  const id = body.get("id") as string;
  const name = body.get("name") as string;
  const description = body.get("description") as string;
  const website = body.get("website") as string;
  const logoFile = body.get("logoFile") as File;
  const bannerFile = body.get("bannerFile") as File;

  let logoUrl: string | null = null;
  let bannerUrl: string | null = null;

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
      return new Response("Failed to upload logo", { status: 500 });
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
      return new Response("Failed to upload banner", { status: 500 });
    }

    const bannerData = await bannerResponse.json();
    bannerUrl = bannerData.url;
  }

  try {
    const data = {
      name,
      description,
      website,
      logoUrl: '',
      bannerUrl: ''
    }

    if (logoUrl) {
      data.logoUrl = logoUrl;
    }

    if (bannerUrl) {
      data.bannerUrl = bannerUrl;
    }

    const updatedOrg = await prisma.organization.update({
      where: { id },
      data: data
    });

    return new Response(JSON.stringify(updatedOrg), { status: 200 });
  } catch (error) {
    console.error("Error updating organization:", error);
    return new Response("Failed to update organization", { status: 500 });
  }
};