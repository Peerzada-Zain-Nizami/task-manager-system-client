import React from "react";
import { Plus } from "lucide-react";

function CategoryHeader({ searchTerm, setSearchTerm, setEditingCategory, setShowAddForm }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 justify-between">
      <input type="text" placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64" />

      <div className="flex gap-3 items-center">
        <button
          type="button"
          className="inline-flex items-center p-2 text-ellipsis border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={() => {
            setShowAddForm(true);
            setEditingCategory(null);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </button>
      </div>
    </div>
  );
}

export default CategoryHeader;
