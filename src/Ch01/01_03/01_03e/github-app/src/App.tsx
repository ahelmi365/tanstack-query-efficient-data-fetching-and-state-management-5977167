import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function GitHubProfile() {
  const query = useQuery({
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
  console.log(query.data);
  return <div>GitHub Profile Component</div>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubProfile />
    </QueryClientProvider>
  );
}

export default App;
