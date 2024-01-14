"use client"
import { Loading } from "@/components/Loading"
import { UserProfile } from "@/components/UserProfile"
import { useQuery } from "@tanstack/react-query"

async function getUser() {
  const userFetch = await fetch("http://localhost:5000/user", {
    credentials: "include",
  })
  const user = await userFetch.json()
  return user
}

export default function Simulate() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  })

  if (isLoading) return <Loading />
  return <UserProfile user={user} />
}
