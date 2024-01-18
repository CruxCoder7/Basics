import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function TransactionForm({
  user,
  setOpen,
}: {
  user: any
  setOpen: Function
}) {
  const [formData, setFormData] = useState({
    txid: "",
    amount: "",
    acc_no: "",
    category: "",
    name: user.name,
  })

  const [message, setMessage] = useState("")

  const router = useRouter()

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const transactionFn = async () => {
    return axios.post("http://localhost:5000/user/transaction", formData, {
      withCredentials: true,
    })
  }

  const transactionMutation = useMutation({
    mutationFn: transactionFn,
    onSuccess(data) {
      console.log(data.data.msg)
      if (data.data.msg === "unflagged") router.push("/dashboard")
      if (data.data.msg === "email sent") {
        setMessage("URGENT! Check your email:")
      }
    },
    onError(error) {
      setMessage(error.message)
    },
  })

  const handleSubmit = (e: any) => {
    transactionMutation.mutate()
  }

  return (
    <Card className="w-full  max-w-lg bg-white shadow-lg rounded-lg p-4 ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Transaction Form
        </CardTitle>
        <CardDescription className="text-gray-500">
          Please fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-800" htmlFor="txid">
            Transaction ID
          </Label>
          <Input
            className="border-gray-300"
            id="txid"
            name="txid"
            placeholder="Enter transaction ID"
            onChange={handleChange}
            value={formData.txid}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-800" htmlFor="amount">
            Amount
          </Label>
          <Input
            className="border-gray-300"
            id="amount"
            name="amount"
            placeholder="Enter amount"
            onChange={handleChange}
            value={formData.amount}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-800" htmlFor="acc_no">
            Account Number
          </Label>
          <Input
            className="border-gray-300"
            id="acc_no"
            name="acc_no"
            placeholder="Enter account number"
            onChange={handleChange}
            value={formData.acc_no}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-800" htmlFor="category">
            Category
          </Label>
          <Input
            className="border-gray-300"
            id="category"
            name="category"
            placeholder="Enter category"
            onChange={handleChange}
            value={formData.category}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-800" htmlFor="name">
            Name
          </Label>
          <Input
            className="border-gray-300"
            id="name"
            name="name"
            value={user.name}
            disabled
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-black text-white hover:opacity-80 rounded-md disabled:opacity-60"
          onClick={handleSubmit}
          disabled={
            transactionMutation.isPending ||
            transactionMutation.isSuccess ||
            formData.amount.length < 1 ||
            formData.category.length < 1
          }
        >
          Submit
        </Button>
      </CardFooter>
      <CardFooter>
        <Button
          className="w-full bg-red-500 text-white hover:opacity-80 rounded-md"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </CardFooter>
      <p className="text-2xl text-red-700 text-center">
        {message} {message.length > 0 && user.email}
      </p>
    </Card>
  )
}
