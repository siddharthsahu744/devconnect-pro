import { useState } from "react";
import { Send } from "lucide-react";
import API, { getCurrentUserId } from "../services/api";

function CommentBox({ postId, onCommentAdded }) {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      const res = await API.post("/comments", {
        postId,
        content: commentText,
        userId
      });
      setCommentText("");
      if (onCommentAdded) {
        onCommentAdded(res.data);
      }
    } catch (err) {
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !commentText.trim()}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 transition-colors"
      >
        <Send size={18} />
      </button>
    </form>
  );
}

export default CommentBox;
