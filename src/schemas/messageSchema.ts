import * as z from "zod";

export const messageSchema = z.object({
    message: z.string().min(10, { message: "Message must contain at least 10 characters." }).max(300, "Message must not contain 300 or above characters.")
})