import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/Axiox";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post("/register", userData);
      return response.data;
    },
    onError: (error) => {
      toast.error(error || "Registration failed");
    },
    onSuccess: () => {
      toast.success("Registration successful!");
    },
  });
};

export const useLogin = () => {
  const { onAuth } = useAuth();
  return useMutation({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post("/login", userData);
      return response.data;
    },
    onError: (error) => {
      toast.error(error || "Login failed");
    },
    onSuccess: (data) => {
      onAuth(data.token, data.user);
      toast.success("Login successful!");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email) => {
      const response = await axiosInstance.post("/forgot-password", { email });
      return response.data;
    },
    onError: (error) => {
      toast.error(error || "Failed to send reset password email");
    },
    onSuccess: () => {
      toast.success("Password reset email sent successfully!");
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (input) => {
      const response = await axiosInstance.post("/reset-password", input);
      return response.data;
    },
    onError: (error) => {
      toast.error(error || "Failed to reset password");
    },
    onSuccess: () => {
      toast.success("Password reset successfully!");
    },
  });
};
