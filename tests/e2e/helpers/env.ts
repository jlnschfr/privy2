function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Set it locally in .env or as a GitHub Actions secret.`,
    );
  }
  return value;
}

export const SUPABASE_URL = () => required("SUPABASE_URL");
export const SUPABASE_KEY = () => required("SUPABASE_KEY");
export const TEST_USER_EMAIL = () => required("TEST_USER_EMAIL");
export const TEST_USER_PASSWORD = () => required("TEST_USER_PASSWORD");
export const BASE_URL = () =>
  process.env.BASE_URL ?? "https://privy-notes2.netlify.app";
