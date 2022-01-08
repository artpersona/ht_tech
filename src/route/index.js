import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Home } from "../pages";
import { useAuthContext } from "../shared/contexts/AuthContext";
function index() {
  return <MainNavigation />;
}

const MainNavigation = () => {
  const { loggedUser } = useAuthContext();

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          loggedUser ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />
        }
      ></Route>
      <Route path="/auth" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute redirectTo={"/auth"}>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
};

const PrivateRoute = ({ children, redirectTo }) => {
  const { loggedUser } = useAuthContext();

  return loggedUser ? children : <Navigate to={redirectTo} />;
};

export default index;
