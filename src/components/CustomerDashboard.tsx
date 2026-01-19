import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase, Category, Booking } from '../lib/supabase';
import { Star, LogOut, Search, Filter, Calendar, Sparkles } from 'lucide-react';
import PerformerBrowser from './PerformerBrowser';
import CustomerBookings from './CustomerBookings';

export default function CustomerDashboard() {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings'>('browse');
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (profile) {
      fetchBookings();
    }
  }, [profile]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', profile!.id)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">TalentHub</span>
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'browse'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Discover Talent</span>
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
                <span>My Bookings</span>
                {bookings.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {bookings.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'browse' && <PerformerBrowser onBookingCreated={fetchBookings} />}
            {activeTab === 'bookings' && (
              <CustomerBookings bookings={bookings} onBookingUpdate={fetchBookings} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
