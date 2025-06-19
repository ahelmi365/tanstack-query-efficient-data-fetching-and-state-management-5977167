import { TUser } from "../../types"
import "./styles.css"

interface UserCardProps {
  user: TUser
}
const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="user-card">
      <h1>{user.name}</h1>
      <img src={user.avatar_url} alt={user.name} className="user-avatar" />
      <p>Followers: {user.followers}</p>
      <p>Following: {user.following}</p>
      <p>Public Repos: {user.public_repos}</p>
    </div>
  )
}

export default UserCard