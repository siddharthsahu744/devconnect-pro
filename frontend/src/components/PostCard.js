import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Loader2 } from "lucide-react";
import API, { getCurrentUserId } from "../services/api";
import CommentBox from "./CommentBox";

function PostCard({ post, onLikeToggle }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
     const initLikes = async () => {
        try {
           const userId = await getCurrentUserId();
           // Fetch global robust counts
           const [countRes, statusRes] = await Promise.all([
               API.get(`/likes/count/${post.id}`),
               API.get(`/likes/status?userId=${userId}&postId=${post.id}`)
           ]);
           setLikesCount(countRes.data || 0);
           setLiked(statusRes.data || false);
        } catch (err) {
           console.log("Could not initialize likes", err);
        }
     };
     initLikes();
  }, [post.id]);

  const toggleCommentsAndFetch = async () => {
    const willShow = !showComments;
    setShowComments(willShow);

    if (willShow && comments.length === 0) {
      try {
        setLoadingComments(true);
        const res = await API.get(`/comments/post/${post.id}`);
        setComments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likesCount;

    try {
      // Optimistic Update
      setLiked(!prevLiked);
      setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);
      
      // Let's try standard endpoint formats
      const userId = await getCurrentUserId();
      try {
         await API.post(`/likes/toggle?userId=${userId}&postId=${post.id}`);
      } catch (e1) {
         await API.post(`/like/toggle?userId=${userId}&postId=${post.id}`); // Fallback if singular
      }
      if (onLikeToggle) onLikeToggle(post.id);
    } catch (err) {
      // Revert properly to cached state if backend totally fails
      setLiked(prevLiked);
      setLikesCount(prevCount);
      alert("Liking failed, maybe backend endpoint is different!");
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-lg hover:border-blue-100 transition-all duration-300">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`} className="block transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
              {post.authorName ? post.authorName.charAt(0).toUpperCase() : "U"}
            </div>
          </Link>
          <div>
            <Link to={`/profile/${post.userId}`} className="block">
              <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {post.authorName ? post.authorName.charAt(0).toUpperCase() + post.authorName.slice(1) : "Anonymous"}
              </h3>
            </Link>
            <p className="text-xs text-gray-400 font-medium tracking-wide">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'}) : "Just now"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-50">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      <div className="flex items-center gap-8 text-gray-500 border-t border-gray-100 pt-4 mt-5">
        <button 
          onClick={handleLike} 
          className={`flex items-center gap-2 transition-all hover:-translate-y-0.5 ${liked ? "text-pink-500 bg-pink-50 px-3 py-1.5 rounded-lg" : "hover:text-pink-500"}`}
        >
          <Heart size={22} fill={liked ? "currentColor" : "none"} className={liked ? "scale-110 transition-transform" : ""} />
          <span className="text-sm font-semibold">{likesCount} Likes</span>
        </button>
        
        <button 
          onClick={toggleCommentsAndFetch}
          className={`flex items-center gap-2 transition-all hover:-translate-y-0.5 ${showComments ? "text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg" : "hover:text-blue-600"}`}
        >
          <MessageCircle size={22} />
          <span className="text-sm font-semibold">Comments</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-5 border-t border-gray-100 pt-5 animate-in fade-in slide-in-from-top-2 duration-300 relative">
          
          {loadingComments ? (
            <div className="flex justify-center items-center py-4 text-blue-500">
               <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
            <>
              <div className="absolute top-0 left-8 w-px h-full bg-gray-100 -z-10"></div>
              {comments.length > 0 ? (
                <div className="space-y-4 mb-5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {comments.map((comment, idx) => (
                    <div key={comment.id || idx} className="flex gap-3 relative mr-2 group">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-700 shadow-sm border-2 border-white ring-2 ring-gray-50 z-10">
                          {comment.userId ? comment.userId : "C"}
                       </div>
                       <div className="bg-gray-50/80 hover:bg-gray-100 transition-colors rounded-2xl rounded-tl-none p-3.5 text-sm flex-1 border border-gray-200 shadow-[2px_2px_10px_rgba(0,0,0,0.02)]">
                         <span className="font-bold text-gray-900 block mb-1">
                           User #{comment.userId}
                         </span>
                         <span className="text-gray-700 leading-relaxed">{comment.content}</span>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50/50 rounded-xl p-5 text-center mb-4">
                   <p className="text-sm text-blue-600 font-medium tracking-wide">No comments yet. Start the conversation!</p>
                </div>
              )}
              
              <div className="pl-11 relative z-10">
                 <CommentBox postId={post.id} onCommentAdded={handleCommentAdded} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;
