import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, Scale, MessageSquare, Plus, Edit, Trash2, LogOut, Search, Save, X } from 'lucide-react';
import { getDashboardStats, getCases, getBlogPosts, getContactInquiries, getTrademarkApplications, updateCase, createBlogPost, updateBlogPost, deleteBlogPost, signOut } from '../lib/supabase';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalCases: 0, totalInquiries: 0, totalTrademarks: 0, totalBlogs: 0 });
  const [cases, setCases] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [trademarks, setTrademarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', is_published: true });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const statsData = await getDashboardStats();
        setStats(statsData);
      } else if (activeTab === 'cases') {
        const { data } = await getCases();
        setCases(data || []);
      } else if (activeTab === 'blogs') {
        const { data } = await getBlogPosts(false);
        setBlogs(data || []);
      } else if (activeTab === 'inquiries') {
        const { data } = await getContactInquiries();
        setInquiries(data || []);
      } else if (activeTab === 'trademarks') {
        const { data } = await getTrademarkApplications();
        setTrademarks(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCase = async (caseId, updates) => {
    try {
      await updateCase(caseId, updates);
      alert('Case updated successfully!');
      loadData();
      setSelectedCase(null);
    } catch (error) {
      alert('Error updating case');
    }
  };

  const handleSaveBlog = async () => {
    try {
      if (editingBlog && editingBlog !== 'new') {
        await updateBlogPost(editingBlog, blogForm);
        alert('Blog updated successfully!');
      } else {
        await createBlogPost(blogForm);
        alert('Blog created successfully!');
      }
      setBlogForm({ title: '', excerpt: '', content: '', is_published: true });
      setEditingBlog(null);
      loadData();
    } catch (error) {
      alert('Error saving blog');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlogPost(id);
        alert('Blog deleted successfully!');
        loadData();
      } catch (error) {
        alert('Error deleting blog');
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    if (onLogout) onLogout();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'cases', label: 'Cases', icon: Scale },
    { id: 'blogs', label: 'Blog Posts', icon: FileText },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'trademarks', label: 'Trademarks', icon: Users },
  ];

  const filteredCases = cases.filter(c => 
    c.case_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Top Navigation */}
      <nav className="bg-black bg-opacity-50 backdrop-blur-md border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Scale className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black bg-opacity-50 backdrop-blur-md border-r border-white border-opacity-10 min-h-screen p-4">
          <div className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-lg shadow-white/50'
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-4xl font-bold text-white mb-8">Dashboard Overview</h1>
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Cases', value: stats.totalCases, icon: Scale, gradient: 'from-white to-gray-400' },
                  { label: 'Inquiries', value: stats.totalInquiries, icon: MessageSquare, gradient: 'from-gray-300 to-gray-500' },
                  { label: 'Trademarks', value: stats.totalTrademarks, icon: Users, gradient: 'from-gray-400 to-gray-600' },
                  { label: 'Blog Posts', value: stats.totalBlogs, icon: FileText, gradient: 'from-gray-500 to-gray-700' },
                ].map((stat, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl shadow-2xl text-black`}>
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="w-8 h-8" />
                      <span className="text-3xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-sm font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white bg-opacity-5 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-10 text-white">
                <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                    <span>Active Cases</span>
                    <span className="text-2xl font-bold">{stats.totalCases}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                    <span>Pending Inquiries</span>
                    <span className="text-2xl font-bold">{stats.totalInquiries}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                    <span>Published Blogs</span>
                    <span className="text-2xl font-bold">{stats.totalBlogs}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cases Tab */}
          {activeTab === 'cases' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-white">Manage Cases</h1>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {loading ? (
                  <div className="text-white text-center">Loading cases...</div>
                ) : filteredCases.length > 0 ? (
                  filteredCases.map(caseItem => (
                    <div key={caseItem.id} className="bg-white bg-opacity-5 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-10 text-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{caseItem.case_id}</h3>
                          <p className="text-gray-400">{caseItem.client_name}</p>
                          <p className="text-sm text-gray-500">{caseItem.case_type}</p>
                        </div>
                        <button
                          onClick={() => setSelectedCase(caseItem)}
                          className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress: {caseItem.progress}%</span>
                          <span className="text-gray-400">Status: {caseItem.status}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-white h-2 rounded-full" style={{width: `${caseItem.progress}%`}}></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">Last updated: {new Date(caseItem.last_update).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-white text-center">No cases found</div>
                )}
              </div>

              {/* Edit Case Modal */}
              {selectedCase && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white border-opacity-20">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Edit Case: {selectedCase.case_id}</h2>
                      <button onClick={() => setSelectedCase(null)} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-2">Progress (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={selectedCase.progress}
                          id="progress-input"
                          className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-semibold mb-2">Status</label>
                        <select
                          defaultValue={selectedCase.status}
                          id="status-select"
                          className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          const progress = document.getElementById('progress-input').value;
                          const status = document.getElementById('status-select').value;
                          handleUpdateCase(selectedCase.id, { progress: parseInt(progress), status });
                        }}
                        className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Blog Posts Tab */}
          {activeTab === 'blogs' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-white">Blog Posts</h1>
                <button
                  onClick={() => setEditingBlog('new')}
                  className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Post</span>
                </button>
              </div>

              {editingBlog ? (
                <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10 mb-6">
                  <h2 className="text-2xl font-bold text-white mb-6">{editingBlog === 'new' ? 'Create New Post' : 'Edit Post'}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Title</label>
                      <input
                        type="text"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
                        placeholder="Enter blog title..."
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Excerpt</label>
                      <textarea
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                        rows="2"
                        className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
                        placeholder="Short description..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Content</label>
                      <textarea
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                        rows="12"
                        className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
                        placeholder="Write your blog content here..."
                      ></textarea>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="published"
                        checked={blogForm.is_published}
                        onChange={(e) => setBlogForm({...blogForm, is_published: e.target.checked})}
                        className="w-5 h-5"
                      />
                      <label htmlFor="published" className="text-white">Publish immediately</label>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSaveBlog}
                        className="flex-1 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Post</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingBlog(null);
                          setBlogForm({ title: '', excerpt: '', content: '', is_published: true });
                        }}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {loading ? (
                    <div className="text-white text-center">Loading blogs...</div>
                  ) : blogs.length > 0 ? (
                    blogs.map(blog => (
                      <div key={blog.id} className="bg-white bg-opacity-5 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-10 text-white">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{blog.excerpt}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{new Date(blog.published_date).toLocaleDateString()}</span>
                              <span className={`px-2 py-1 rounded ${blog.is_published ? 'bg-white bg-opacity-20 text-white' : 'bg-gray-500 bg-opacity-20 text-gray-400'}`}>
                                {blog.is_published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingBlog(blog.id);
                                setBlogForm({
                                  title: blog.title,
                                  excerpt: blog.excerpt,
                                  content: blog.content,
                                  is_published: blog.is_published
                                });
                              }}
                              className="p-2 bg-white text-black hover:bg-gray-200 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white text-center">No blog posts found</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === 'inquiries' && (
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">Contact Inquiries</h1>
              <div className="grid gap-4">
                {loading ? (
                  <div className="text-white text-center">Loading inquiries...</div>
                ) : inquiries.length > 0 ? (
                  inquiries.map(inquiry => (
                    <div key={inquiry.id} className="bg-white bg-opacity-5 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-10 text-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold">{inquiry.name}</h3>
                          <p className="text-gray-400 text-sm">{inquiry.email}</p>
                          <p className="text-gray-400 text-sm">{inquiry.phone}</p>
                          <p className="text-sm text-gray-500">Service: {inquiry.service_type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          inquiry.status === 'New' ? 'bg-white bg-opacity-20 text-white' : 'bg-gray-500 bg-opacity-20 text-gray-400'
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{inquiry.message}</p>
                      <p className="text-xs text-gray-500">Received: {new Date(inquiry.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-white text-center">No inquiries found</div>
                )}
              </div>
            </div>
          )}

          {/* Trademarks Tab */}
          {activeTab === 'trademarks' && (
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">Trademark Applications</h1>
              <div className="grid gap-4">
                {loading ? (
                  <div className="text-white text-center">Loading trademark applications...</div>
                ) : trademarks.length > 0 ? (
                  trademarks.map(tm => (
                    <div key={tm.id} className="bg-white bg-opacity-5 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-10 text-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold">{tm.brand_name}</h3>
                          <p className="text-gray-400">{tm.company_name}</p>
                          <p className="text-sm text-gray-500">Category: {tm.category}</p>
                          <p className="text-sm text-gray-400">{tm.email} | {tm.phone}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm bg-white bg-opacity-20 text-white">
                          {tm.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{tm.description}</p>
                      <p className="text-xs text-gray-500">Applied: {new Date(tm.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-white text-center">No trademark applications found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;