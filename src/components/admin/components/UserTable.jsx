import React from "react";
import { Pencil, Trash2, Shield, CheckCircle } from "lucide-react";
import { useUpdateUser } from "../../../hooks/user";

export default function UserTable({ users, handleDeleteUser, handleApproveUser }) {
  const updateUser = useUpdateUser();

  const handleUpdateRole = (userId, newRole) => {
    updateUser.mutate({ userId, userData: { role: newRole } });
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 table-auto">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-4 py-2 text-sm font-medium text-gray-900">{user.name}</td>
            <td className="px-4 py-2 text-sm text-gray-500">{user.email}</td>

            <td className="px-4 py-2 text-sm text-gray-500">
              <select value={user.role} onChange={(e) => handleUpdateRole(user.id, e.target.value)} className="border border-gray-300 rounded p-1">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td className="px-4 py-2 text-sm text-gray-500">{user.is_approved ? "Yes" : "No"}</td>
            <td className="px-4 py-2 text-right flex items-center gap-2">
              {!user.is_approved && (
                <button onClick={() => handleApproveUser(user.id)} className="text-green-600 hover:text-green-900">
                  <CheckCircle className="h-5 w-5" />
                </button>
              )}
              <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                <Trash2 className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
