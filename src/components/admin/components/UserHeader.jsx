import React from "react";

function UserHeader({ searchTerm, setSearchTerm, roleFilter, setRoleFilter }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 justify-between">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64 focus:ring-indigo-500 focus:border-indigo-500"
      />

      <div className="flex gap-3">
        <select
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );
}

export default UserHeader;
