import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import { type RaPayload, defaultHandler } from "ra-data-simple-prisma";
import { z } from "zod";
import { setupDb } from "../lib/prisma.server";

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
	context: { cloudflare },
}: LoaderFunctionArgs | ActionFunctionArgs) => {
	const body = handlerSchema.parse(await request.json()) as RaPayload;
	await using db = setupDb(cloudflare);
	const result = await defaultHandler(body, db.prisma);
	return json(result);
};

export const loader = handler;

export const action = handler;
