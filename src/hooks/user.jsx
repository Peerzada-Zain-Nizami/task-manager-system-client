import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/Axiox";
import { toast } from "react-toastify";

export const useUserDetails = (page = 1, search = "", role = "") => {
  return useQuery({
    queryKey: ["users", page, search, role],
    queryFn: async () => {

      let queryString = `page=${page}`
      if (search) queryString = queryString + `&keyword=${search}`
      if (role) queryString = queryString + `&role=${role}`
      const response = await axiosInstance.get(`/admin/users?${queryString}`);
      return response.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, userData }) => {
      const response = await axiosInstance.post(`/admin/update-user/${userId}`, userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const response = await axiosInstance.delete(`/admin/destroy-user/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId }) => {
      const response = await axiosInstance.post(`/admin/approve-user/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User approved successfully!");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to approve user");
    },
  });
};
