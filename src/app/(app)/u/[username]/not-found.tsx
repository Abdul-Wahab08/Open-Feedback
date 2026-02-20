export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold">User not found</h1>
      <p className="mt-2 text-gray-500">
        This profile does not exist or was deleted.
      </p>
    </div>
  )
}
