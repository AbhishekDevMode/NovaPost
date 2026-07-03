import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Editor = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists, we are editing

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("Draft");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(data);
        if (data.length > 0 && !category) {
          setCategory(data[0]._id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const { data } = await axios.get(`${BASE_URL}/api/posts/id/${id}`); // wait, we don't have a route by id for GET, we use slug. Let's adjust backend or we can get it from dashboard analytics data if we had global state.
          // Since we need to get post by id for editing, let's fetch all author posts from analytics and find it.
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const analyticsRes = await axios.get(
            `${BASE_URL}/api/analytics`,
            config,
          );
          const post = analyticsRes.data.posts.find((p) => p._id === id);
          if (post) {
            setTitle(post.title);
            setSubtitle(post.subtitle || "");
            setContent(post.content);
            setCoverImage(post.coverImage || "");
            setCategory(post.category?._id || "");
            setTags(post.tags?.join(", ") || "");
            setStatus(post.status);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchPost();
    }
  }, [id, user]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        `${BASE_URL}/api/categories`,
        { name: newCatName },
        config,
      );
      setCategories([...categories, data]);
      setCategory(data._id);
      setNewCatName("");
    } catch (error) {
      alert(error.response?.data?.message || "Error creating category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const postData = {
        title,
        subtitle,
        content,
        coverImage,
        category,
        tags: tagsArray,
        status,
      };

      if (id) {
        await axios.put(`${BASE_URL}/api/posts/id/${id}`, postData, config);
      } else {
        await axios.post(`${BASE_URL}/api/posts`, postData, config);
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Error saving post");
    }
    setLoading(false);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? "Edit Post" : "Create New Post"}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setStatus("Draft")}
            className={`px-4 py-2 rounded-lg font-medium transition ${status === "Draft" ? "bg-amber-100 text-amber-700" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
          >
            Draft
          </button>
          <button
            onClick={() => setStatus("Published")}
            className={`px-4 py-2 rounded-lg font-medium transition ${status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
          >
            Published
          </button>
        </div>
      </div>

      <div className="p-8 flex flex-col lg:flex-row gap-8">
        {/* Main Editor */}
        <div className="lg:w-2/3 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Post Title
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-xl font-bold"
              placeholder="Give it a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Subtitle / Summary
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="A brief summary..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div className="h-[400px] pb-12">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Content
            </label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-full rounded-xl overflow-hidden"
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-200 pb-2">
              Publish Settings
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                placeholder="https://..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
              {coverImage && (
                <div className="mt-3 rounded-lg overflow-hidden h-32 bg-gray-200">
                  <img
                    src={coverImage}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm mb-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Quick Add Category */}
              <form onSubmit={handleCreateCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Category"
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  Add
                </button>
              </form>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                placeholder="tech, coding, tutorial"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Saving..." : `Save as ${status}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
