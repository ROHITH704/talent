import { useState, useEffect } from 'react';
import { supabase, Booking } from '../lib/supabase';
import { Calendar, MapPin, DollarSign, Clock, Star, XCircle } from 'lucide-react';

type BookingWithPerformer = Booking & {
  performer_name?: string;
};

type Props = {
  
  bookings: Booking[];
  onBookingUpdate: () => void;
};

export default function CustomerBookings({ bookings, onBookingUpdate }: Props) {
  const [bookingsWithPerformers, setBookingsWithPerformers] = useState<BookingWithPerformer[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchPerformerNames = async () => {
      if (!mounted) return;
      setLoading(true);

      try {
        if (!bookings || bookings.length === 0) {
          setBookingsWithPerformers([]);
          return;
        }

        const bookingsWithNames = await Promise.all(
          bookings.map(async (booking) => {
            if (!booking.performer_id) {
              return { ...booking, performer_name: undefined };
            }

            const { data, error } = await supabase
              .from('performer_profiles')
              .select('stage_name')
              .eq('id', booking.performer_id)
              .maybeSingle();

            if (error) {
              console.error('Error fetching performer for booking', booking.id, error);
            }

            return {
              ...booking,
              performer_name: data?.stage_name ?? undefined,
            };
          })
        );

        if (mounted) setBookingsWithPerformers(bookingsWithNames);
      } catch (err) {
        console.error('Failed to fetch performer names', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPerformerNames();

    return () => {
      mounted = false;
    };
  }, [bookings]);

  const cancelBooking = async (bookingId: string) => {
    setCancellingBooking(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;
      onBookingUpdate();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancellingBooking(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (bookingsWithPerformers.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p>No bookings yet</p>
        <p className="text-sm mt-2">Start discovering talent to make your first booking!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookingsWithPerformers.map((booking) => (
        <div
          key={booking.id}
          className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {booking.performer_name || 'Loading...'}
              </h3>
              <p className="text-slate-600 mt-1">{booking.event_type}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status ? booking.status.toUpperCase() : 'UNKNOWN'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1 text-lg font-bold text-slate-900">
                <DollarSign className="w-5 h-5" />
                <span>₹{booking.total_amount}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">Date & Time</p>
                <p className="text-sm text-slate-600">
                  {booking.event_date ? new Date(booking.event_date).toLocaleDateString() : 'TBD'} at {booking.event_time || 'TBD'}
                </p>
                <p className="text-xs text-slate-500">{booking.event_duration_hours} hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">Location</p>
                <p className="text-sm text-slate-600">{booking.event_location}</p>
                <p className="text-xs text-slate-500">
                  {booking.event_city}, {booking.event_state}
                </p>
              </div>
            </div>
          </div>

          {booking.special_requirements && (
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-slate-900 mb-1">Special Requirements</p>
              <p className="text-sm text-slate-600">{booking.special_requirements}</p>
            </div>
          )}

          {booking.performer_notes && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-slate-900 mb-1">Performer Notes</p>
              <p className="text-sm text-slate-600">{booking.performer_notes}</p>
            </div>
          )}

          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => cancelBooking(booking.id)}
                disabled={cancellingBooking === booking.id}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Cancel Booking</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}