import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import { type RaPayload, defaultHandler } from "ra-data-simple-prisma";
import { z } from "zod";

const handlerSchema = z.object({
	resource: z.string(),
	method: z.string(),
	params: z.any(),
	model: z.string().optional(),
});

const handler = async ({
	request,
	context: { prisma },
}: LoaderFunctionArgs | ActionFunctionArgs) => {
	const parseResult = handlerSchema.safeParse(await request.json());
	if (!parseResult.success) {
		throw new Response(parseResult.error.message, { status: 400 });
	}
	const result = await defaultHandler(parseResult.data as RaPayload, prisma);
	return json(result);
};

export const loader = handler;

export const action = handler;
