import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";

export async function isAuthedOnServer() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return Boolean(token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
}
