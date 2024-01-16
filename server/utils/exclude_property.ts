export default function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
) {
  return Object.fromEntries(
    Object.entries(user as any).filter(([key]) => !keys.includes(key as any))
  )
}
