import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import parse from "html-react-parser";
import { format } from "date-fns";
import { Heart, MessageCircle, Clock, User, Share2 } from "lucide-react";

const PostDetail = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const { slug } = useParams();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/posts/${slug}`);
        setPost(data);
        setLikeCount(data.likes.length);
        if (user && data.likes.includes(user._id)) {
          setHasLiked(true);
        }

        const commentsRes = await axios.get(
          `${BASE_URL}/api/posts/${data._id}/comments`,
        );
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Error fetching post", error);
      }
      setLoading(false);
    };

    fetchPostAndComments();
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) return alert("Please login to like this post");

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        `${BASE_URL}/api/posts/${post._id}/like`,
        {},
        config,
      );

      setHasLiked(data.includes(user._id));
      setLikeCount(data.length);
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    if (!newComment.trim()) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        `${BASE_URL}/api/posts/${post._id}/comments`,
        { text: newComment },
        config,
      );

      setComments([data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center p-12 text-gray-500">Post not found.</div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Cover Image */}
      {post.coverImage && post.coverImage !== "no-photo.jpg" && (
        <div className="w-full h-64 md:h-96 relative">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
              {post.category?.name}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} />{" "}
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          {post.subtitle && (
            <h2 className="text-xl text-gray-500 font-normal leading-relaxed mb-6">
              {post.subtitle}
            </h2>
          )}

          <div className="flex items-center justify-between py-6 border-y border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {post.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{post.author?.name}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${hasLiked ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <Heart
                  size={20}
                  fill={hasLiked ? "currentColor" : "none"}
                  className={hasLiked ? "text-red-500" : ""}
                />
                <span className="font-medium">{likeCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-800 prose-indigo prose-img:rounded-xl">
          {parse(post.content)}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <MessageCircle size={24} /> Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-10">
              <textarea
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                rows="3"
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg font-medium transition shadow-md"
                >
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-10 text-center">
              <p className="text-gray-600 mb-4">Join the conversation</p>
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition inline-block shadow-md"
              >
                Log in to Comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {comment.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-900">
                      {comment.author?.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(comment.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-gray-700 pl-10">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostDetail;
