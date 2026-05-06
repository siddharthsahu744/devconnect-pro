import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Home as HomeIcon } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2 hover:scale-105 transition-transform">
          DevConnect
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 flex items-center gap-1.5 font-medium transition-all hover:-translate-y-0.5 px-2 py-1 rounded-lg hover:bg-blue-50/50">
            <HomeIcon size={20} strokeWidth={2.5} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link to="/profile" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1.5 font-medium transition-all hover:-translate-y-0.5 px-2 py-1 rounded-lg hover:bg-indigo-50/50">
            <User size={20} strokeWidth={2.5} />
            <span className="hidden sm:inline">Profile</span>
          </Link>
          <div className="w-px h-6 bg-gray-200 hidden sm:block mx-2"></div>
          <button 
            onClick={logout}
            className="text-gray-500 hover:text-rose-500 flex items-center gap-1.5 font-medium transition-all hover:-translate-y-0.5 px-2 py-1 rounded-lg hover:bg-rose-50/50"
          >
            <LogOut size={20} strokeWidth={2.5} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;