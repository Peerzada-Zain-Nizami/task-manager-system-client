import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, MessageSquare, Check, X, Clock, Plus, ChevronDown, ChevronUp } from "lucide-react";
import TaskHeader from "../admin/components/TaskHeader";
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from "../../hooks/tasks";
import { useCategories } from "../../hooks/category";
import axiosInstance from "../../utils/Axiox";
import AdminDropdown from "../admin/components/AdminDropdown";

const TaskManagement = () => {
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
    category: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [expandedTask, setExpandedTask] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Use the revised useTasks hook with pagination and filters
  const { data, isError, isLoading } = useTasks(currentPage, debouncedSearch, filterStatus);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);

  const { data: categoryData, isLoading: loadingCat, isError: errors } = useCategories();
  const { mutateAsync: deleteTask } = useDeleteTask();
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();

  // Set up debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    if (!loadingCat && !errors && categoryData) {
      const categoryList = categoryData?.data?.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      setCategories(categoryList);
    }
  }, [categoryData, loadingCat, errors]);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      if (Array.isArray(data.data)) {
        setTasks(data.data);
      } else {
        console.error("Expected data.data to be an array, but it's not.");
      }
    }
  }, [data, isLoading, isError]);

  const toggleNewTaskForm = () => {
    if (editingTask) {
      setEditingTask(null);
    }
    setIsCreatingNew(!isCreatingNew);
    setFormErrors({});
  };

  const handleEditTask = (task) => {
    setIsCreatingNew(false);
    setEditingTask({
      ...task,
      category: task.category_id || task.category,
    });
    setFormErrors({});
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.title?.trim()) {
      errors.title = "Title is required";
    }
    if (!data.description?.trim()) {
      errors.description = "Description is required";
    }
    if (!data.category) {
      errors.category = "Category is required";
    }
    return errors;
  };

  const handleSaveTask = async () => {
    const taskToValidate = editingTask || newTask;
    const validationErrors = validateForm(taskToValidate);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    const taskToSave = {
      title: taskToValidate.title,
      description: taskToValidate.description,
      category_id: taskToValidate.category,
      status: taskToValidate.status,
    };

    try {
      if (editingTask && editingTask.id) {
        await updateTask({
          taskId: editingTask.id,
          taskData: taskToSave,
        });
      } else {
        await createTask(taskToSave);
        setNewTask({
          title: "",
          description: "",
          status: "pending",
          category: "",
        });
      }

      setEditingTask(null);
      setIsCreatingNew(false);
      setFormErrors({});
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleExpandTask = async (taskId) => {
    fetchComments(taskId);
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleInputChange = (e, isForNewTask = false) => {
    const { name, value } = e.target;

    if (isForNewTask) {
      setNewTask((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setEditingTask((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
    }
  };

  const fetchComments = async (taskId) => {
    try {
      setComments([]);
      const response = await axiosInstance.get(`/admin/tasks/${taskId}/comment`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.last_page || 1)) {
      setCurrentPage(newPage);
    }
  };

  const renderTaskForm = (taskData, isNew = false) => {
    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-t border-gray-200 px-4 sm:p-6 bg-gray-50 mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">{isNew ? "Create New Task" : "Edit Task"}</h4>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border ${formErrors.title ? "border-red-500" : "border-gray-300"} rounded-md p-3`}
              value={taskData?.title || ""}
              onChange={(e) => handleInputChange(e, isNew)}
            />
            {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border ${formErrors.description ? "border-red-500" : "border-gray-300"} rounded-md p-3`}
              value={taskData?.description || ""}
              onChange={(e) => handleInputChange(e, isNew)}
            />
            {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full py-3 h-12 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={taskData?.status || "pending"}
              onChange={(e) => handleInputChange(e, isNew)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              className={`mt-1 block w-full py-3 h-12 border ${
                formErrors.category ? "border-red-500" : "border-gray-300"
              } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={taskData?.category || ""}
              onChange={(e) => handleInputChange(e, isNew)}
            >
              <option value="" disabled>
                Select a category
              </option>
              {!loadingCat &&
                !errors &&
                categories.length > 0 &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            {formErrors.category && <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>}
          </div>
        </div>

        <div className="mt-5 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => (isNew ? toggleNewTaskForm() : setEditingTask(null))}
          >
            Cancel
          </button>
          <button
            disabled={isCreating || isUpdating}
            type="button"
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70"
            onClick={handleSaveTask}
          >
            {isCreating || isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
      <div className="h-12 flex justify-end">
        <AdminDropdown />
      </div>
      <div className="mb-4">
        <TaskHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

        <div className="mt-4">
          <button onClick={toggleNewTaskForm} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            {isCreatingNew ? "Cancel" : "Create New Task"}
          </button>
        </div>
      </div>

      {isCreatingNew && renderTaskForm(newTask, true)}
      {editingTask && !isCreatingNew && renderTaskForm(editingTask, false)}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading tasks...
                </td>
              </tr>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <React.Fragment key={task.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleExpandTask(task.id)}
                          className="mr-2 text-gray-400 hover:text-gray-600"
                          aria-label={expandedTask === task.id ? "Collapse task details" : "Expand task details"}
                        >
                          {expandedTask === task.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{categories.find((c) => c.id === task.category_id)?.name || task.category_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`
                          ${task.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${task.status === "completed" ? "bg-green-100 text-green-800" : ""}
                          ${task.status === "in_progress" ? "bg-blue-100 text-blue-800" : ""}
                          px-2 py-1 rounded-full text-sm font-medium
                        `}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEditTask(task)} className="text-indigo-600 hover:text-indigo-900" title="Edit Task" disabled={isUpdating || isCreating}>
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-900" title="Delete Task" disabled={isUpdating || isCreating}>
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedTask === task.id && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 bg-gray-50">
                        <div className="max-w-4xl">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Comments</h4>
                          <div className="space-y-3 mb-2">
                            {comments?.length > 0 ? (
                              comments.map((comment) => (
                                <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm">
                                  <div className="flex justify-between items-start"></div>
                                  <p className="mt-1 text-sm text-gray-700">{comment.comment}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 italic">No comments yet</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No tasks found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-4 border-t border-gray-200 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{tasks.length}</span> tasks
          </div>
          <div className="flex justify-between items-center">
            <button
              className={`px-4 py-2 rounded-md text-white ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-4 text-sm text-gray-700">
              Page {currentPage} of {data?.last_page || 1}
            </span>
            <button
              className={`px-4 py-2 rounded-md text-white ${currentPage === (data?.last_page || 1) ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === (data?.last_page || 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
