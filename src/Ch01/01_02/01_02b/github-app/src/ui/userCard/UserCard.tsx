import { useQueryClient } from "@tanstack/react-query"
import { TUser } from "../../types"
import "./styles.css"

interface UserCardProps {
  user: TUser
}
const UserCard = ({ user }: UserCardProps) => {
  const queryClient = useQueryClient();

  const refreshUser = (username: string) => {
    queryClient.invalidateQueries({
      queryKey: ['github', 'user', username]
    })
  }
  return (
    <div className="user-card">
      <h1>{user.name}</h1>
      <img src={user.avatar_url} alt={user.name} className="user-avatar" />
      <p>Followers: {user.followers}</p>
      <p>Following: {user.following}</p>
      <p>Public Repos: {user.public_repos}</p>
      <button onClick={() => refreshUser(user.login)}>Refresh this user</button>
    </div>
  )
}

export default UserCard;