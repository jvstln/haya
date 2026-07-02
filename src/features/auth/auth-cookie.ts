import Cookies from "js-cookie";
import type { AuthState } from "./auth.type";

/** Read access token from cookie - works on both client and server */
export async function getAuth(): Promise<AuthState | null> {
  try {
    let authString: string | undefined;

    if (typeof window === "undefined") {
      // Server-side: use next/headers
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      authString = cookieStore.get("haya.auth")?.value;
    } else {
      // Client-side: use js-cookie
      authString = Cookies.get("haya.auth");
    }

    const auth: AuthState = JSON.parse(authString || "{}").state;

    if (!auth) return null;

    return auth;
  } catch {
    return null;
  }
}
