import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function GitHubProfile() {
  const userQuery1 = useQuery({
    queryKey: ["user", "eveporcello"],
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

  const userQuery2 = useQuery({
    queryKey: ["user", "moontahoe"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.github.com/users/moontahoe"
      );
      if (!response.ok) {
        throw new Error("Network response failed");
      }
      return response.json();
    }
  });

  if (userQuery1.isPending || userQuery2.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <div>
          <img
            src={userQuery1.data.avatar_url}
            alt={userQuery1.data.login}
          />
        </div>
        <div>
          <h2>{userQuery1.data.name}</h2>
          <p>{userQuery1.data.login}</p>
        </div>
      </div>
      <div>
        <div>
          <img
            src={userQuery2.data.avatar_url}
            alt={userQuery2.data.login}
          />
        </div>
        <div>
          <h2>{userQuery2.data.name}</h2>
          <p>{userQuery2.data.login}</p>
        </div>
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
