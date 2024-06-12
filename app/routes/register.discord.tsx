import { type ActionFunctionArgs } from "@remix-run/cloudflare";

export const action = async ({
	request,
	context: { authenticator },
}: ActionFunctionArgs) => {
	await authenticator.authenticate("discord-registration", request);
	return new Response(null);
};
