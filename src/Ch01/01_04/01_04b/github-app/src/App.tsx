import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function GitHubProfile() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.github.com/users/eveporcello"
      );
      if (!response.ok) {
        throw new Error("Network response failed");
      }
      return response.json();
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div>
        <img src={data.avatar_url} alt={data.login} />
      </div>
      <div>
        <h2>{data.name}</h2>
        <p>{data.login}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubProfile />
    </QueryClientProvider>
  );
}

export default App;
