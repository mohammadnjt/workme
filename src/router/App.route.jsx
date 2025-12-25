import React, { useEffect, Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore";
import Loading from "../components/global/Loading";
import axios from "../services/axiosInstance";

// Lazy load pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const Home = lazy(() => import("../pages/Home"));
const Profile = lazy(() => import("../pages/Profile"));

// Lazy Load Wrapper Component
const LazyComponent = ({ component: Component, condition = true, redirectTo }) => {
  if (!condition) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export default function AppRouter() {
  const { auth, setAuth } = useAppStore();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/auth/profile");
        setAuth({
          user: res.data,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        setAuth({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, [setAuth]);

  if (auth.isLoading) {
    return <Loading />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={auth.isAuthenticated ? "/app" : "/auth/login"} replace />
    },
    {
      path: "/auth/login",
      element: (
        <LazyComponent 
          component={Login} 
          condition={!auth.isAuthenticated} 
          redirectTo="/app" 
        />
      )
    },
    {
      path: "/auth/register",
      element: (
        <LazyComponent 
          component={Register} 
          condition={!auth.isAuthenticated} 
          redirectTo="/app" 
        />
      )
    },
    {
      path: "/auth/forgot-password",
      element: (
        <LazyComponent 
          component={ForgotPasswordPage} 
          condition={!auth.isAuthenticated} 
          redirectTo="/app" 
        />
      )
    },
    {
      path: "/profile",
      element: (
        <LazyComponent 
          component={Profile} 
          condition={auth.isAuthenticated} 
          redirectTo="/auth/login" 
        />
      )
    },
    {
      path: "/app",
      element: (
        <LazyComponent 
          component={Home} 
          condition={auth.isAuthenticated} 
          redirectTo="/auth/login" 
        />
      )
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<Loading />}>
          <NotFoundPage />
        </Suspense>
      )
    }
  ]);

  return <RouterProvider router={router} />;
}