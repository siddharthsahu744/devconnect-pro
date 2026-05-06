import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Lock, Mail } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // FIX: Clear any stale userId cache before login so it correctly fetches the new user's ID
    localStorage.removeItem("userId");

    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        // Fallback if backend returns differently
        localStorage.setItem("token", res.data);
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-[100px] opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-gradient-to-tl from-pink-400 to-purple-500 rounded-full blur-[120px] opacity-20"></div>

      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative z-10">
        <div>
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 transform -rotate-3 mb-6">
            <span className="text-white text-3xl font-black rotate-3">D</span>
          </div>
          <h2 className="mt-2 text-center text-3xl font-black text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium tracking-wide">
            Sign in to your DevConnect account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-11 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-11 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 transition-all hover:-translate-y-0.5"
            >
              {loading ? "Signing in..." : "Sign in to account"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-blue-600 hover:text-indigo-600 transition-colors">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;