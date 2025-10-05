import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load = (async () => {
  // const page = Number(url.searchParams.get('page') || '1');
  const pageSize = 15;
  
  const problems = await prisma.problem.findMany({
    take: pageSize,
    include: {
      category: true,
      authors: {
        include: {
          user: true
        }
      },
    }
  });

  return {
    problems
  };
}) satisfies PageServerLoad;