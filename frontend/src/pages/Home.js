import { useEffect, useState } from "react";
import API, { getCurrentUserId } from "../services/api";
import PostCard from "../components/PostCard";
import { PenSquare, Loader2 } from "lucide-react";

function Home() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts");
      // Assuming res.data is an array of posts
      setPosts(res.data || []);
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      setSubmitLoading(true);
      const userId = await getCurrentUserId();
      const res = await API.post("/posts", { content: newPostContent, userId });
      // Add new post to top of feed
      setPosts([res.data, ...posts]);
      setNewPostContent("");
    } catch (err) {
      alert("Failed to create post.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 mb-10 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">Welcome to DevConnect! ✨</h1>
          <p className="text-blue-100 font-medium">Share your thoughts, connect with developers, and build your network.</p>
        </div>
      </div>

      {/* Create Post Section */}
      <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-50/50 p-6 mb-10 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 relative z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-xl">
            <PenSquare size={22} className="text-blue-600" />
          </div>
          Create a new post
        </h2>
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none mb-4 min-h-[100px] text-gray-800 placeholder-gray-400"
          />
          <div className="flex justify-between items-center">
            <div className="text-xs font-medium text-gray-400 pl-2">
               You can mention users or add hashtags!
            </div>
            <button
              type="submit"
              disabled={submitLoading || !newPostContent.trim()}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitLoading && <Loader2 size={16} className="animate-spin" />}
              Publish
            </button>
          </div>
        </form>
      </div>

      {/* Feed Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Activity</h3>
           <div className="h-px bg-gray-200 flex-1 ml-6"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12 text-blue-600">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center border border-red-100">
            {error}
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg mb-2">No posts yet.</p>
            <p className="text-gray-400 text-sm">Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;