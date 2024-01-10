import { Poppins } from "next/font/google"
import React from "react"

const PoppinsFont = Poppins({ weight: "400", subsets: ["devanagari"] })

export default function UploadButton({
  handleUpload,
}: {
  handleUpload: (event: any) => Promise<void>
}) {
  return (
    <button
      className={`mt-4 float-right hover:opacity-80 text-white px-4 py-2 rounded-lg bg-indigo-400 ${PoppinsFont.className}`}
      onClick={handleUpload}
    >
      Upload
    </button>
  )
}
