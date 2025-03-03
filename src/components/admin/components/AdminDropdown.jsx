import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const AdminDropdown = () => {
  const { logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={buttonRef} className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
        {user?.name?.charAt(0)}
      </div>

      {dropdownOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white shadow-lg shadow-black/30 rounded-md z-[999]">
          <div className="space-y-0 p-2">
            <div className="text-gray-900 font-medium">{user.name}</div>
            <div className="text-gray-600 text-sm">{user.email}</div>
          </div>
          <div className="border-t border-gray-200"></div>
          <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-500/20 text-sm" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDropdown;
