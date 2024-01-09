"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const router = useRouter()

  const register = async (e: any) => {
    e.preventDefault()
    const data = await axios.post("http://localhost:5000/register", {
      email,
      password,
      name,
    })

    console.log(data)
    if (data.status === 200) {
      router.push("/")
    } else {
      router.push("/register")
    }
  }

  return (
    <div className=" w-full flex items-center justify-center min-h-screen">
      <div className="p-4 w-[70%] border shadow-xl shadow-gray-400 rounded-xl">
        <form onSubmit={register}>
          <div className="grid md:grid-cols-2 gap-4 w-full py-2"></div>
          <div className="flex flex-col py-2">
            <label className="uppercase text-sm py-2 text-black">Email</label>
            <input
              type="email"
              className="border-2 rounded-lg p-3 flex border-gray-300 focus:outline-none"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col py-2">
            <label className="uppercase text-sm py-2 text-black">
              Password
            </label>
            <input
              type="password"
              className="border-2 rounded-lg p-3 flex border-gray-300 focus:outline-none"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col py-2">
            <label className="uppercase text-sm py-2 text-black">Name</label>
            <input
              type="text"
              className="border-2 rounded-lg p-3 flex border-gray-300 focus:outline-none"
              name="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col py-2">
            <label className="uppercase text-sm py-2 text-black">
              Phone Number
            </label>
            <input
              type="tel"
              className="border-2 rounded-lg p-3 flex border-gray-300 focus:outline-none"
              name="tel"
              required
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <input
            className="w-full p-4 mt-4 dark:shadow-none cursor-pointer shadow-xl shadow-gray-400 rounded-xl uppercase bg-gradient-to-r from-[#5651e5] to-[#709dff] text-white"
            type="submit"
            value="Login"
          />
        </form>
      </div>
    </div>
  )
}
