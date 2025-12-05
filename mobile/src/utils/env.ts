import { z } from "zod";

// We use process.env directly in Expo, but we might need a transform or library if it's not picked up.
// Generally in Expo SDK 49+, .env is supported out of the box for process.env.NEXT_PUBLIC_*.

const clientSchema = z.object({
    NEXT_PUBLIC_TMDB_ACCESS_TOKEN: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_URL: z.url().min(1),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const _env = clientSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables");
}

export const env = _env.data;
