import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import { CDN_API_KEY } from '$env/static/private';
import { DEFAULT_AVATAR_URL } from '$lib/const';

export const load = (async({ locals }) => {
	if (!locals.user || locals.user.role !== 'ADMIN')
		throw error(403, { message: 'Unauthorized' });
}) satisfies PageServerLoad;

// export const actions = {
// 	default: async ({ request, locals }) => {
// 		if (!locals.user || locals.user.role !== 'ADMIN') {
// 			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
// 		}
	
// 		const data = await request.formData();
// 		const id = data.get('id') as string;
// 		const name = data.get('name') as string;
// 		const description = data.get('description') as string;
// 		const logoFile = data.get('logo') as File;
// 		const bannerFile = data.get('banner') as File;
// 		const adminUsername = data.get('adminUsername') as string;
// 		const website = data.get('website') as string;
	
// 		console.log(logoFile, bannerFile);
		
// 		if (!id || !name || !description || !adminUsername) return { message: 'Missing required fields' };

// 		try {
// 			let logoUrl = DEFAULT_AVATAR_URL;
// 			let bannerUrl = '';
	
// 			if (logoFile) {
// 				const logoFormData = new FormData();
// 				logoFormData.append('file', logoFile);
	
// 				const logoResponse = await fetch('https://cdn.btoi.info.vn/upload', {
// 					method: 'POST',
// 					headers: {
// 						'X-API-Key': CDN_API_KEY
// 					},
// 					body: logoFormData
// 				});
	
// 				if (!logoResponse.ok) {
// 					throw new Error('Failed to upload logo');
// 				}
	
// 				const logoData = await logoResponse.json();
// 				logoUrl = logoData.url;
// 			}
	
// 			if (bannerFile) {
// 				const bannerFormData = new FormData();
// 				bannerFormData.append('file', bannerFile);
	
// 				const bannerResponse = await fetch('https://cdn.btoi.info.vn/upload', {
// 					method: 'POST',
// 					headers: {
// 						'X-API-Key': CDN_API_KEY
// 					},
// 					body: bannerFormData
// 				});
	
// 				if (!bannerResponse.ok) {
// 					throw new Error('Failed to upload banner');
// 				}
	
// 				const bannerData = await bannerResponse.json();
// 				bannerUrl = bannerData.url;
// 			}
	
// 			const adminUser = await prisma.user.findUnique({
// 				where: {
// 					username: adminUsername
// 				}
// 			});
	
// 			if (!adminUser) {
// 				return new Response(JSON.stringify({ error: 'Admin user not found' }), { status: 404 });
// 			}
			
// 			try {
// 				const organization = await prisma.organization.create({
// 					data: {
// 						id,
// 						name,
// 						description,
// 						website,
// 						logoUrl,
// 						bannerUrl,
// 						OrganizationMember: {
// 							create: {
// 								userId: adminUser.id,
// 								role: 'ADMIN'
// 							}
// 						}
// 					}
// 				});
// 			} catch (error) {
// 				return new Response(JSON.stringify({ error: 'Failed to create organization' }), { status: 500 });
// 			}
	
// 			return new Response(JSON.stringify({ message: 'Organization created successfully' }), { status: 200 });
// 		} catch (error) {
// 			console.error('Error creating organization:', error);
// 			return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
// 		}
// 	}
// } satisfies Actions;