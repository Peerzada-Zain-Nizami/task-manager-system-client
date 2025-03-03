import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/Axiox";
import { toast } from "react-toastify";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, commentData }) => {
      const response = await axiosInstance.post(`/admin/tasks/${taskId}/comment`, commentData);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create comment");
    },
    onSuccess: (data, { taskId }) => {
      toast.success("Comment added successfully!");
      queryClient.invalidateQueries(["taskComments", taskId]);
    },
  });
};

export const useComments = (taskId) => {
  return useQuery({
    queryKey: ["taskComments", taskId],
    queryFn: async () => {
      if (!taskId) {
        toast.error("Invalid task ID");
        return [];
      }
      const response = await axiosInstance.get(`/admin/tasks/${taskId}/comments`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch comments");
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ taskId, commentId, commentData }) => {
      const response = await axiosInstance.put(`/tasks/${taskId}/comments/${commentId}`, commentData);
      return response.data;
    },
    {
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update comment");
      },
      onSuccess: (data, { taskId }) => {
        toast.success("Comment updated successfully!");
        queryClient.invalidateQueries(["taskComments", taskId]);
      },
    }
  );
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, commentId }) => {
      const response = await axiosInstance.delete(`/admin/task-comments/${commentId}/delete`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    },
    onSuccess: (data, { taskId, commentId }) => {
      toast.success("Comment deleted successfully!");
      queryClient.setQueryData(["taskComments", taskId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((comment) => comment.id !== commentId),
        };
      });
    },
  });
};
