import * as z from "zod";

export const changePasswordSchema = z.object({
    oldPass: z.string(),
    newPass: z.string().min(6, { message: "Password must consists at least six characters" }),
    confirmNewPass: z.string()
}).refine((data) => data.newPass === data.confirmNewPass, {
    message: "Password do not match",
    path: ["confirmNewPass"]
})