"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginSchema } from '@/schemas/loginInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Chrome, Github, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

function SignInPage() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })

      if (result?.error) {
        toast.error(result.error)
      }

      if (result?.url) {
        router.replace("/dashboard")
      }
    } catch (error) {
      toast.error("Failed to login")
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
          <p className="mb-4 font-bold">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Username or Email" {...field} />
                  </FormControl>
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
                    <Input placeholder="Enter your Password" type='password' {...field} />
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
        <div className='flex justify-center items-center flex-col gap-2 font-semibold'>
          <span className='font-semibold'>OR SIGN IN WITH</span>
          <div className='w-full flex justify-around items-center flex-row gap-2'>
          <Button className='w-1/2 py-5' onClick={() => signIn("google", { callbackUrl: "/dashboard" })} variant="outline"> Google <Chrome /> </Button>
          <Button className='w-1/2 py-5' onClick={() => signIn("github", { callbackUrl: "/dashboard" })} variant="outline"> Github <Github /> </Button>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage

