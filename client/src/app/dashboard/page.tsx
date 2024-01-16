import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const token = cookies().get("access-token")

  if (!token) redirect("/login")

  const request = await axios.get("http://localhost:5000/user/dashboard", {
    headers: {
      cookie: token.value,
    },
  })

  return <div>{JSON.stringify(request.data)}</div>
}
