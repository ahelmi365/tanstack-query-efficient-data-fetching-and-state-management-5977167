import { useQueries, useQuery } from "@tanstack/react-query";
import { getUser } from "../../apis/user"
import UserCard from "../../ui/userCard/UserCard";

const ShowUser = () => {

  const usernames = ["ahelmi365", "octocat"];
  const results = useQueries({
    queries: usernames.map(username => {
      return {
        queryKey: ['user', username],
        queryFn: () => getUser(username),
        cacheTime: 1000 * 60 * 5 // cache for 5 minutes
      }
    })
  })
  const isLoading = results.some(result => result.isLoading);
  const isError = results.some(result => result.isError);
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error loading user data</div>
  }


  return (
    <div>
      {results.map((result, index) => {

        return <UserCard key={index} user={result.data} />
      }
      )}
    </div>
  );


}

export default ShowUser