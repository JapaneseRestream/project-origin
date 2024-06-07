import { type ActionFunctionArgs } from "@remix-run/cloudflare";

export const action = async ({
	request,
	context: { authenticator },
}: ActionFunctionArgs) => {
	return authenticator.authenticate("discord", request);
};
