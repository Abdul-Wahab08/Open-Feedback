"use client"
import { useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { usePathname, useRouter} from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/schemas/messageSchema'
import z from 'zod'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { apiResponse } from '@/types/apiResponse'
import { CopyCheckIcon, CopyIcon, HomeIcon, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

function page({username}: {username: string}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [messages, setMessages] = useState<string[]>([
    "What’s something fun you did recently?",
    "If you could visit any place, where would it be?",
    "What makes you smile on a normal day?"
  ])
  const [profileUrl, setProfileUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: ""
    }
  })

  const { register, setValue, watch } = form
  const watchMessage = watch("message")
  const messageCount = watchMessage.length

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<apiResponse>("/api/send-message", { username: username, content: data.message })
      setValue("message", "")
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const streamSuggestMessages = async () => {
    setIsSuggesting(true)
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
      })

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      let output = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        output += decoder.decode(value, { stream: true })
        const arr = output.replace(' ""  ', '').split("||")
        setMessages(arr)
      }
    } catch (error: any) {
      console.log("Error occurs while suggesting messages", error)
      toast.error(error?.message || "Something went wrong while suggesting messages")
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleMessageClick = (message: string) => {
    setValue("message", message)
  }

  const pathname = usePathname()
  useEffect(() => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    setProfileUrl(`${baseUrl}${pathname}`)
  }, [pathname])

  const handleCopyProfileUrl = () => {
    setCopied(true)
    navigator.clipboard.writeText(profileUrl)
    toast.info("Copy to Clipboard")

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (

    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-6xl mx-auto py-8 space-y-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Public Profile Link
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col items-center"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full max-w-xl">
                  <FormDescription className="text-black font-semibold text-center sm:text-left">
                    Send message anonymously to @{username}
                  </FormDescription>
                  <FormControl>
                    <Textarea {...register("message")}
                      placeholder="Type your message here"
                      {...field}
                      minLength={10}
                      maxLength={300}
                    />

                  </FormControl>
                  <FormDescription>
                    {300 - messageCount} left
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center ga1/3">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </form>
        </Form>
        <section className="flex flex-col items-center  p1/3">
          <div className="w-full max-w-xl space-1/3 text-center sm:text-left">
            <Button onClick={streamSuggestMessages} className=" sm:w-auto" disabled={isSuggesting}>
              {isSuggesting
                ?
                <>
                  <Loader2 className='animate-spin w-4 h-4' />
                  <span>Loading...</span>
                </>
                : <span>Suggest Messages</span>}
            </Button>
            <p className="font-semibold text-sm m1/3 my-2">
              Click on any message below to select it.
            </p>
            <div className="w-full p-8 space-y-4 bg-white rounded-lg shadow-md">
              <h2 className='text-xl font-bold'>Messages</h2>
              {messages.map((message, index) => (
                <Input key={index} className='text-center cursor-pointer text-[12px] sm:text-sm' onClick={() => handleMessageClick(message)} value={message} readOnly />
              ))}
            </div>
            <div className='flex justify-center items-center gap-2 my-4'>
              <Button onClick={() => router.replace("/")} className='sm:w-1/3 w-1/2 p-4'><HomeIcon /> Home</Button>
              <Button onClick={handleCopyProfileUrl} className='sm:w-1/3 w-1/2 p-4' disabled={copied}>{
                copied ? <CopyCheckIcon /> :
                  <CopyIcon />} <span>{copied ? "Copied" : "Copy Profile Url"}</span>
              </Button>
            </div>
          </div>
        </section>
        <Separator />
        <div className='flex flex-col justify-center items-center gap-1'>
          <p>Doesn't have any account?</p>
          <Link href={"/sign-up"}>
            <Button variant="link">Create your Account</Button>
          </Link>
        </div>
      </div>
    </div>

  )
}

export default page