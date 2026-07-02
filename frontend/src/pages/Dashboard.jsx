import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Heart, MessageCircle, Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#4f46e5', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/analytics', config);
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
        await axios.delete(`http://localhost:5000/api/posts/id/${id}`, config);
        fetchAnalytics(); 
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Author Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.name}!</p>
        </div>
        <Link to="/editor" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md flex items-center gap-2">
          <Plus size={20} /> Write Post
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText size={32} />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Total Posts</p>
            <h3 className="text-3xl font-bold text-gray-900">{analytics?.totalPosts || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-pink-50 text-pink-600 rounded-xl">
            <Heart size={32} />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Total Likes</p>
            <h3 className="text-3xl font-bold text-gray-900">{analytics?.totalLikes || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <MessageCircle size={32} />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Total Comments</p>
            <h3 className="text-3xl font-bold text-gray-900">{analytics?.totalComments || 0}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-800">Your Content</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {analytics?.posts && analytics.posts.length > 0 ? (
              analytics.posts.map(post => (
                <div key={post._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {post.status === 'Published' ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"><CheckCircle size={14} /> Published</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md"><Clock size={14} /> Draft</span>
                      )}
                      <span className="text-xs text-gray-400">{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <Link to={post.status === 'Published' ? `/post/${post.slug}` : `/editor/${post._id}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition block mb-1">
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Heart size={14} /> {post.likes.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/editor/${post._id}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Edit">
                      <Edit2 size={18} />
                    </Link>
                    <button onClick={() => handleDelete(post._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                You haven't written any posts yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-800">Categories Breakdown</h3>
          </div>
          <div className="p-6 flex-grow flex items-center justify-center h-64 lg:h-auto min-h-[300px]">
            {analytics?.chartData && analytics.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">No data available</p>
            )}
          </div>
          {/* Custom Legend */}
          {analytics?.chartData && analytics.chartData.length > 0 && (
            <div className="px-6 pb-6 pt-2 flex flex-wrap justify-center gap-3">
              {analytics.chartData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name} ({entry.value})
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
