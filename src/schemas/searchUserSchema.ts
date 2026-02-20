import * as z from "zod";

export const searchUserSchema = z.object({
    searchUser: z.string().min(1, {message: "Search query cannot be empty"})
})