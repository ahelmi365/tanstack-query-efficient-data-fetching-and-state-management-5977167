import { TUser } from "../../types"

interface UserCardProps {
  user: TUser
}
const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="user-card">
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      <img src={user.avatar_url} alt={user.name} style={{ width: '150px' }} />
      <p>Followers: {user.followers}</p>
      <p>Following: {user.following}</p>
      <p>Public Repos: {user.public_repos}</p>
    </div>
  )
}

export default UserCard