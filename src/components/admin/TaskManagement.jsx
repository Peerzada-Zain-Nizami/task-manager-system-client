import React, { useState, useEffect } from "react";
import { Trash2, MessageSquare, Plus, ChevronDown, ChevronUp } from "lucide-react";
import axiosInstance from "../../utils/Axiox";
import TaskHeader from "../admin/components/TaskHeader";
import { useDeleteTask, useTasks } from "../../hooks/tasks";
import { useCreateComment, useDeleteComment } from "../../hooks/comment";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedTask, setExpandedTask] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isError, isLoading } = useTasks(currentPage, searchTerm, filterStatus);
  const [comments, setComments] = useState([]);
  const { mutate: createComment, isPending: isCreating } = useCreateComment();
  const { mutate: deleteComments } = useDeleteComment();
  const { mutate: deleteTask } = useDeleteTask();

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setTasks(data.data);
    }
  }, [data, isLoading, isError]);

  const handleExpandTask = async (taskId) => {
    fetchComments(taskId);
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleAddComment = (taskId) => {
    if (!newComment.trim()) return;

    const comment = {
      comment: newComment,
    };
    createComment({ taskId, commentData: comment });

    setComments((prevComments) => [...prevComments, { id: Date.now(), comment: newComment }]);

    fetchComments(taskId);
    setNewComment("");
  };

  const handleDeleteComment = (taskId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteComments({ taskId, commentId });

      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    }
  };

  const fetchComments = async (taskId) => {
    setComments([]);
    try {
      const response = await axiosInstance.get(`/admin/tasks/${taskId}/comment`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  };

  const handleDelteTask = (id) => {
    deleteTask(id);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
      <TaskHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
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
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <React.Fragment key={task.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button onClick={() => handleExpandTask(task.id)} className="mr-2 text-gray-400 hover:text-gray-600">
                          {expandedTask === task.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                          <div className="flex items-center mt-1">
                            <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{task.comments?.length}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{task.category_id}</div>
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
                        <button onClick={() => handleDelteTask(task.id)} className="text-red-600 hover:text-red-900" title="Delete Task">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedTask === task.id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="max-w-4xl mx-auto">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Comments</h4>
                          <div className="space-y-3 mb-4">
                            {comments.length > 0 ? (
                              comments.map((comment) => (
                                <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm">
                                  <div className="flex justify-between items-start">
                                    <div className="text-sm text-gray-500">
                                      <span className="mx-1">{comment.comment}</span>
                                    </div>
                                    <button onClick={() => handleDeleteComment(task.id, comment.id)} className="text-red-500 hover:text-red-700" title="Delete Comment">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-700">{comment.createdAt}</p>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500">No comments yet.</div>
                            )}
                          </div>
                          <textarea className="w-full p-2 border rounded-lg mt-2" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
                          <button onClick={() => handleAddComment(task.id)} disabled={isCreating} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                            {isCreating ? "Adding..." : "Add Comment"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-sm text-gray-500 py-4">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center py-4">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-4 py-2 bg-gray-200 rounded-md disabled:bg-gray-400">
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={data?.current_page === data?.last_page} className="px-4 py-2 bg-gray-200 rounded-md disabled:bg-gray-400">
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskManagement;
