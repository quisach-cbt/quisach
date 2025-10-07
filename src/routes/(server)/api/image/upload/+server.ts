import type { RequestHandler } from "./$types";
import { CDN_API_KEY } from "$env/static/private";

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = locals.user;
  const data = await request.formData();
  const file = data.get('file') as File;

  if (!user) {
    return new Response(JSON.stringify({ status: 'failed', message: 'User not found' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  if (!file) {
    return new Response(JSON.stringify({ status: 'failed', message: 'File is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('https://cdn.btoi.info.vn/upload', {
    method: 'POST',
    headers: {
      'X-API-Key': CDN_API_KEY
    },
    body: formData
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ status: 'failed', message: 'Failed to upload file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const responseData = await response.json();
  const fileUrl = responseData.url;

  return new Response(
    JSON.stringify({ status: 'success', message: 'File uploaded successfully', url: fileUrl }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}