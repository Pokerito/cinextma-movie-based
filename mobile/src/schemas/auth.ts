import * as z from "zod";

const AuthFormSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(25, "Username must not exceed 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    loginPassword: z.string(),
    confirm: z.string().min(1, "Password confirmation is required"),
    // Captcha token likely not needed for mobile native auth or handled differently
    captchaToken: z.string().optional(),
});

export const RegisterFormSchema = AuthFormSchema.omit({ loginPassword: true }).refine(
    (data) => data.password === data.confirm,
    {
        message: "Passwords do not match",
        path: ["confirm"],
    },
);

export const LoginFormSchema = AuthFormSchema.pick({
    email: true,
    loginPassword: true,
    captchaToken: true,
});

export const ForgotPasswordFormSchema = AuthFormSchema.pick({ email: true, captchaToken: true });

export type RegisterFormInput = z.infer<typeof RegisterFormSchema>;
export type LoginFormInput = z.infer<typeof LoginFormSchema>;
