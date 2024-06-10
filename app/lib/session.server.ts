import { type AppLoadContext } from "@remix-run/cloudflare";

export const assertSession = async (
	request: Request,
	context: AppLoadContext,
) => {
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
	throw new Response("not found", { status: 404 });
};

export const assertAdminSession = async (
	request: Request,
	context: AppLoadContext,
) => {
	const user = await assertSession(request, context);
	const superAdminDiscordIds =
		context.cloudflare.env.SUPER_ADMIN_DISCORD_ID.split(",");
	const isSuperAdmin = superAdminDiscordIds.includes(user.discordId);
	if (isSuperAdmin || user.isAdmin) {
		return { ...user, isSuperAdmin };
	}
	throw new Response("not found", { status: 404 });
};
