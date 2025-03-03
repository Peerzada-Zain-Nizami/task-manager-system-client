import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/Axiox";
import { toast } from "react-toastify";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData) => {
      const response = await axiosInstance.post("/admin/categories", categoryData);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
    onSuccess: (data) => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

export const useCategories = (page = 1, keyword = "") => {
  return useQuery({
    queryKey: ["categories", page, keyword],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/categories?page=${page}&keyword=${keyword}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, categoryData }) => {
      const response = await axiosInstance.put(`/admin/categories/${id}`, categoryData);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
    onSuccess: (data) => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId) => {
      const response = await axiosInstance.delete(`/admin/categories/${categoryId}`);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries(["categories"]);
    },
  });
};
