"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TransactionForm } from "./TransactionForm"

export function UserProfile({ user }: { user: any }) {
  const [open, setOpen] = useState(false)

  const message = user.isHighSpender
    ? "You are a Generous Spender"
    : "You are a Frugal Individual"

  return (
    <div
      className={`overflow-y-hidden min-h-screen flex justify-center flex-col gap-10 items-center py-10`}
    >
      <div
        className={`w-full max-w-2xl p-8 bg-white rounded-lg shadow-md  flex flex-col ${
          open && "hidden"
        }`}
      >
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-900  mb-4">
            Your User Profile
          </h1>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold text-gray-900  mt-4">
              {user.name}
            </h2>
            <span className="inline-block bg-[#5651e5] text-white px-3 py-1 rounded-full text-sm font-medium mt-2">
              {message}
            </span>
          </div>
        </div>
        <Button
          onClick={() => setOpen(!open)}
          className="mt-8 bg-black text-white w-full rounded-md text-sm font-medium hover:opacity-75"
        >
          Simulate a Transaction
        </Button>
      </div>
      {open && (
        <div className="w-full flex items-center justify-center my-[-1rem]">
          <TransactionForm user={user} setOpen={setOpen} />
        </div>
      )}
    </div>
  )
}
