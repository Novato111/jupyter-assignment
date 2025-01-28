import { useState, useEffect } from "react";
import { Button, NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Notebook } from "./pages/Notebook";
import { useNotebookStore } from "./store/useNotebookStore";
import { Login } from "./components/Login";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("jupyterhub-token");
    if (savedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    // Clearing token from local storage
    localStorage.removeItem("jupyterhub-token");

    // Clearing all files from the Zustand store and resetting activeFileId
    useNotebookStore.setState({
      files: [],
      activeFileId: null,
    });

    // Reset authentication state
    setIsAuthenticated(false);
  };
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        {!isAuthenticated ? (
          <Login />
        ) : (
          <main className="bg-black text-white h">
            <div className="flex justify-between items-center p-2">
              <Button color="danger" onPress={handleLogout} size="sm">
                logout
              </Button>
            </div>
            <Notebook />
          </main>
        )}
      </NextUIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
