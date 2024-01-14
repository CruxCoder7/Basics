export type CategoryTypes =
    | "entertainment"
    | "food_dining"
    | "gas_transport"
    | "grocery"
    | "health_fitness"
    | "home"
    | "kids_pets"
    | "misc"
    | "personal_care"
    | "shopping"
    | "travel"

export type Transaction = {
    txid: string
    amount: string
    acc_no: string
    category: CategoryTypes
    name: string
}