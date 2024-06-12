import { type ActionFunctionArgs } from "@remix-run/cloudflare";

export const action = ({
	request,
	context: { authenticator },
}: ActionFunctionArgs) => {
	const referer = request.headers.get("Referer");
	return authenticator.logout(request, { redirectTo: referer ?? "/" });
};
