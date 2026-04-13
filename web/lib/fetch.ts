const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchHandler(input: string | URL | Request, init?: RequestInit) {
  const options = init ? {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  } : undefined
  const res = await fetch(`${apiUrl}/${input}`, options)

  if (!res.ok) throw new Error('Failed to create todo')
  return res
}