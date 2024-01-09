import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const token = cookies().get("access-token")
  console.log("next", token)
  //   const res = await fetch("http://localhost:5000/user", {
  //     headers: {
  //       cookie: token?.value!,
  //     },
  //   })
  //   const data = await res.json()
  console.log(request.cookies.get("access-token"))
  return Response.json({ msg: "hi" })
}
