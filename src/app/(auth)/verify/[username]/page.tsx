"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { verifyCodeSchema } from '@/schemas/verifyCodeSchema';
import { apiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import * as z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

function VerifyPage() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const params = useParams()

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema)
  })

  const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<apiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code
      })
      toast.success(response.data.message)
      router.replace("/sign-in")
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message || "Error Occurs while verifying the verification code")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Open Feedback
          </h1>
          <p className="mb-4 font-bold">Complete your Verification</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
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
                : <p>Submit</p>}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyPage
