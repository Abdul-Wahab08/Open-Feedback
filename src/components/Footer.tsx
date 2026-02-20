import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">   
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-white/70">
            &copy; {new Date().getFullYear()} Open Feedback. All rights reserved.
          </span>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </nav>

      </div>
    </footer>
  )
}


