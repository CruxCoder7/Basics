import axios from "axios"

export const updateTransaction = async ({
    id,
    cancelled,
}: {
    id: number
    cancelled: boolean
}) => {
    const request = await axios.put(
        "http://localhost:5000/transaction",
        {
            id,
            cancelled,
        },
        { withCredentials: true }
    )

    return request.data
}

export const updateUser = async (transaction: Object) => {
    const request = await axios.put(
        "http://localhost:5000/user",
        {
            transaction,
        },
        { withCredentials: true }
    )

    return request.data
}