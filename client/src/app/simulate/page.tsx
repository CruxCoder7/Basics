"use client"
import { getUser } from "@/api_calls/get"
import { Loading } from "@/components/Loading"
import { UserProfile } from "@/components/UserProfile"
import { useQuery } from "@tanstack/react-query"

export default function Simulate() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  })

  if (isLoading) return <Loading />
  return <UserProfile user={user} />
}
