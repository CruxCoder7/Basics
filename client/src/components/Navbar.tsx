"use client"
import { Anton } from "next/font/google"
import Link from "next/link"

const AntonFont = Anton({
  weight: ["400"],
  subsets: ["latin"],
})

export default function Navbar({ user }: { user: any }) {
  return (
    <nav className="w-full flex items-center justify-center">
      <div className="w-[75%] mt-7 h-14 bg-white rounded-lg shadow-lg flex justify-between items-center p-5">
        <h2 className={`${AntonFont.className}`}>CYBERPUNKS</h2>
        <div className="flex gap-5 items-center justify-center">
          <h2 className="text-[#5651e5] cursor-pointer font-medium">
            <Link href={"/dashboard"}>Dashboard</Link>
          </h2>
          {!user.name && (
            <>
              <h2 className="text-[#5651e5] cursor-pointer font-medium">
                <Link href={"/register"}>Register</Link>
              </h2>
            </>
          )}

          <h2 className="text-[#5651e5] cursor-pointer font-medium">
            {!user.name ? (
              <Link href={"/login"}>Login</Link>
            ) : (
              <Link
                href={"#"}
                onClick={() => {
                  document.cookie =
                    "access-token" + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                  window.location.replace("/login")
                }}
              >
                {user.name}
              </Link>
            )}
          </h2>
        </div>
      </div>
    </nav>
  )
}
