import { MyResponsiveBar } from "@/components/BarChart"
import { MyResponsivePie } from "@/components/PieChart"
import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

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

  const resultArray: {
    category: string
    value: number
    label: string
    id: string
  }[] = []

  transactions_data.forEach((transaction) => {
    const existingCategory = resultArray.find(
      (item) => item.category === transaction.category
    )

    if (existingCategory) {
      existingCategory.value += parseInt(transaction.amount)
    } else {
      resultArray.push({
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

  const finalOutputArray = outputArray.map((item: any) => {
    const { amounts, ...newItem } = item
    return newItem
  })

  const uniqueAmountKeys = [
    //@ts-expect-error
    ...new Set(
      finalOutputArray.flatMap((item: {}) =>
        Object.keys(item).filter((key) => key.startsWith("amount"))
      )
    ),
  ]

  return (
    <div className="w-full flex min-h-[100vh]">
      <div className="w-[15%]  h-screen sticky top-0 bg-gradient-to-b from-[#8c96c6] to-[#8c6bb1] shadow-xl"></div>
      <div className="flex w-[80%] flex-col items-center justify-center">
        <div className="w-[80%] h-[60vh] float-right">
          <MyResponsivePie data={resultArray} />
        </div>
        <div className="w-[80%] h-[60vh] float-right">
          <MyResponsiveBar
            data={finalOutputArray}
            amount_keys={uniqueAmountKeys}
          />
        </div>
      </div>
    </div>
  )
}
