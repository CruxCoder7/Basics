import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TransactionForm({ user }: { user: any }) {
  return (
    <Card className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
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
            className="border-gray-300 focus:border-[#5651e5] focus:ring-#5651e5"
            id="txid"
            placeholder="Enter transaction ID"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-800" htmlFor="amount">
            Amount
          </Label>
          <Input
            className="border-gray-300 focus:border-[#5651e5] focus:ring-#5651e5"
            id="amount"
            placeholder="Enter amount"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-800" htmlFor="acc_no">
            Account Number
          </Label>
          <Input
            className="border-gray-300 focus:border-[#5651e5] focus:ring-#5651e5"
            id="acc_no"
            placeholder="Enter account number"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-800" htmlFor="category">
            Category
          </Label>
          <Input
            className="border-gray-300 focus:border-[#5651e5] focus:ring-#5651e5"
            id="category"
            placeholder="Enter category"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-800" htmlFor="name">
            Name
          </Label>
          <Input
            className="border-gray-300 focus:border-[#5651e5] focus:ring-#5651e5"
            id="name"
            placeholder="Enter your name"
            value={user.name}
            disabled
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-black text-white hover:opacity-80 rounded-md">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}
