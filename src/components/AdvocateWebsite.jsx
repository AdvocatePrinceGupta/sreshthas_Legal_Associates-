import React, { useState, useEffect } from 'react';
import { Scale, FileText, Briefcase, User, MessageSquare, Home, Search, Menu, X, Send, Calendar, CheckCircle, Clock, AlertCircle, Phone, Mail, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import { getCaseById, getBlogPosts, createContactInquiry, createTrademarkApplication } from '../lib/supabase';

const AdvocateWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [blogs, setBlogs] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '', service: 'general' });
  const [caseTrackingId, setCaseTrackingId] = useState('');
  const [trademarkForm, setTrademarkForm] = useState({ companyName: '', brandName: '', category: '', email: '', phone: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (currentPage === 'blog') {
      loadBlogs();
    }
  }, [currentPage]);

  const loadBlogs = async () => {
    setLoading(true);
    const { data, error } = await getBlogPosts();
    if (data) setBlogs(data);
    setLoading(false);
  };

  const navigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await createContactInquiry({
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      service_type: contactForm.service,
      message: contactForm.message
    });
    setLoading(false);
    if (error) {
      alert('Error submitting form. Please try again.');
    } else {
      alert('Thank you for contacting us! We will get back to you shortly.');
      setContactForm({ name: '', email: '', phone: '', message: '', service: 'general' });
    }
  };

  const handleTrackCase = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await getCaseById(caseTrackingId.toUpperCase());
    setLoading(false);
    if (data) {
      alert(`Case Status:\nID: ${data.case_id}\nClient: ${data.client_name}\nType: ${data.case_type}\nStatus: ${data.status}\nProgress: ${data.progress}%\nLast Update: ${data.last_update}`);
    } else {
      alert('Case not found. Please check your case ID.');
    }
  };

  const handleTrademarkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await createTrademarkApplication({
      company_name: trademarkForm.companyName,
      brand_name: trademarkForm.brandName,
      category: trademarkForm.category,
      email: trademarkForm.email,
      phone: trademarkForm.phone,
      description: trademarkForm.description
    });
    setLoading(false);
    if (error) {
      alert('Error submitting application. Please try again.');
    } else {
      alert('Trademark registration request submitted successfully! We will contact you within 24 hours.');
      setTrademarkForm({ companyName: '', brandName: '', category: '', email: '', phone: '', description: '' });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'caseTracking', label: 'Track Case', icon: Search },
    { id: 'trademark', label: 'Trademark', icon: Scale },
    { id: 'contact', label: 'Contact', icon: MessageSquare },
  ];

  const parallaxStyle = {
    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
    transition: 'transform 0.3s ease-out',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-5 animate-pulse" style={parallaxStyle}></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gray-400 rounded-full mix-blend-overlay filter blur-xl opacity-5 animate-pulse" style={{...parallaxStyle, animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl opacity-5 animate-pulse" style={{...parallaxStyle, animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-black bg-opacity-50 backdrop-blur-md border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Scale className="w-8 h-8 text-white" />
              <span className="text-xl font-bold">Adv. Prince Gupta</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                    currentPage === item.id 
                      ? 'bg-white text-black shadow-lg shadow-white/50' 
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-90 backdrop-blur-md">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full px-4 py-3 flex items-center space-x-3 ${
                  currentPage === item.id ? 'bg-white text-black' : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Home Page */}
        {currentPage === 'home' && (
          <div className="space-y-16">
            <div className="text-center space-y-6 py-20">
              <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 animate-pulse">
                Excellence in Legal Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Dedicated to providing expert legal counsel in Civil, Criminal, Corporate, and Intellectual Property Law
              </p>
              <div className="flex justify-center space-x-4 pt-6">
                <button onClick={() => navigate('contact')} className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold shadow-lg shadow-white/50 transform hover:scale-105 transition-all">
                  Get Consultation
                </button>
                <button onClick={() => navigate('caseTracking')} className="px-8 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg font-semibold backdrop-blur-sm transition-all border border-white border-opacity-20">
                  Track Your Case
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Briefcase, title: 'Expert Legal Counsel', desc: '15+ years of experience in various legal domains' },
                { icon: Scale, title: 'Fair Representation', desc: 'Committed to justice and ethical practice' },
                { icon: FileText, title: 'Document Management', desc: 'Comprehensive case documentation and tracking' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10 hover:bg-opacity-10 transform hover:scale-105 transition-all duration-300">
                  <item.icon className="w-12 h-12 text-white mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-white border-opacity-10">
              <h2 className="text-3xl font-bold mb-4">Recent Success Stories</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black bg-opacity-50 p-6 rounded-lg border border-white border-opacity-10">
                  <h3 className="text-xl font-semibold mb-2">Landmark Civil Case Victory</h3>
                  <p className="text-gray-300">Successfully represented client in property dispute, setting precedent in Delhi High Court</p>
                </div>
                <div className="bg-black bg-opacity-50 p-6 rounded-lg border border-white border-opacity-10">
                  <h3 className="text-xl font-semibold mb-2">Corporate Merger Success</h3>
                  <p className="text-gray-300">Facilitated seamless merger process for two leading tech companies</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Page */}
        {currentPage === 'about' && (
          <div className="space-y-12">
            <div className="bg-white bg-opacity-5 backdrop-blur-md p-10 rounded-xl border border-white border-opacity-10">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-48 h-48 bg-gradient-to-br from-white to-gray-400 rounded-full flex items-center justify-center text-6xl font-bold text-black shadow-2xl">
                  PG
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4">Advocate Prince Gupta</h1>
                  <p className="text-xl text-gray-300 mb-4">Senior Advocate | LLB, LLM</p>
                  <p className="text-gray-300 leading-relaxed">
                    With over 15 years of dedicated practice in Indian law, I specialize in Civil Litigation, Corporate Law, 
                    Intellectual Property Rights, and Criminal Defense. My commitment to justice and client satisfaction has 
                    earned me recognition in Delhi High Court and Supreme Court of India.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
                <h2 className="text-2xl font-bold mb-6 text-white">Education & Qualifications</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-white pl-4">
                    <h3 className="font-bold">LLM (Master of Laws)</h3>
                    <p className="text-gray-400">Delhi University, 2012</p>
                  </div>
                  <div className="border-l-4 border-white pl-4">
                    <h3 className="font-bold">LLB (Bachelor of Laws)</h3>
                    <p className="text-gray-400">National Law University, Delhi, 2009</p>
                  </div>
                  <div className="border-l-4 border-white pl-4">
                    <h3 className="font-bold">Bar Council Registration</h3>
                    <p className="text-gray-400">Delhi Bar Council, 2010</p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
                <h2 className="text-2xl font-bold mb-6 text-white">Professional Experience</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h3 className="font-bold">Senior Advocate</h3>
                    <p className="text-gray-400">Independent Practice | 2015 - Present</p>
                  </div>
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h3 className="font-bold">Associate Lawyer</h3>
                    <p className="text-gray-400">Kumar & Associates | 2010 - 2015</p>
                  </div>
                  <div className="border-l-4 border-gray-400 pl-4">
                    <h3 className="font-bold">Legal Intern</h3>
                    <p className="text-gray-400">Delhi High Court | 2008 - 2009</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
              <h2 className="text-2xl font-bold mb-6 text-white">Areas of Expertise</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {['Civil Litigation', 'Criminal Defense', 'Corporate Law', 'Intellectual Property', 'Family Law', 'Real Estate Law', 'Tax Law', 'Labour Law', 'Consumer Protection'].map((area, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-white to-gray-300 text-black p-4 rounded-lg text-center font-semibold">
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
              <h2 className="text-2xl font-bold mb-6 text-white">Connect With Me</h2>
              <div className="flex justify-center space-x-6">
                <a href="#" className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Services Page */}
        {currentPage === 'services' && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center mb-12">Legal Services Offered</h1>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: 'Civil Litigation', icon: Scale, services: ['Property Disputes', 'Contract Disputes', 'Tort Claims', 'Recovery Suits'] },
                { title: 'Criminal Defense', icon: AlertCircle, services: ['Bail Applications', 'Trial Defense', 'Appeals', 'Anticipatory Bail'] },
                { title: 'Corporate Law', icon: Briefcase, services: ['Company Registration', 'Compliance', 'Mergers & Acquisitions', 'Corporate Governance'] },
                { title: 'Intellectual Property', icon: FileText, services: ['Trademark Registration', 'Copyright Protection', 'Patent Filing', 'IP Litigation'] },
                { title: 'Family Law', icon: User, services: ['Divorce Proceedings', 'Child Custody', 'Maintenance', 'Adoption'] },
                { title: 'Real Estate', icon: Home, services: ['Property Documentation', 'Title Verification', 'Real Estate Disputes', 'Lease Agreements'] },
              ].map((service, idx) => (
                <div key={idx} className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10 hover:bg-opacity-10 transform hover:scale-105 transition-all duration-300">
                  <service.icon className="w-12 h-12 text-white mb-4" />
                  <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                  <ul className="space-y-2">
                    {service.services.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('contact')} className="mt-6 w-full py-2 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors">
                    Request Consultation
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Page */}
        {currentPage === 'blog' && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center mb-12">Legal Insights & Articles</h1>
            {loading ? (
              <div className="text-center">Loading blogs...</div>
            ) : blogs.length > 0 ? (
              blogs.map(blog => (
                <div key={blog.id} className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10 hover:bg-opacity-10 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {blog.author}</span>
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(blog.published_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{blog.excerpt}</p>
                  <button className="text-white hover:text-gray-300 font-semibold">Read More →</button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400">No blog posts available</div>
            )}
          </div>
        )}

        {/* Case Tracking Page */}
        {currentPage === 'caseTracking' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center mb-12">Track Your Case</h1>
            
            <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
              <form onSubmit={handleTrackCase} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Enter Case ID</label>
                  <input
                    type="text"
                    value={caseTrackingId}
                    onChange={(e) => setCaseTrackingId(e.target.value)}
                    placeholder="e.g., CASE001"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50">
                  <Search className="w-5 h-5" />
                  <span>{loading ? 'Searching...' : 'Track Case'}</span>
                </button>
              </form>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
              <h2 className="text-2xl font-bold mb-6">How to Track Your Case</h2>
              <div className="space-y-4 text-gray-300">
                <p>1. Enter your unique Case ID provided by our office</p>
                <p>2. Click "Track Case" to view current status</p>
                <p>3. Check progress percentage and last update date</p>
                <p>4. For any queries, contact us directly</p>
              </div>
            </div>
          </div>
        )}

        {/* Trademark Registration Page */}
        {currentPage === 'trademark' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center mb-12">Trademark Registration Services</h1>
            
            <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
              <h2 className="text-2xl font-bold mb-6">Why Register Your Trademark?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'Exclusive rights to use your brand',
                  'Legal protection against infringement',
                  'Build brand value and recognition',
                  'Nationwide protection',
                  'Asset for business growth',
                  'Prevention of unauthorized use'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
              <h2 className="text-2xl font-bold mb-6">Register Your Trademark</h2>
              <form onSubmit={handleTrademarkSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Company Name</label>
                    <input
                      type="text"
                      value={trademarkForm.companyName}
                      onChange={(e) => setTrademarkForm({...trademarkForm, companyName: e.target.value})}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Brand/Trademark Name</label>
                    <input
                      type="text"
                      value={trademarkForm.brandName}
                      onChange={(e) => setTrademarkForm({...trademarkForm, brandName: e.target.value})}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Business Category</label>
                  <select
                    value={trademarkForm.category}
                    onChange={(e) => setTrademarkForm({...trademarkForm, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="technology">Technology & Software</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="services">Professional Services</option>
                    <option value="fmcg">FMCG & Consumer Goods</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={trademarkForm.email}
                      onChange={(e) => setTrademarkForm({...trademarkForm, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={trademarkForm.phone}
                      onChange={(e) => setTrademarkForm({...trademarkForm, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Trademark Description</label>
                  <textarea
                    value={trademarkForm.description}
                    onChange={(e) => setTrademarkForm({...trademarkForm, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                    placeholder="Describe your trademark, its usage, and any unique characteristics..."
                    required
                  ></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-white/50 disabled:opacity-50">
                  <Scale className="w-5 h-5" />
                  <span>{loading ? 'Submitting...' : 'Submit Registration Request'}</span>
                </button>
              </form>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
              <h2 className="text-2xl font-bold mb-6">Registration Process</h2>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Trademark Search', desc: 'We conduct a comprehensive search to ensure availability' },
                  { step: 2, title: 'Application Filing', desc: 'Preparation and filing of application with trademark registry' },
                  { step: 3, title: 'Examination', desc: 'Registry examines the application (3-4 months)' },
                  { step: 4, title: 'Publication', desc: 'Trademark published in journal for opposition (4 months)' },
                  { step: 5, title: 'Registration', desc: 'Certificate issued upon successful completion' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-4 bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10">
                    <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Page */}
        {currentPage === 'contact' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center mb-12">Get In Touch</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Office Address</h3>
                      <p className="text-gray-400">Chamber No. 456, Delhi High Court<br />New Delhi - 110003, India</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-400">+91 98765 43210<br />+91 11 2345 6789</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-400">contact@advprincegupta.in<br />info@rkassociates.legal</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Office Hours</h3>
                      <p className="text-gray-400">Monday - Friday: 10:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Follow Me</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Facebook className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Service Required</label>
                    <select
                      value={contactForm.service}
                      onChange={(e) => setContactForm({...contactForm, service: e.target.value})}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="civil">Civil Litigation</option>
                      <option value="criminal">Criminal Defense</option>
                      <option value="corporate">Corporate Law</option>
                      <option value="ip">Intellectual Property</option>
                      <option value="family">Family Law</option>
                      <option value="realestate">Real Estate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
                      placeholder="Describe your legal requirement..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-white/50 disabled:opacity-50">
                    <Send className="w-5 h-5" />
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black bg-opacity-50 backdrop-blur-md border-t border-white border-opacity-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="w-8 h-8 text-white" />
                <span className="text-xl font-bold">Adv. Prince Gupta</span>
              </div>
              <p className="text-gray-400 text-sm">
                Committed to excellence in legal practice and client satisfaction.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {['Home', 'About', 'Services', 'Blog'].map(link => (
                  <button key={link} onClick={() => navigate(link.toLowerCase())} className="block text-gray-400 hover:text-white transition-colors">
                    {link}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Civil Litigation</p>
                <p>Criminal Defense</p>
                <p>Corporate Law</p>
                <p>IP Rights</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Delhi High Court, New Delhi</p>
                <p>+91 98765 43210</p>
                <p>contact@advprincegupta.in</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white border-opacity-10 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Advocate Prince Gupta. All rights reserved. | Bar Council of Delhi Registration No: D/1234/2010</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdvocateWebsite;