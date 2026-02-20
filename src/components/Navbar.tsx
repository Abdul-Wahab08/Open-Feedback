"use client"
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { User } from 'next-auth'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { searchUserSchema } from '@/schemas/searchUserSchema'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { useParams, usePathname, useRouter } from 'next/navigation'
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import { toast } from 'sonner'
import { useDebounceCallback } from 'usehooks-ts'

function Navbar() {

  const [searchedUsers, setSearchedUsers] = useState<string[]>([])
  const [isFound, setIsFound] = useState(false)
  const [showUsername, setShowUsername] = useState(false)
  const [active, setActive] = useState(-1)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const { data: session } = useSession()
  const user: User = session?.user as User

  const form = useForm<z.infer<typeof searchUserSchema>>({
    resolver: zodResolver(searchUserSchema),
    defaultValues: {
      searchUser: ""
    }
  })

  const router = useRouter()
  let controller: AbortController

  const debounced = useDebounceCallback(async (user: string) => {
    if (!user) {
      setSearchedUsers([])
      setShowUsername(false)
      setIsFound(false)
      return
    }

    setShowUsername(true)
    controller?.abort()
    controller = new AbortController()

    try {
      const response = await axios.get(`/api/get-users?username=${user}`, {
        signal: controller.signal
      })
      console.log("Result of fetching users: ", response)
      setIsFound(false)
      setSearchedUsers(response.data.users)
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      if (axiosError.response?.data.message === "User not found") {
        setSearchedUsers([])
        setIsFound(true)
        setShowUsername(false)
        return
      }
      toast.error(axiosError.response?.data.message)
    }

  }, 400)

  const onSubmit = (data: z.infer<typeof searchUserSchema>) => {
    setShowUsername(false)
    inputRef.current?.blur()
    router.push(`/u/${data.searchUser}`)
  }

  const handleClick = (username: string) => {
    form.setValue("searchUser", username)
    inputRef.current?.blur()
    router.push(`/u/${username}`)
  }

  const pathname = usePathname()
  const params = useParams()
  const username = params.username as string || undefined

  useEffect(() => {
    if (!username) return
    form.setValue("searchUser", username)
    setSearchedUsers([])
    setShowUsername(false)
    setIsFound(false)
  }, [pathname, username])

  useEffect(() => {
    setActive(-1)
  }, [searchedUsers])

  useEffect(() => {
    if (active < 0 || !listRef.current) return
    const el = listRef.current.children[active] as HTMLElement
    el?.scrollIntoView({ block: "nearest" })
  }, [active])


  return (
    <nav className="p-3 md:p-4 shadow-md bg-black/95 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-lg sm:text-xl font-bold" href="/">Open Feedback</Link>
        {
          session ?
            <>
              <span className="mr-4 my-2 md:my-0 font-semibold hidden sm:flex">Welcome, {user.username || user.email}</span>
              <Button onClick={() => signOut()} className="w-20 bg-slate-100 text-black" variant='outline'>Logout</Button>
            </>
            :
            <Link href="/sign-in">
              <Button className="w-20 bg-slate-100 text-black" variant={'outline'}>Sign In</Button>
            </Link>
        }
      </div>
      <div className="container mx-auto mt-6 flex flex-col items-center gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full max-w-md items-center gap-2'>
            <FormField
              control={form.control}
              name="searchUser"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Search"
                      type='text' {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      onKeyDown={(e) => {
                        if (searchedUsers.length === 0) return

                        if (e.key === "ArrowDown") {
                          e.preventDefault()
                          setActive((active) => active < searchedUsers.length - 1 ? active + 1 : 0)
                        }

                        if (e.key === "ArrowUp") {
                          e.preventDefault()
                          setActive((active) => active > 0 ? active - 1 : searchedUsers.length - 1)
                        }

                        if (e.key === "Enter" && active >= 0) {
                          e.preventDefault()
                          handleClick(searchedUsers[active])
                        }

                        if (e.key === "Escape") {
                          e.preventDefault()
                          setSearchedUsers([])
                        }
                      }}
                      ref={(r) => {
                        field.ref(r)
                        inputRef.current = r
                      }}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="secondary" type='submit' className="h-10 px-4"> <Search className="h-4 w-4" /></Button>
          </form>
        </Form>
        {showUsername && searchedUsers.length > 0 && (
          <div className="w-full max-w-md rounded-md border bg-background p-2 shadow-sm">
            <div ref={listRef} className="flex flex-col gap-2 max-h-60 overflow-y-auto no-scrollbar">
              {searchedUsers.map((username, index) => (
                <Button
                  key={username}
                  variant="ghost"
                  className={`justify-start text-left text-black hover:bg-muted ${active === index ? "bg-muted border-black border-2" : ""}`}
                  onClick={() => { handleClick(username) }}
                >
                  {username}
                </Button>
              ))}
            </div>
          </div>
        )}
        {searchedUsers.length < 1 && isFound && (
          <p className="text-sm text-red-600">User not found</p>
        )}
      </div>
    </nav>
  )
}

export default Navbar
