import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Heart, MessageCircle, Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#4f46e5', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];

const Dashboard = () => {
  const BASE_URL = API_BASE_URL;
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${BASE_URL}/api/analytics`, config);
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${BASE_URL}/api/posts/id/${id}`, config);
        fetchAnalytics();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-zinc-200/80">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Author Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your publications and track reader engagement</p>
        </div>
        <Link
          to="/editor"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-3 rounded-full shadow-xs transition"
        >
          <Plus size={16} /> Write New Story
        </Link>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-zinc-200/80 flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Articles</p>
            <h3 className="text-2xl font-bold text-zinc-900 mt-0.5">{analytics?.totalPosts || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xs border border-zinc-200/80 flex items-center gap-4">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl">
            <Heart size={28} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Likes</p>
            <h3 className="text-2xl font-bold text-zinc-900 mt-0.5">{analytics?.totalLikes || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xs border border-zinc-200/80 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <MessageCircle size={28} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Comments</p>
            <h3 className="text-2xl font-bold text-zinc-900 mt-0.5">{analytics?.totalComments || 0}</h3>
          </div>
        </div>
      </div>

      {/* Content Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-zinc-200/80 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900">Your Articles</h3>
            <span className="text-xs font-medium text-zinc-400">{analytics?.posts?.length || 0} stories</span>
          </div>

          <div className="divide-y divide-zinc-100 flex-grow">
            {analytics?.posts && analytics.posts.length > 0 ? (
              analytics.posts.map((post) => (
                <div key={post._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/60 transition">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {post.status === 'Published' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <CheckCircle size={12} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          <Clock size={12} /> Draft
                        </span>
                      )}
                      <span className="text-xs text-zinc-400">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <Link
                      to={post.status === 'Published' ? `/post/${post.slug}` : `/editor/${post._id}`}
                      className="text-base font-bold text-zinc-900 hover:text-indigo-600 transition block line-clamp-1"
                    >
                      {post.title}
                    </Link>

                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Heart size={13} className="text-rose-500" /> {post.likes?.length || 0} likes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <Link
                      to={`/editor/${post._id}`}
                      className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                      title="Edit Story"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete Story"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-zinc-400 text-sm">
                You haven't published any articles yet.
              </div>
            )}
          </div>
        </div>

        {/* Analytics Breakdown */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-zinc-200/80 flex flex-col p-6 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">Topic Distribution</h3>
          <div className="h-60 flex items-center justify-center">
            {analytics?.chartData && analytics.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-zinc-400 text-xs">No topic data available</p>
            )}
          </div>

          {analytics?.chartData && analytics.chartData.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100">
              {analytics.chartData.map((entry, index) => (
                <div key={`legend-${index}`} className="inline-flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-200/60">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
