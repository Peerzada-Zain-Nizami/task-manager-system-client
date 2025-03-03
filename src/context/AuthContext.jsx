import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  onAuth: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for stored token and user data in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (_) {
        alert("Your session is expiring. Please log in again.");
        logout();
      }
    }
  }, []);

  const onAuth = (token, userData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
    console.log(userData,"===================");
    console.log(userData.role === "admin", "@@@@@@@@@@@@@@@@@");
    
    if (userData.role === "admin") {
      navigate("/admin"); // Navigate to the home page or desired page
    } else {
      navigate("/user"); // Navigate to the home page or desired page
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/login"); // Navigate to the home page or login page
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        onAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
