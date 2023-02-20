import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export function AuthGuard({ children }: { children: JSX.Element }) {
  const { status, data: user } = useSession();

  // const { user, initializing, setRedirect } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // remember the page that user tried to access
      // setRedirect(router.route);
      // router.push("/auth/signin");
      signIn();
    }
  }, [status, router]);

  /* show loading indicator while the auth provider is still initializing */
  if (status === "loading") {
    return <h1>Application Loading</h1>;
  }

  // if auth initialized with a valid user show protected page
  if (status === "authenticated") {
    return <>{children}</>;
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
}
