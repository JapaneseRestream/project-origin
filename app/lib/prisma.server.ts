import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import type { Cloudflare } from "../../load-context";

export const setupDb = (cloudflare: Cloudflare) => {
	const prisma = new PrismaClient({
		adapter: new PrismaD1(cloudflare.env.DB),
	});
	return {
		prisma,
		[Symbol.asyncDispose]: async () => {
			await prisma.$disconnect();
		},
	};
};
