import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import UserHeader from "./components/UserHeader";
import UserTable from "./components/UserTable";
import { useUserDetails, useDeleteUser, useApproveUser } from "../../hooks/user";

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data: fetchedUsers, isLoading } = useUserDetails(currentPage, debouncedSearch, roleFilter);
  const deleteUser = useDeleteUser();
  const approveUser = useApproveUser();

  const users = fetchedUsers?.data || [];
  const totalPages = fetchedUsers?.last_page || 1;

  // Debounce search input
  const debounceSearch = debounce((searchValue) => {
    setDebouncedSearch(searchValue);
  }, 500);

  useEffect(() => {
    debounceSearch(searchTerm);
    return () => debounceSearch.cancel();
  }, [searchTerm]);


  // Delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate(userId);
    }
  };

  // Approve user
  const handleApproveUser = (userId) => {
    approveUser.mutate({ userId });
  };

  // Handle Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-4 w-full">
      <div className="mb-4">
        <UserHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} roleFilter={roleFilter} setRoleFilter={setRoleFilter} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">Loading users...</div>
      ) : (
        <>
          <UserTable users={users} handleApproveUser={handleApproveUser}  handleDeleteUser={handleDeleteUser} />

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t">
            <button
              className={`px-4 py-2 rounded-md text-white ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`px-4 py-2 rounded-md text-white ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
