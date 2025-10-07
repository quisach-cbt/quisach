import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params, locals }) => {
    const userIdOrUsername = params.username;
    
    if (!userIdOrUsername) {
        throw error(404, "User not found");
    }
    
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userIdOrUsername },
                    { username: userIdOrUsername }
                ]
            },
            include: {
                organizationMember: {
                    include: {
                        organization: true
                    }
                },
                _count: {
                    select: {
                        followers: true,
                        following: true
                    }
                }
            }
        });

        if (!user) {
            throw error(404, "User not found");
        }
        
        let isFollowedByCurrentUser = false;

        if (locals.user) {
            isFollowedByCurrentUser = await prisma.userFollow.findFirst({
                where: {
                    followerId: locals.user.id,
                    followeeId: user.id
                }
            }) ? true : false;
        }

        const profile = await prisma.profile.findUnique({
            where: {
                userId: user.id
            }
        })

        const userData = {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            emailVerifiedAt: user.emailVerifiedAt,
            avatarUrl: user.avatarUrl,
            bio: profile?.bio,
            website: profile?.website,
            location: profile?.location,
            createdAt: user.createdAt,
            followerCount: user._count.followers,
            followingCount: user._count.following,
            point: profile?.point ?? 0,
            isFollowedByCurrentUser: isFollowedByCurrentUser,
            organizations: user.organizationMember.map(membership => ({
                id: membership.organization.id,
                name: membership.organization.name,
                logoUrl: membership.organization.logoUrl
            }))
            // rank: user.rank,
            // solvedProblems: 0,
            // contributionCount: 0, 
        };

        return {
            user: userData
        };
    } catch (err) {
        console.error('Error loading user profile:', err);
        throw error(500, "Failed to load user profile");
    }
}) satisfies LayoutServerLoad;