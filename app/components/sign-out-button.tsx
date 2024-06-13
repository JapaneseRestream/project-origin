import { Button } from "@radix-ui/themes";
import { useFetcher } from "@remix-run/react";

export const SignOutButton = () => {
	const fetcher = useFetcher();

	return (
		<fetcher.Form
			method="post"
			action="/sign-out"
			onSubmit={(event) => {
				if (!confirm("本当にログアウトしますか?")) {
					event.preventDefault();
				}
			}}
		>
			<Button type="submit">ログアウト</Button>
		</fetcher.Form>
	);
};
