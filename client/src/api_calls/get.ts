import axios from "axios"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"

export const getTransactionById = async (id: string, token: RequestCookie) => {
    return await axios.get(
        `http://localhost:5000/transaction/${id}`,
        {
            headers: {
                cookie: token.value,
            },
        }
    )
}

export const getUser = async () => {
    const userFetch = await fetch("http://localhost:5000/user", {
        credentials: "include",
    })
    const user = await userFetch.json()
    return user
}