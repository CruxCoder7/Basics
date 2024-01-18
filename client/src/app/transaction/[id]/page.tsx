import FlaggedTransaction from "@/components/FlaggedTransaction"
import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Transaction({
  params,
}: {
  params: { id: string }
}) {
  if (params.id === "success") return <div>Transaction with id {params.id}</div>

  const token = cookies().get("access-token")
  if (!token) redirect("/login")

  const transaction = await axios.get(
    `http://localhost:5000/transaction/${params.id}`,
    {
      headers: {
        cookie: token.value,
      },
    }
  )

  if (!transaction.data || transaction.data.processed)
    return <div>This page does not exist</div>

  const { email_key, id } = transaction.data
  return <FlaggedTransaction email_key={email_key} id={id} />
}
