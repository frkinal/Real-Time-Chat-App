import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./modules/dashboard";
import Form from "./modules/form";

const ProtectedRoute = ({
  children,
  auth = false,
}: {
  children: any;
  auth?: boolean;
}) => {
  const isAuthenticated = localStorage.getItem("user:token") !== null || false;
  if (!isAuthenticated && auth) {
    return <Navigate to={"/users/sign_in"} />;
  } else if (
    isAuthenticated &&
    ["/users/sign_in", "/users/sign_up"].includes(window.location.pathname)
  ) {
    return <Navigate to={"/"} />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute auth={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/sign_in"
        element={
          <ProtectedRoute>
            <Form isSignInPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/sign_up"
        element={
          <ProtectedRoute>
            <Form />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
