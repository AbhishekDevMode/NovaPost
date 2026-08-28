import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Clock, Heart, Sparkles, BookOpen, User, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { API_BASE_URL } from '../config/api';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const k = searchParams.get('keyword') || '';
    const c = searchParams.get('category') || '';
    setKeyword(k);
    setActiveCategory(c);
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/posts?page=${page}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      if (activeCategory) url += `&category=${encodeURIComponent(activeCategory)}`;

      const { data } = await axios.get(url);
      setPosts(data.posts || []);
      setPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, activeCategory, keyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const params = {};
    if (keyword) params.keyword = keyword;
    if (activeCategory) params.category = activeCategory;
    setSearchParams(params);
  };

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setPage(1);
    const params = {};
    if (keyword) params.keyword = keyword;
    if (catId) params.category = catId;
    setSearchParams(params);
  };

  const calculateReadingTime = (content, subtitle) => {
    const text = (content || '') + ' ' + (subtitle || '');
    const cleanText = text.replace(/<[^>]+>/g, '');
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-white via-zinc-50/50 to-zinc-50 dark:from-zinc-900 dark:via-zinc-900/60 dark:to-zinc-950 border-b border-zinc-200/60 dark:border-zinc-800/80 py-16 px-4 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-indigo-100/80 dark:border-indigo-800/60 shadow-xs">
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Editorial Stories & Insights</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Thoughtful Writing on <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-900 underline-offset-8">Technology</span> & Culture.
          </h1>

          <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover compelling stories, expert analysis, and fresh perspectives from creators worldwide.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-zinc-400 dark:text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search topics, titles, or tags..."
                className="w-full pl-11 pr-28 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-sm text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Categories Pill Bar */}
          <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
            <button
              onClick={() => handleCategorySelect('')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                activeCategory === ''
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              All Topics
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => handleCategorySelect(c._id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                  activeCategory === c._id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Blog Grid Section */}
      <main className="max-w-6xl mx-auto my-12 px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-800 animate-pulse space-y-4">
                <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 text-center max-w-lg mx-auto shadow-xs my-8">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">No articles found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
              We couldn't find any articles matching your search criteria.
            </p>
            <button
              onClick={() => { setKeyword(''); setActiveCategory(''); setSearchParams({}); }}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 rounded-full hover:bg-black transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const readTime = calculateReadingTime(post.content, post.subtitle);
                return (
                  <Link
                    to={`/post/${post.slug}`}
                    key={post._id}
                    className="overflow-hidden rounded-2xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col"
                  >
                    {/* Cover Image Container with Hover Zoom */}
                    <div className="h-52 bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                      {post.coverImage && post.coverImage !== 'no-photo.jpg' ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-indigo-300 dark:text-indigo-600/40">
                          <BookOpen size={40} className="text-indigo-400/50" />
                        </div>
                      )}

                      {/* Category Badge */}
                      {post.category && (
                        <span className="absolute top-4 left-4 bg-indigo-50 dark:bg-indigo-950/90 text-indigo-700 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-800/50 px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
                          {post.category.name}
                        </span>
                      )}
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 flex flex-col flex-grow space-y-3">
                      {/* Reading Time & Meta */}
                      <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                        <span className="flex items-center gap-1 font-medium text-zinc-500 dark:text-zinc-400">
                          <Clock size={13} className="text-zinc-400 dark:text-zinc-500" /> {readTime} min read
                        </span>
                        <span>
                          {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : ''}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition duration-200 line-clamp-2 leading-snug">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 flex-grow leading-relaxed">
                        {post.subtitle || (post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : '')}
                      </p>

                      {/* Card Footer: Author & Likes */}
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-auto text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                            {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{post.author?.name || 'Anonymous'}</span>
                        </div>

                        <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-500 font-medium">
                          <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                            <Heart size={14} className="text-rose-500/80" fill="currentColor" /> {post.likes?.length || 0}
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                            <ChevronRight size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                {[...Array(pages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => setPage(x + 1)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition ${
                      page === x + 1
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
