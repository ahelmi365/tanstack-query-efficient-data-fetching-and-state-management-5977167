export const getUser = async (username: string) => {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error("Network response is not ok!")
  }

  return await response.json()
}