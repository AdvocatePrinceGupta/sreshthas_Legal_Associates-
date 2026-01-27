import React, { useState, useEffect } from 'react';
import { Scale, FileText, Briefcase, User, MessageSquare, Home, Search, Menu, X, Send, Calendar, CheckCircle, Clock, AlertCircle, Phone, Mail, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

const AdvocateWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);

  const [blogs] = useState([
    { id: '1', title: 'Understanding Intellectual Property Rights in 2024', excerpt: 'A comprehensive guide to protecting your innovations...', published_date: '2024-11-15', author: 'Adv. Rajesh Kumar' },
    { id: '2', title: 'Corporate Law: Recent Amendments You Should Know', excerpt: 'Key changes in corporate governance regulations...', published_date: '2024-11-10', author: 'Adv. Rajesh Kumar' },
    { id: '3', title: 'Trademark Registration Process Simplified', excerpt: 'Step-by-step guide to registering your brand...', published_date: '2024-11-05', author: 'Adv. Rajesh Kumar' }
  ]);

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '', service: 'general' });
  const [caseTrackingId, setCaseTrackingId] = useState('');
  const [trademarkForm, setTrademarkForm] = useState({ companyName: '', brandName: '', category: '', email: '', phone: '', description: '' });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Helper for FormSubmit.co requests
  const submitToFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('https://formsubmit.co/ajax/advoprincegupta@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      return response.ok;
    } catch (error) {
      console.error("Submission error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = await submitToFormSubmit(formData);
    
    if (success) {
      alert('Thank you! Your message has been sent successfully.');
      setContactForm({ name: '', email: '', phone: '', message: '', service: 'general' });
    } else {
      alert('Something went wrong. Please try again.');
    }
  };

  const handleTrademarkSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = await submitToFormSubmit(formData);

    if (success) {
      alert('Trademark request submitted successfully! We will contact you soon.');
      setTrademarkForm({ companyName: '', brandName: '', category: '', email: '', phone: '', description: '' });
    } else {
      alert('Error submitting application. Please try again.');
    }
  };

  const handleTrackCase = (e) => {
    e.preventDefault();
    alert('Case tracking system is being updated. Please contact the office directly for status on ID: ' + caseTrackingId);
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
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-5 animate-pulse" style={parallaxStyle}></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gray-400 rounded-full mix-blend-overlay filter blur-xl opacity-5 animate-pulse" style={{...parallaxStyle, animationDelay: '2s'}}></div>
      </div>

      {/* Nav */}
      <nav className="relative z-50 bg-black bg-opacity-50 backdrop-blur-md border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('home')}>
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

      {/* Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            {/* Grid Items */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Briefcase, title: 'Expert Legal Counsel', desc: 'Expertise in various legal domains' },
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
                    Senior practitioner at the Delhi High Court specializing in Civil Litigation and Intellectual Property. 
                    Committed to providing transparent and effective legal solutions.
                  </p>
                </div>
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
                { title: 'Civil Litigation', icon: Scale, services: ['Property Disputes', 'Contract Disputes', 'Recovery Suits'] },
                { title: 'Criminal Defense', icon: AlertCircle, services: ['Bail Applications', 'Trial Defense', 'Appeals'] },
                { title: 'Corporate Law', icon: Briefcase, services: ['Company Registration', 'Compliance', 'M&A'] },
                { title: 'Intellectual Property', icon: FileText, services: ['Trademark Registration', 'Copyright Protection'] },
              ].map((service, idx) => (
                <div key={idx} className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
                  <service.icon className="w-12 h-12 text-white mb-4" />
                  <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                  <ul className="space-y-2 mb-6">
                    {service.services.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2 text-gray-300"><CheckCircle className="w-4 h-4" /> <span>{item}</span></li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('contact')} className="w-full py-2 bg-white text-black rounded-lg font-semibold">Inquire Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Page */}
        {currentPage === 'blog' && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center mb-12">Legal Insights</h1>
            {blogs.map(blog => (
              <div key={blog.id} className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10">
                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                <p className="text-gray-400 mb-4">{blog.excerpt}</p>
                <span className="text-sm text-gray-500">{new Date(blog.published_date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Case Tracking */}
        {currentPage === 'caseTracking' && (
          <div className="max-w-xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center">Track Case</h1>
            <form onSubmit={handleTrackCase} className="bg-white bg-opacity-5 p-8 rounded-xl border border-white border-opacity-10 space-y-4">
              <input
                type="text"
                value={caseTrackingId}
                onChange={(e) => setCaseTrackingId(e.target.value)}
                placeholder="Enter Case ID"
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white"
                required
              />
              <button type="submit" className="w-full py-3 bg-white text-black rounded-lg font-bold">Search</button>
            </form>
          </div>
        )}

        {/* Trademark Page */}
        {currentPage === 'trademark' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center">Trademark Registration</h1>
            <form onSubmit={handleTrademarkSubmit} className="bg-white bg-opacity-5 p-8 rounded-xl border border-white border-opacity-10 space-y-6">
              <input type="hidden" name="_subject" value="New Trademark Application" />
              <input type="text" name="_honey" style={{ display: 'none' }} />
              
              <div className="grid md:grid-cols-2 gap-6">
                <input name="company_name" placeholder="Company Name" className="p-3 bg-white bg-opacity-10 rounded-lg" required />
                <input name="brand_name" placeholder="Brand Name" className="p-3 bg-white bg-opacity-10 rounded-lg" required />
              </div>
              <select name="category" className="w-full p-3 bg-white bg-opacity-10 rounded-lg text-gray-400" required>
                <option value="">Select Category</option>
                <option value="tech">Technology</option>
                <option value="retail">Retail</option>
                <option value="services">Services</option>
              </select>
              <div className="grid md:grid-cols-2 gap-6">
                <input name="email" type="email" placeholder="Email" className="p-3 bg-white bg-opacity-10 rounded-lg" required />
                <input name="phone" type="tel" placeholder="Phone" className="p-3 bg-white bg-opacity-10 rounded-lg" required />
              </div>
              <textarea name="description" placeholder="Description" rows="4" className="w-full p-3 bg-white bg-opacity-10 rounded-lg" required></textarea>
              <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black rounded-lg font-bold shadow-lg shadow-white/20">
                {loading ? 'Processing...' : 'Submit Trademark Request'}
              </button>
            </form>
          </div>
        )}

        {/* Contact Page */}
        {currentPage === 'contact' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center">Contact Us</h1>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white bg-opacity-5 p-8 rounded-xl border border-white border-opacity-10 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Details</h2>
                <p className="flex items-center space-x-3 text-gray-400"><MapPin className="w-5 h-5" /> <span>Delhi High Court, New Delhi</span></p>
                <p className="flex items-center space-x-3 text-gray-400"><Phone className="w-5 h-5" /> <span>+91 98765 43210</span></p>
                <p className="flex items-center space-x-3 text-gray-400"><Mail className="w-5 h-5" /> <span>contact@advprincegupta.in</span></p>
              </div>

              <form onSubmit={handleContactSubmit} className="bg-white bg-opacity-5 p-8 rounded-xl border border-white border-opacity-10 space-y-4">
                <input type="hidden" name="_subject" value="Website Inquiry" />
                <input type="text" name="_honey" style={{ display: 'none' }} />
                <input name="name" placeholder="Full Name" className="w-full p-3 bg-white bg-opacity-10 rounded-lg" required />
                <input name="email" type="email" placeholder="Email" className="w-full p-3 bg-white bg-opacity-10 rounded-lg" required />
                <select name="service" className="w-full p-3 bg-white bg-opacity-10 rounded-lg text-gray-400">
                  <option value="general">General Inquiry</option>
                  <option value="civil">Civil Case</option>
                  <option value="criminal">Criminal Case</option>
                </select>
                <textarea name="message" placeholder="How can we help?" rows="4" className="w-full p-3 bg-white bg-opacity-10 rounded-lg" required></textarea>
                <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black rounded-lg font-bold shadow-lg shadow-white/20">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black bg-opacity-50 border-t border-white border-opacity-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 text-sm">
          <p>&copy; 2024 Advocate Prince Gupta | Delhi Bar Council Registration: D/1234/2010</p>
        </div>
      </footer>
    </div>
  );
};

export default AdvocateWebsite;
