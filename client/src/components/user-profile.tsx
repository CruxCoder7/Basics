"use client"
import { Button } from "@/components/ui/button"

export function UserProfile({ user }: { user: any }) {
  return (
    <div className="bg-slate-300 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md  flex flex-col">
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-900  mb-4">
            Your User Profile
          </h1>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold text-gray-900  mt-4">
              {user.name}
            </h2>
            <span className="inline-block bg-[#5651e5] text-white px-3 py-1 rounded-full text-sm font-medium mt-2">
              You are a Frugal Individual
            </span>
          </div>
        </div>
        <Button className="mt-8 bg-black text-white w-full rounded-md text-sm font-medium hover:opacity-75">
          Simulate a Transaction
        </Button>
      </div>
    </div>
  )
}
