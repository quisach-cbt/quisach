import { prisma } from "$lib/server/prisma";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	try {
		await prisma.organizationMember.delete({
			where: {
				id
			}
		})
		return new Response(JSON.stringify({ message: "Member deleted successfully" }), {
			status: 200,
			headers: {
				"Content-Type": "application/json"
			}
		});
	} catch (error) {
		console.error("Error deleting member:", error);
		return new Response(JSON.stringify({ message: "Failed to delete member" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json"
			}
		});
	}
}