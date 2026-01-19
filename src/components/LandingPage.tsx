import { useState } from 'react';
import { Music, Mic, Wand2, Camera, Users, Star, Search, MapPin } from 'lucide-react';
import AuthModal from './AuthModal';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [userType, setUserType] = useState<'performer' | 'customer'>('customer');

  const openAuth = (mode: 'login' | 'signup', type: 'performer' | 'customer') => {
    setAuthMode(mode);
    setUserType(type);
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Easy Discovery',
      description: 'Find talented performers using hashtags, location, and category filters'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Verified Talent',
      description: 'Browse profiles with ratings, reviews, and demo videos from real customers'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Location-Based',
      description: 'Discover performers near your event location for hassle-free bookings'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Secure Booking',
      description: 'Simple booking process with secure payments and clear communication'
    }
  ];

  const categories = [
    { name: 'Dancers', icon: <Music className="w-6 h-6" /> },
    { name: 'Singers', icon: <Mic className="w-6 h-6" /> },
    { name: 'Magicians', icon: <Wand2 className="w-6 h-6" /> },
    { name: 'Photographers', icon: <Camera className="w-6 h-6" /> },
    { name: 'DJs', icon: <Music className="w-6 h-6" /> },
    { name: 'Bands', icon: <Users className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">TalentHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => openAuth('login', 'customer')}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => openAuth('signup', 'customer')}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Discover & Book<br />
            <span className="text-blue-600">Talented Performers</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Connect with skilled dancers, singers, magicians, and artists for your events.
            Browse profiles, watch demos, and book talent seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => openAuth('signup', 'customer')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Find Talent
            </button>
            <button
              onClick={() => openAuth('signup', 'performer')}
              className="bg-white text-slate-900 px-8 py-4 rounded-lg hover:bg-slate-50 font-semibold text-lg transition-all shadow-lg hover:shadow-xl border-2 border-slate-200"
            >
              Join as Performer
            </button>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose TalentHub?
            </h2>
            <p className="text-xl text-slate-600">
              The easiest way to find and book professional performers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex p-4 bg-blue-100 rounded-2xl text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of performers and customers on TalentHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openAuth('signup', 'customer')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 font-semibold text-lg transition-all"
            >
              Book Talent
            </button>
            <button
              onClick={() => openAuth('signup', 'performer')}
              className="bg-blue-800 text-white px-8 py-4 rounded-lg hover:bg-blue-900 font-semibold text-lg transition-all"
            >
              Showcase Your Talent
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="w-6 h-6" />
            <span className="text-xl font-bold">TalentHub</span>
          </div>
          <p className="text-slate-400">
            Connecting talent with opportunity
          </p>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          userType={userType}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(newMode) => setAuthMode(newMode)}
        />
      )}
    </div>
  );
}
