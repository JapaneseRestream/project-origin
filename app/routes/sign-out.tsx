import { type ActionFunctionArgs } from "@remix-run/cloudflare";

export const action = async ({
	request,
	context: { authenticator },
}: ActionFunctionArgs) => {
	try {
		await authenticator.logout(request, { redirectTo: "" });
	} catch (error) {
		if (!(error instanceof Response)) {
			throw error;
		}
	}
	return new Response(null);
};
