import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { getCurrentUserId } from "../services/api";
import PostCard from "../components/PostCard";
import { User, Mail, Calendar, Loader2, UserPlus, UserMinus } from "lucide-react";

function Profile() {
  const { id } = useParams(); // If present, it's viewing someone else
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentLoggedUserId, setCurrentLoggedUserId] = useState(null);
  
  // Follow State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      const loggedId = await getCurrentUserId();
      setCurrentLoggedUserId(loggedId);
      if (!loggedId) throw new Error("Not logged in");

      // Determine who we are looking at
      const targetUserId = id ? parseInt(id) : loggedId;

      // Fetch all users to find the target user (Backend should ideally have /users/{id})
      const usersRes = await API.get("/auth/users");
      const targetUser = usersRes.data.find(u => u.id === targetUserId);
      
      if (!targetUser) throw new Error("User not found");
      setUser(targetUser);

      // Fetch Stats and Status (Parallel execution for speed)
      try {
        const [postsRes, followersRes, followingRes, statusRes] = await Promise.all([
          API.get("/posts/user/" + targetUser.id),
          API.get("/follow/followers/" + targetUser.id),
          API.get("/follow/following/" + targetUser.id),
          // Only check following status if we're viewing someone else
          targetUser.id !== loggedId 
            ? API.get(`/follow/status?followerId=${loggedId}&followingId=${targetUser.id}`)
            : Promise.resolve({ data: false })
        ]);

        setPosts(postsRes.data || []);
        setFollowersCount(followersRes.data || 0);
        setFollowingCount(followingRes.data || 0);
        setIsFollowing(statusRes.data || false);
      } catch (e) {
        console.error("- Required Backend Endpoints failed. Ensure Spring Boot is updated and restarted -", e);
        // Fallback for posts if backend isn't ready
        try {
          const allPostsRes = await API.get("/posts");
          setPosts(allPostsRes.data.filter(p => p.userId === targetUser.id));
        } catch { setPosts([]); }
      }
    } catch (err) {
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user || user.id === currentLoggedUserId) return;
    
    try {
      setFollowLoading(true);
      await API.post(`/follow/toggle?followerId=${currentLoggedUserId}&followingId=${user.id}`);
      
      // Optimistic update
      setIsFollowing(!isFollowing);
      setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
    } catch (err) {
      alert("Failed to update follow status.");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-blue-600">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center border border-red-100">
          {error || "Profile not found."}
        </div>
      </div>
    );
  }

  const isOwnProfile = user.id === currentLoggedUserId;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-50 overflow-hidden mb-10 transition-all hover:shadow-2xl hover:shadow-blue-900/10 relative">
        {/* Abstract Gradient Banner */}
        <div className="h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 -mt-16 relative z-10 block">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="w-32 h-32 bg-white rounded-2xl p-1.5 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full bg-gradient-to-tr from-blue-100 to-indigo-50 text-blue-600 rounded-xl flex items-center justify-center text-5xl font-extrabold shadow-inner -rotate-3 hover:-rotate-0 transition-transform duration-300">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
              
              <div className="mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {user.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : ""}
                </h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                    <Mail size={16} className="text-purple-500" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                    <Calendar size={16} className="text-blue-500" />
                    Member
                  </span>
                </div>
              </div>
            </div>

            {/* Follow/Unfollow Button */}
            <div className="mb-2 sm:self-center">
              {isOwnProfile ? (
                 <button 
                   disabled
                   className="px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                 >
                    <User size={18} />
                    This is You
                 </button>
              ) : (
                 <button 
                   onClick={handleFollowToggle}
                   disabled={followLoading}
                   className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm ${
                     isFollowing 
                     ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg focus:ring-4 focus:ring-blue-200"
                   }`}
                 >
                    {followLoading ? <Loader2 size={18} className="animate-spin" /> : (isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />)}
                    {isFollowing ? "Unfollow" : "Follow"}
                 </button>
              )}
            </div>
          </div>
          
          {/* Connection Stats */}
          <div className="mt-6 flex gap-6 text-gray-800">
             <div className="flex items-center gap-1.5 font-medium">
               <span className="text-lg font-bold text-gray-900">{followersCount}</span> Followers
             </div>
             <div className="flex items-center gap-1.5 font-medium">
               <span className="text-lg font-bold text-gray-900">{followingCount}</span> Following
             </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">
          {isOwnProfile ? "Your Posts" : `${user.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Their"} Posts`}
        </h3>
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={{...post, authorName: user.username}} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg mb-2">No posts available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;