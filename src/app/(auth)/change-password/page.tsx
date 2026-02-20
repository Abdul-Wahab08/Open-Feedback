"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { changePasswordSchema } from "@/schemas/changePasswordSchema"
import { apiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import * as z from "zod"

function page() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPass: "",
            newPass: "",
            confirmNewPass: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.patch<apiResponse>("/api/change-current-password", {
                oldPassword: data.oldPass,
                newPassword: data.newPass
            })
            toast.success(response.data.message)
            router.replace("/dashboard")
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast.error(axiosError.response?.data.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 my-4 space-y-8 bg-white rounded-lg shadow-md">
                <div className="space-y-6 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Open Feedback
                    </h1>
                    <p className="mb-4 font-bold">Change your current password</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="oldPass"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Old Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your old Password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPass"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your new Password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmNewPass"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Confirm your new Password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ?
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <p>Loading...</p>
                                </>
                                : <p>Submit</p>}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page