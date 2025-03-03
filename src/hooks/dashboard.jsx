import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/Axiox";
import { toast } from "react-toastify";

export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/stats");
      return res.data;
    },
  });
};

export const useGetRecentActivities = () => {
  return useQuery({
    queryKey: ["recent-activities"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/recent-activities");
      return res.data;
    },
  });
};

export const useGetCompletionRate = () => {
  return useQuery({
    queryKey: ["completion-rate"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/task-counts");
      return res.data.task_counts ?? {};
    },
  });
};

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/notifications");
      const notifications = res.data.notifications ?? [];
      notifications.map((not) => {
        toast.success(`New User Registered: ${not.data.email} \n `);
      });

      return notifications;
    },
  });
};
