"use client"

import Navbar from "@/components/Navbar"
import MainSection from "@/components/MainSection"
import { useQuery } from "@tanstack/react-query"
import { Loading } from "@/components/Loading"

async function getUser() {
  const userFetch = await fetch("http://localhost:5000/user", {
    credentials: "include",
  })
  const user = await userFetch.json()
  return user
}

export default function Home() {
  const {
    data: user,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  })

  if (isLoading) return <Loading />

  if (isError) return <h1>Error</h1>

  return (
    <main>
      <Navbar user={user} />
      <MainSection user={user} />
    </main>
  )
}
