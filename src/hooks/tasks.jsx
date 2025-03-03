import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/Axiox";
import { toast } from "react-toastify";

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskData) => {
      const response = await axiosInstance.post("/user/tasks", taskData);
      return response.data;
    },
    onError: (error) => {
      const errorMessages = error.response?.data?.errors || ["Failed to create task"];
      errorMessages.forEach((message) => {
        toast.error(message);
      });
    },
    onSuccess: () => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useTasks = (page = 1, keyword = "", status = "") => {
  return useQuery({
    queryKey: ["tasks", page, keyword, status],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/tasks", {
        params: {
          page,
          keyword,
          status: !status || status === "all" ? undefined : status,
        },
      });
      return response.data;
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to fetch tasks";
      if (errorMessage === "Unauthenticated.") {
        toast.error("You are not authenticated. Please log in.");
      } else {
        toast.error(errorMessage);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, taskData }) => {
      const response = await axiosInstance.put(`/user/tasks/${taskId}`, taskData);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
    onSuccess: () => {
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId) => {
      const response = await axiosInstance.delete(`/user/tasks/${taskId}`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosInstance.patch(`/tasks/${id}/status`, { status });
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update task status");
    },
    onSuccess: () => {
      toast.success("Task status updated successfully!");
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};
