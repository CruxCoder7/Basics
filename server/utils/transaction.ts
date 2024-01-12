export const sanitize_transaction_data = (data: any[]) => {
  const clean = data.map((obj) => ({
    txid: obj["Trans_Id"],
    acc_num: obj["Acc Num"],
    name: obj["Name"],
    amount: obj["Amount"],
    category: obj["Category"],
  }))
  return clean
}
