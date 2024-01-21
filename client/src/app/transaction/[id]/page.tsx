import { getTransactionById } from "@/api_calls/get"
import FlaggedTransaction from "@/components/FlaggedTransaction"
import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Transaction({
  params,
}: {
  params: { id: string }
}) {
  const token = cookies().get("access-token")
  if (!token) redirect("/login")

  const transaction = await getTransactionById(params.id, token)

  if (!transaction.data || transaction.data.processed)
    return <div>This page does not exist</div>

  const { email_key, id } = transaction.data

  return (
    <FlaggedTransaction
      email_key={email_key}
      id={id}
      transaction={transaction.data.transaction}
    />
  )
}
