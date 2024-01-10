"use client"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Box, Modal, Typography } from "@mui/material"
import { IoClose } from "react-icons/io5"
import UploadButton from "@/components/UploadButton"
import { useRouter } from "next/navigation"

export default function MainSection({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const router = useRouter()

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    onDrop(acceptedFiles) {
      setFile(acceptedFiles[0])
    },
  })

  const files = acceptedFiles.map((file: File) => (
    <li key={file.name}>{file.name}</li>
  ))

  const handleUpload = async (event: any) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append("file", file as Blob)

    try {
      await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      router.push("/simulate")
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="w-full flex justify-between items-center px-32">
      <div className="flex">
        <button
          onClick={() => {
            if (!user.name) router.push("/login")
            else setOpen(!open)
          }}
          className="border text-white p-5 bg-[#5651e5] rounded-lg ml-14 mt-10 cursor-pointer hover:opacity-85"
        >
          Simulate Transaction
        </button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              boxShadow: 24,
              p: 4,
            }}
            className="rounded-lg bg-slate-100"
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className={``}
            >
              Upload CSV
            </Typography>
            <div className="mt-4">
              <div
                {...getRootProps({ className: "dropzone" })}
                className="p-10 border border-dashed rounded-lg border-slate-500"
              >
                <input {...getInputProps()} />
                <p className={`cursor-pointer text-center `}>
                  Drag and drop a csv here, or click to select csv
                </p>
              </div>
              {file !== null && (
                <>
                  <aside>
                    <h4 className={`mt-4 `}>File</h4>
                    <ul className="p-2 flex items-center justify-between mt-2 border rounded-lg border-slate-500">
                      {files}
                      <IoClose
                        size={20}
                        className="text-slate-500 cursor-pointer"
                        onClick={() => setFile(null)}
                      />
                    </ul>
                  </aside>
                  <UploadButton handleUpload={handleUpload} />
                </>
              )}
            </div>
          </Box>
        </Modal>
        <button className="border text-[#5651e5] p-5 w-[12.5rem] bg-white rounded-lg ml-14 mt-10 cursor-pointer hover:opacity-85">
          How It Works
        </button>
      </div>
      <img
        src="/hero.svg"
        alt="hero"
        className="hover:scale-105 ease-in duration-300 mt-20 h-[375px]"
      />
    </div>
  )
}
