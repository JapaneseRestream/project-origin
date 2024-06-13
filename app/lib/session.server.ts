import { type AppLoadContext, redirect } from "@remix-run/cloudflare";

export const getUser = async (request: Request, context: AppLoadContext) => {
	const session = await context.authenticator.isAuthenticated(request);
	if (session) {
		const user = await context.prisma.users.findUnique({
			where: { id: session.userId },
			select: {
				id: true,
				discordId: true,
				displayName: true,
				isAdmin: true,
			},
		});
		if (user) {
			return user;
		}
	}
	return null;
};

export const assertUser = async (request: Request, context: AppLoadContext) => {
	const user = await getUser(request, context);
	if (user) {
		return user;
	}
	throw new Response("not found", { status: 404 });
};

export const assertNoUser = async (
	request: Request,
	context: AppLoadContext,
) => {
	const user = await getUser(request, context);
	if (!user) {
		return;
	}
	throw redirect("/");
};

export const assertAdmin = async (
	request: Request,
	context: AppLoadContext,
) => {
	const user = await assertUser(request, context);
	const superAdminDiscordIds =
		context.cloudflare.env.SUPER_ADMIN_DISCORD_ID.split(",");
	const isSuperAdmin = superAdminDiscordIds.includes(user.discordId);
	if (isSuperAdmin || user.isAdmin) {
		return { ...user, isSuperAdmin };
	}
	throw new Response("not found", { status: 404 });
};
