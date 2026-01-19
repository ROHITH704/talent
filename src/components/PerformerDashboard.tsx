import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase, PerformerProfile, Category, Booking } from '../lib/supabase';
import { Star, LogOut, User, Video, Calendar, Settings, DollarSign, MapPin, Briefcase } from 'lucide-react';
import PerformerProfileSetup from './PerformerProfileSetup';
import PerformerBookings from './PerformerBookings';

export default function PerformerDashboard() {
  const { profile, signOut } = useAuth();
  const [performerProfile, setPerformerProfile] = useState<PerformerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'videos'>('profile');
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (profile) {
      fetchPerformerProfile();
      fetchBookings();
    }
  }, [profile]);

  const fetchPerformerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('performer_profiles')
        .select('*')
        .eq('user_id', profile!.id)
        .maybeSingle();

      if (error) throw error;
      setPerformerProfile(data);
    } catch (error) {
      console.error('Error fetching performer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      if (!profile) return;

      const { data: performerData } = await supabase
        .from('performer_profiles')
        .select('id')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (!performerData) return;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('performer_id', performerData.id)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleProfileUpdate = () => {
    fetchPerformerProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">TalentHub</span>
              <span className="text-sm text-slate-500 ml-4">Performer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{profile?.full_name}</p>
                <p className="text-xs text-slate-500">{profile?.email}</p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {performerProfile && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{performerProfile.stage_name}</h2>
                <p className="text-slate-600 mt-1">{performerProfile.bio}</p>
                <div className="flex items-center space-x-6 mt-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">
                      {performerProfile.location_city}, {performerProfile.location_state}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">
                      Starting at ₹{performerProfile.base_price}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">
                      {performerProfile.experience_years} years
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 justify-end">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-slate-900">
                    {performerProfile.average_rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {performerProfile.total_bookings} bookings
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'bookings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Bookings</span>
                {bookings.filter(b => b.status === 'pending').length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'videos'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-5 h-5" />
                <span>Videos</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <PerformerProfileSetup
                existingProfile={performerProfile}
                onProfileUpdate={handleProfileUpdate}
              />
            )}
            {activeTab === 'bookings' && (
              <PerformerBookings
                bookings={bookings}
                onBookingUpdate={fetchBookings}
                performerProfile={performerProfile}
              />
            )}
            {activeTab === 'videos' && (
              <div className="text-center py-12 text-slate-500">
                <Video className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>Video management coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
