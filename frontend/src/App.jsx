import { Toaster } from "sonner";
import AuthProvider from "./context/auth/AuthProvider";
import AppRoute from "./routes/AppRoute";

function App() {
  return (
    <AuthProvider>
      <AppRoute />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
