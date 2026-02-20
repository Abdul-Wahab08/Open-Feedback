"use client"
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { signUpSchema } from '@/schemas/signUpSchema'
import { useDebounceCallback } from 'usehooks-ts'
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation";
import { toast } from 'sonner'
import { apiResponse } from '@/types/apiResponse'
import Link from 'next/link';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

function SigUpPage() {

    const [username, setUsername] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [usernameMessage, setUsernameMessage] = useState('')
    const [checkUsername, setCheckUsername] = useState(false)

    const router = useRouter()

    const debounced = useDebounceCallback(setUsername, 500)

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setCheckUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get<apiResponse>(`/api/check-username-unique?username=${username}`)
                    console.log("Response of unique username: ", response)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<apiResponse>
                    setUsernameMessage(axiosError.response?.data.message || "Error occurs while checking username is unique")
                } finally {
                    setCheckUsername(false)
                }
            }
        }

        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<apiResponse>("/api/sign-up", data)
            toast.success(response.data.message)
            router.replace(`/verify/${username}`)
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast.error(axiosError.response?.data.message || "Error occurs while submitting the form")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 my-4 space-y-8 bg-white rounded-lg shadow-md">
                <div className="space-y-6 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Open Feedback
                    </h1>
                    <p className="mb-4 font-bold">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Username" {...field} onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }
                                        }
                                        />
                                    </FormControl>
                                    {checkUsername && <Loader2 className='animate-spin' />}
                                    {usernameMessage && (
                                        <p className={`text-sm ${usernameMessage === "User is Unique" ? "text-green-600" : "text-red-600"}`}>
                                            {usernameMessage}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your Email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        We will send you a verification code.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Create Strong Password" {...field} type='password' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ?
                                <>
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    <p>Loading...</p>
                                </>
                                : <p>Submit</p>
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href={"/sign-in"} className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SigUpPage
