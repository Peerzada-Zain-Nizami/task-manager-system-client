import React from "react";
import { Pencil, Trash2 } from "lucide-react";

function CategoryTable({ filteredCategories, handleEditCategory, onConfirmDelete }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 table-auto">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(category.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button onClick={() => handleEditCategory(category)} className="text-indigo-600 hover:text-indigo-900" title="Edit Category">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => onConfirmDelete(category.id)} className="text-red-600 hover:text-red-900" title="Delete Category">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">
              No categories found matching your criteria
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default CategoryTable;
