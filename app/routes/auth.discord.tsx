import { type ActionFunctionArgs, json } from "@remix-run/cloudflare";

export const action = async ({
	request,
	context: { authenticator },
}: ActionFunctionArgs) => {
	await authenticator.authenticate("discord", request);
	return json(null);
};
