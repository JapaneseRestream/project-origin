import { Button, Link as RadixLink } from "@radix-ui/themes";
import { Link as RemixLink } from "@remix-run/react";
import type { ComponentProps } from "react";

export const Link = (props: ComponentProps<typeof RemixLink>) => {
	return (
		<RadixLink asChild>
			<RemixLink {...props} />
		</RadixLink>
	);
};

export const ButtonLink = (props: ComponentProps<typeof RemixLink>) => {
	return (
		<Button asChild>
			<RemixLink {...props} />
		</Button>
	);
};

export { RadixLink, RemixLink };
