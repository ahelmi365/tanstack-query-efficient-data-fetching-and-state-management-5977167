import "./App.css";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import ShowUser from "./components/user/ShowUser";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const queryClient = new QueryClient();

const logCacheData = () => {
  const cacheData = queryClient.getQueriesData({
    queryKey: ['user']
  })

  console.log(cacheData)
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShowUser />
      <button onClick={logCacheData}>Log Cache Data</button>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;