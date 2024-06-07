import { type LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({
	request,
	context: { authenticator },
}: LoaderFunctionArgs) => {
	return authenticator.authenticate("discord-registration", request, {
		successRedirect: "/",
	});
};

export default () => {
	return null;
};
