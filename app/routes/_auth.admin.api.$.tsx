import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import { type RaPayload, defaultHandler } from "ra-data-simple-prisma";
import { z } from "zod";

export const resourceSchema = <
	TResource extends string,
	TMethod extends RaPayload["method"],
>(
	resource: TResource,
	methods?: readonly [TMethod, ...TMethod[]],
) => {
	return z.object({
		resource: z.literal(resource),
		method: methods ? z.enum(methods) : z.string(),
		params: z.unknown(),
		model: z.string().optional(),
	});
};

const handlerSchema = z.union([
	resourceSchema("users", ["getList", "getOne"]),
	resourceSchema("events"),
]);

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
