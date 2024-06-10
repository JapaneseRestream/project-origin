import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import { type RaPayload, defaultHandler } from "ra-data-simple-prisma";
import { z } from "zod";
import { assertAdminSession } from "../lib/session.server";
import { P, match } from "ts-pattern";

const getMethods = [
	"getList",
	"getOne",
	"getMany",
	"getManyReference",
] as const;
const createMethods = ["create"] as const;
const updateMethods = ["update", "updateMany"] as const;
const deleteMethods = ["delete", "deleteMany"] as const;

const handlerSchema = z.object({
	resource: z.string(),
	method: z.enum([
		...getMethods,
		...createMethods,
		...updateMethods,
		...deleteMethods,
	]),
	params: z.any(),
	model: z.string().optional(),
});

const handler = async ({
	request,
	context,
}: LoaderFunctionArgs | ActionFunctionArgs) => {
	const [user, payload] = await Promise.all([
		assertAdminSession(request, context),
		request.json(),
	]);

	const parseResult = handlerSchema.safeParse(payload);
	if (!parseResult.success) {
		throw new Response(parseResult.error.message, { status: 400 });
	}

	const data = parseResult.data;

	match({ data, user }).with(
		{
			data: { resource: "users", method: P.not(P.union(...getMethods)) },
			user: { isSuperAdmin: P.not(true) },
		},
		() => {
			throw new Response("unauthorized", { status: 401 });
		},
	);

	const result = await defaultHandler(
		parseResult.data as RaPayload,
		context.prisma,
	);
	return json(result);
};

export const loader = handler;

export const action = handler;
