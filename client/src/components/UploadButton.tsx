import { Poppins } from "next/font/google"
import React from "react"

const PoppinsFont = Poppins({ weight: "400", subsets: ["devanagari"] })

export default function UploadButton({
  handleUpload,
  disabled,
}: {
  handleUpload: (event: any) => void
  disabled: boolean
}) {
  return (
    <button
      className={`mt-4 float-right hover:opacity-80 text-white px-4 py-2 rounded-lg bg-indigo-400 ${PoppinsFont.className} disabled:opacity-50`}
      onClick={handleUpload}
      disabled={disabled}
    >
      Upload
    </button>
  )
}
