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

export const compute_transaction_mean = (data: any[]) => {
  const mean =
    data.reduce((sum, obj) => sum + parseFloat(obj["amount"]), 0) / data.length

  return mean
}
