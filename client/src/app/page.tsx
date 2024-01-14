"use client"
import Footer from "@/components/Footer"
import { Loading } from "@/components/Loading"
import MainSection from "@/components/MainSection"
import Navbar from "@/components/Navbar"
import { useQuery } from "@tanstack/react-query"

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
      <Footer />
    </main>
  )
}
