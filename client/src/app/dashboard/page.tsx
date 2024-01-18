import { BarChart } from "@/components/BarChart"
import { PieChart } from "@/components/PieChart"
import axios from "axios"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

type PieChartProps = {
  category: string
  value: number
  label: string
  id: string
}

export default async function Dashboard() {
  const token = cookies().get("access-token")

  if (!token) redirect("/login")

  const request = await axios.get("http://localhost:5000/user/dashboard", {
    headers: {
      cookie: token.value,
    },
  })

  const transactions_data: { category: string; amount: string }[] =
    request.data["transactions"]["data"]

  const pieChartData: PieChartProps[] = []

  transactions_data.forEach((transaction) => {
    const existingCategory = pieChartData.find(
      (item) => item.category === transaction.category
    )

    if (existingCategory) {
      existingCategory.value += parseInt(transaction.amount)
    } else {
      pieChartData.push({
        category: transaction.category,
        id: transaction.category,
        value: parseInt(transaction.amount),
        label: transaction.category,
      })
    }
  })

  const flagged_result: { category: string; amount: string }[] = []

  const flagged_transaction_data: {
    transaction: { category: string; amount: string }
  }[] = request.data["Flagged_Transactions"]

  flagged_transaction_data.forEach((transaction) => {
    flagged_result.push({
      amount: transaction.transaction.amount,
      category: transaction.transaction.category,
    })
  })

  const outputArray = flagged_result.reduce((acc: any, curr) => {
    const existingCategory = acc.find(
      (item: any) => item.category === curr.category
    )

    if (existingCategory) {
      const amountKey = `amount${existingCategory.amounts.length + 1}`
      existingCategory[amountKey] = curr.amount
      existingCategory.amounts.push(curr.amount)
    } else {
      const newItem = {
        category: curr.category,
        amount1: curr.amount,
        amounts: [curr.amount],
      }
      acc.push(newItem)
    }

    return acc
  }, [])

  const barChartData = outputArray.map((item: any) => {
    const { amounts, ...newItem } = item
    return newItem
  })

  const uniqueAmountKeys = [
    //@ts-expect-error
    ...new Set(
      barChartData.flatMap((item: {}) =>
        Object.keys(item).filter((key) => key.startsWith("amount"))
      )
    ),
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="sticky top-0 h-screen overflow-auto p-4 w-[20%] bg-gradient-to-b from-[#8c96c6] to-[#8c6bb1] shadow-xl">
        <h1 className="text-center mt-10 font-medium text-xl text-white p-6 italic underline">
          DASHBOARD
        </h1>
        <p className="text-center text-xl font-bold text-gray-600">
          {request.data.name}
        </p>
        <Link
          href={"/"}
          className="absolute top-2 p-2 text-sm rounded-md bg-gray-600 text-white"
        >
          Back Home
        </Link>
        <p className="text-white text-lg flex mt-10 justify-between">
          No. of flagged transactions:{" "}
          <span className="">{flagged_transaction_data.length}</span>
        </p>
        <p className="text-white text-lg  mt-10 flex justify-between">
          No. of cancelled transactions:{" "}
          <span className="">{barChartData.length}</span>
        </p>
        <Image
          src={"/transaction_logo.svg"}
          width={300}
          height={300}
          alt="txn_logo"
          className="mt-32 mx-auto"
        />
      </aside>
      <main className="flex-1 overflow-auto p-4">
        <div className="flex flex-col items-center justify-center ">
          <div className="h-[60vh] mb-5 w-full p-5">
            <h1 className="text-center text-2xl font-semibold">
              Your Past Transactions
            </h1>
            <PieChart data={pieChartData} />
          </div>
          <div
            className={`${
              barChartData.length < 1 && "hidden"
            }  border-t w-full mt-2`}
          ></div>
          <div
            className={`mb-5 h-[60vh]  w-[75%] p-5 ${
              barChartData.length < 1 && "hidden"
            }`}
          >
            <h1 className="text-center text-2xl font-semibold">
              Your Cancelled Transactions
            </h1>
            <BarChart data={barChartData} amount_keys={uniqueAmountKeys} />
          </div>
        </div>
      </main>
    </div>
  )
}
