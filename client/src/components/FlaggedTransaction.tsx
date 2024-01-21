"use client"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { useState } from "react"
import axios from "axios"

export default function FlaggedTransaction({
  email_key,
  id,
  transaction,
}: {
  email_key: string
  id: number
  transaction: Object
}) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const updateTransaction = async ({
    id,
    cancelled,
  }: {
    id: number
    cancelled: boolean
  }) => {
    const request = await axios.put(
      "http://localhost:5000/transaction",
      {
        id,
        cancelled,
      },
      { withCredentials: true }
    )

    return request.data
  }

  const updateUser = async (transaction: Object) => {
    const request = await axios.put(
      "http://localhost:5000/user",
      {
        transaction,
      },
      { withCredentials: true }
    )

    return request.data
  }

  const handleContinue = async () => {
    await updateTransaction({ id, cancelled: false })
    await updateUser(transaction)
    router.push("/dashboard")
  }

  const handleCancel = async () => {
    if (code !== email_key) {
      setError("Incorrect Code")
      setTimeout(() => {
        setError("")
      }, 3000)
    } else {
      await updateTransaction({ id, cancelled: true })
      router.push("/dashboard")
    }
  }

  return (
    <div
      className={`overflow-y-hidden min-h-screen flex justify-center flex-col gap-10 items-center py-10`}
    >
      <div
        className={`w-full max-w-3xl p-8 bg-white rounded-lg shadow-md  flex flex-col`}
      >
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-900  mb-4">
            Your Transaction has been <b className="text-red-500">Flagged</b>
          </h1>
          <div className="flex flex-col">
            <h2 className="text-md  text-gray-900  mt-4">
              Enter the code sent to your email to cancel the transaction
            </h2>
            <input
              type="text"
              id="email_key"
              name="email_key"
              placeholder="Your Code"
              className="mt-2 w-full border-2 p-5 outline-none"
              onChange={(e) => setCode(e.target.value)}
            />
            <p className="text-center text-red-600">{error}</p>
          </div>
        </div>
        <Button
          className="mt-8 bg-red-500 text-white w-full rounded-md text-sm font-medium hover:opacity-75"
          onClick={handleCancel}
        >
          Cancel Transaction
        </Button>
        <br />
        <h1 className="text-center">(OR)</h1>
        <Button
          className="mt-8 bg-[#5651e5] text-white w-full rounded-md text-sm font-medium hover:opacity-75"
          onClick={handleContinue}
        >
          Continue Transaction
        </Button>
      </div>
    </div>
  )
}
