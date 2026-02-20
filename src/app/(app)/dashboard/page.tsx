"use client"
import MessageCard from '@/components/MessageCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/User.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false)

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch("acceptMessages")

  const handleDeleteMessage = (messageId: String) => {
    messages.filter((message: Message) => message._id.toString() !== messageId)
  }

  const getAcceptMessageStatus = useCallback(async () => {
    setSwitchLoading(true)
    try {
      const response = await axios.get<apiResponse>("/api/accept-messages")
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message || "Failed to Fetch Messages Acceptance")
    } finally {
      setSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true)
    try {
      const response = await axios.get<apiResponse>("/api/get-user-messages")
      setMessages(response.data.messages || [])
      if (refresh === true) {
        toast.success("Refresh the Messages")
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message || "Failed to Refresh Messages")
    } finally {
      setLoading(false)
    }
  }, [setMessages])

  useEffect(() => {
    if (!(session && session.user)) return
    getAcceptMessageStatus()
    fetchMessages()
  }, [session, setValue, getAcceptMessageStatus, fetchMessages])

  const handleToggleSwitch = async () => {
    try {
      const response = await axios.post<apiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages
      })
      setValue("acceptMessages", !acceptMessages)
      toast.success(response.data.isAcceptingMessages || "Message acceptance toggled Successfully")
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message || "Failed to Toggle Messages Acceptance")
    }
  }

  if (!(session && session.user)) {
    return <div className='text-3xl font-bold text-center my-28'>Login First</div>
  }

  const username = session?.user.username
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Copy to Clipboard")
  }

  return (
    <div className='bg-white my-8 mx-4 md:mx-8 lg:mx-auto p-6 w-full rounded max-w-6xl'>
      <h1 className='text-3xl font-bold mb-8'>User Dashboard</h1>
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex sm:flex-row flex-col gap-2 sm:w-2/3 md:w-1/2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered bg-slate-100 rounded-lg w-full p-2 mr-2"
          />
          <Button className='w-15' onClick={handleCopyUrl}>Copy</Button>
        </div>
      </div>
      <Link href="/change-password" className='hover:underline mb-4 inline-block font-semibold'>Change your password</Link>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Message Acceptance</label>
        <Switch {...register("acceptMessages")} checked={acceptMessages} onCheckedChange={handleToggleSwitch} disabled={switchLoading} />
        <span className='ml-2'>{acceptMessages ? "On" : "Off"}</span>
      </div>
      <Separator />

      <Button className='my-1' variant="ghost" onClick={(e) => {
        e.preventDefault()
        fetchMessages(true)
      }}>
        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <RefreshCcw className='h-4 w-4' />}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? 
        <>
         <SkeletonCard /> <SkeletonCard />
          </>
         :
          messages.length > 0 ? messages.map((message) => (
          <MessageCard key={message._id.toString()} message={message} onDeleteMessage={handleDeleteMessage} />
        )) : <p className='text-lg font-semibold'>No Messages to Display</p>}
      </div>
    </div>
  )
}

export default page
