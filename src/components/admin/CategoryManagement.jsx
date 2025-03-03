import React, { useEffect, useState } from "react";
import CategoryHeader from "./components/CategoryHeader";
import CategoryTable from "./components/CategoryTable";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../../hooks/category";
import { debounce } from "lodash"; // Import lodash debounce
import { toast } from "react-toastify";

const CategoryManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced state

  const { data: fetchedCategories, isLoading } = useCategories(currentPage, debouncedSearch);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", status: "active" });

  const categories = fetchedCategories?.data || [];
  const totalPages = fetchedCategories?.last_page || 1;

  // Debounce function for search input
  const debounceSearch = debounce((searchValue) => {
    setDebouncedSearch(searchValue);
  }, 500);

  // Handle search term change with debounce
  useEffect(() => {
    debounceSearch(searchTerm);
    return () => debounceSearch.cancel(); // Cleanup function
  }, [searchTerm]);

  // Create new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error("Name is Required");
      return;
    }
    createCategory.mutate(newCategory, {
      onSuccess: () => setShowAddForm(false),
    });
  };

  // Update existing category
  const handleSaveCategory = () => {
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      toast.error("Name is Required");
      return;
    }

    updateCategory.mutate(
      { id: editingCategory.id, categoryData: editingCategory },
      {
        onSuccess: () => setEditingCategory(null),
      }
    );
  };

  // Delete category
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(categoryId);
    }
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
        <CategoryHeader searchTerm={searchTerm} setEditingCategory={setEditingCategory} setSearchTerm={setSearchTerm} setShowAddForm={setShowAddForm} />
      </div>

      {showAddForm && (
        <div className="border-t p-4 bg-gray-50">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Category</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input required type="text" className="mt-1 p-2 block w-full border rounded-md" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button disabled={createCategory.isPending} className="px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700" onClick={handleAddCategory}>
              {createCategory.isPending ? "Creating..." : " Add Category"}
            </button>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="border-t p-4 bg-gray-50">
          <h4 className="text-md font-medium text-gray-900 mb-4">Edit Category</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                required
                type="text"
                className="mt-1 p-2 block w-full border rounded-md"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={() => setEditingCategory(null)}>
              Cancel
            </button>
            <button disabled={updateCategory.isPending} className="px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700" onClick={handleSaveCategory}>
              {updateCategory.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">Loading categories...</div>
      ) : (
        <>
          <CategoryTable
            filteredCategories={categories}
            handleEditCategory={(e) => {
              setShowAddForm(false);
              setEditingCategory(e);
            }}
            onConfirmDelete={handleDeleteCategory}
          />

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

export default CategoryManagement;
