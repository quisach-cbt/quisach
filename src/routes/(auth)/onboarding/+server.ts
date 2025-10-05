import { Gender } from '@prisma/client';
import { CDN_API_KEY } from '$env/static/private';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const userid = formData.get('userid') as string;
        const displayName = formData.get('displayName') as string;
        const gender = formData.get('gender') as Gender;
        const location = formData.get('location') as string;
        const bio = formData.get('bio') as string;
        const pronouns = formData.get('pronouns') as string;
        const website = formData.get('website') as string;
        const avatarFile = formData.get('avatar') as File | null;
        
        let avatarUrl = undefined;
        
        if (avatarFile && avatarFile instanceof File) {
            const avatarFormData = new FormData();
            avatarFormData.append('file', avatarFile);

            const avatarResponse = await fetch('https://cdn.btoi.info.vn/upload', {
                method: 'POST',
                headers: {
                    'X-API-Key': CDN_API_KEY
                },
                body: avatarFormData
            });
            
            if (!avatarResponse.ok) {
                throw new Error('Failed to upload avatar');
            }
            
            const avatarData = await avatarResponse.json();
            avatarUrl = avatarData.url;
        }
        
        const userData: any = {
            displayName
        };
        
        if (avatarUrl) {
            userData.avatarUrl = avatarUrl;
        }
        
        await prisma.user.update({
            where: {
                id: userid
            },
            data: userData
        });
        
        const profileData: any = {};
        
        if (location) profileData.location = location;
        if (bio) profileData.bio = bio;
        if (pronouns) profileData.pronouns = pronouns;
        if (website) profileData.website = website;
        if (gender) profileData.gender = gender;
        
        if (Object.keys(profileData).length > 0) {
            await prisma.profile.update({
                where: {
                    userId: userid
                },
                data: profileData
            });
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Profile updated successfully'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: error.message ?? 'An error occurred while updating your profile'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
