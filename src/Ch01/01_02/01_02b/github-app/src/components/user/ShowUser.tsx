import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../apis/user"
import UserCard from "../../ui/userCard/UserCard";

const ShowUser = () => {
  const username1 = "ahelmi365";
  const username2 = "octocat";
  const user1 = useQuery({
    queryKey: ['user',  username1],
    queryFn: () => getUser(username1),
  });

  const user2 = useQuery({
    queryKey: ['user', username2],
    queryFn: () => getUser(username2),
  });

  if (user1.isLoading || user2.isLoading) {
    return <div>Loading...</div>
  }
  if (user1.isError || user2.isError) {
    return <div>Error loading user data</div>
  }
  return (
    <div>
      <UserCard user={user1.data} />
      <UserCard user={user2.data} />
    </div>
  );


}

export default ShowUser