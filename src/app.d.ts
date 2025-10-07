import type { PrismaClient, User, Session } from './lib/server/prisma/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		interface PageData {
			currentUser: Omit<User, 'password'> | null;
		}
		// interface PageState {}	
		// interface Platform {}
	}
	var __prisma: PrismaClient
}

export {};
