import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { AuthContext } from '../context/AuthContext';
import parse from 'html-react-parser';
import { format } from 'date-fns';
import { Heart, MessageCircle, Clock, ArrowLeft, Tag } from 'lucide-react';

const PostDetail = () => {
  const BASE_URL = API_BASE_URL;
  const { slug } = useParams();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/posts/${slug}`);
        setPost(data);
        setLikeCount(data.likes?.length || 0);
        if (user && data.likes?.includes(user._id)) {
          setHasLiked(true);
        }

        const commentsRes = await axios.get(`${BASE_URL}/api/posts/${data._id}/comments`);
        setComments(commentsRes.data || []);
      } catch (error) {
        console.error('Error fetching post', error);
      }
      setLoading(false);
    };

    fetchPostAndComments();
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) return alert('Please login to like this post');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${BASE_URL}/api/posts/${post._id}/like`, {}, config);

      setHasLiked(data.includes(user._id));
      setLikeCount(data.length);
    } catch (error) {
      console.error('Error liking post', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');
    if (!newComment.trim()) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        `${BASE_URL}/api/posts/${post._id}/comments`,
        { text: newComment },
        config
      );

      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment', error);
    }
  };

  const calculateReadingTime = (content, subtitle) => {
    const text = (content || '') + ' ' + (subtitle || '');
    const cleanText = text.replace(/<[^>]+>/g, '');
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Post not found</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">The article you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-indigo-700 transition">
          Return Home
        </Link>
      </div>
    );
  }

  const readTime = calculateReadingTime(post.content, post.subtitle);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors">
      {/* Back Navigation Bar */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <ArrowLeft size={14} /> Back to stories
        </Link>
      </div>

      {/* Main Single Article View */}
      <article className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-8">
          
          {/* Article Header Metadata */}
          <header className="space-y-4 border-b border-zinc-100 dark:border-zinc-800 pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {post.category && (
                <span className="bg-indigo-50 dark:bg-indigo-950/90 text-indigo-700 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-800/50 px-3 py-1 rounded-full text-xs font-semibold">
                  {post.category.name}
                </span>
              )}
              <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-medium">
                <Clock size={13} className="text-zinc-400 dark:text-zinc-500" /> {readTime} min read
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                {post.createdAt ? format(new Date(post.createdAt), 'MMMM d, yyyy') : ''}
              </span>
            </div>

            {/* Main Article Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Subtitle / Excerpt */}
            {post.subtitle && (
              <p className="text-lg text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
                {post.subtitle}
              </p>
            )}

            {/* Author Profile & Interaction Ribbon */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{post.author?.name || 'Anonymous Author'}</h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">Writer & Contributor</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition ${
                    hasLiked
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Heart
                    size={16}
                    fill={hasLiked ? 'currentColor' : 'none'}
                    className={hasLiked ? 'text-rose-500' : 'text-zinc-400'}
                  />
                  <span>{likeCount}</span>
                </button>
              </div>
            </div>
          </header>

          {/* Article Cover Image */}
          {post.coverImage && post.coverImage !== 'no-photo.jpg' && (
            <div className="overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-xs max-h-96">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body with Tailwind Typography + dark:prose-invert */}
          <div className="prose prose-lg prose-zinc dark:prose-invert prose-indigo max-w-none py-2 text-zinc-800 dark:text-zinc-200 leading-relaxed">
            {parse(post.content || '')}
          </div>

          {/* Tag Cloud */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-2">
              <Tag size={14} className="text-zinc-400 dark:text-zinc-500" />
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1 rounded-full text-xs font-medium border border-zinc-200/60 dark:border-zinc-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <section className="pt-10 border-t border-zinc-200/80 dark:border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <MessageCircle size={20} className="text-indigo-600 dark:text-indigo-400" />
                <span>Discussion ({comments.length})</span>
              </h3>
            </div>

            {/* Comment Submission Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-zinc-900 transition resize-none"
                  rows="3"
                  placeholder="What are your thoughts on this story?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs transition"
                  >
                    Publish Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-zinc-50 dark:bg-zinc-800/40 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 text-center space-y-3">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Join the discussion with fellow readers.</p>
                <Link
                  to="/login"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2 rounded-full shadow-xs transition"
                >
                  Log in to comment
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4 pt-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                        {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">{comment.author?.name || 'User'}</span>
                    </div>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                      {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, yyyy') : ''}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm pl-9 leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
