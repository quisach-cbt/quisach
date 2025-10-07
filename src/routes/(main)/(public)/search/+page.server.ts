import { prisma } from "$prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
	const query = url.searchParams.get("q");
	// const results = await prisma.books.findMany({
	// 	where: {
	// 		title: {
	// 			contains: query,
	// 			mode: "insensitive"
	// 		}
	// 	}
	// });
	// return {
	// 	results
	// };
};