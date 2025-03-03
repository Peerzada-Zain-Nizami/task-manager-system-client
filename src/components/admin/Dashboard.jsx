import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import DashboardStats from "./DashboardStats";
import UserManagement from "./UserManagement";
import TaskManagement from "./TaskManagement";
import CategoryManagement from "./CategoryManagement";
import ConfirmationDialog from "./ConfirmationDialog";
import { useGetNotifications } from "../../hooks/dashboard";
import AdminDropdown from "./components/AdminDropdown";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const _ = useGetNotifications();

  const handleConfirmAction = (action, data) => {
    setConfirmAction({ action, data });
    setShowConfirmDialog(true);
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { action, data } = confirmAction;
    switch (action) {
      case "deleteUser":
        console.log(`Deleting user: ${data.id}`);
        break;
      case "deleteTask":
        console.log(`Deleting task: ${data.id}`);
        break;
      case "deleteCategory":
        console.log(`Deleting category: ${data.id}`);
        break;
      case "deleteComment":
        console.log(`Deleting comment: ${data.id} from task: ${data.taskId}`);
        break;
      default:
        console.log("Unknown action");
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement onConfirmDelete={handleConfirmAction} />;
      case "tasks":
        return <TaskManagement onConfirmDelete={handleConfirmAction} />;
      case "categories":
        return <CategoryManagement onConfirmDelete={handleConfirmAction} />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center bg-white shadow p-4">
        <h1 className="text-xl font-bold">Admin Portal</h1>
        <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="text-gray-600 focus:outline-none">
          {mobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={`fixed left-0 z-50 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:translate-x-0`}>
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {mobileSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setMobileSidebarOpen(false)}></div>}

      <div className="flex-1 md:pl-64">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === "dashboard" && "Admin Dashboard"}
              {activeTab === "users" && "User Management"}
              {activeTab === "tasks" && "Task Management"}
              {activeTab === "categories" && "Category Management"}
            </h1>
            <div className="mt-2 md:mt-0 flex items-center space-x-4">
              <AdminDropdown />
            </div>
          </div>
        </header>

        <main className=" mx-auto py-6 sm:px-6 lg:px-8">{renderContent()}</main>
      </div>

      {showConfirmDialog && (
        <ConfirmationDialog
          title={`Confirm ${confirmAction?.action.replace("delete", "Delete ")}`}
          message={`Are you sure you want to delete this ${confirmAction?.action.replace("delete", "")}? This action cannot be undone.`}
          onConfirm={executeConfirmedAction}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
