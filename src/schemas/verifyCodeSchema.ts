import * as z from "zod";

export const verifyCodeSchema = z.object({
    code: z.string().length(6, { message: "Verification code must be 6 characters" })
})