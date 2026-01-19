import { useState } from 'react';
import { supabase, Booking, PerformerProfile } from '../lib/supabase';
import { Calendar, Clock, MapPin, DollarSign, User, CheckCircle, XCircle } from 'lucide-react';

type Props = {
  bookings: Booking[];
  onBookingUpdate: () => void;
  performerProfile: PerformerProfile | null;
};

export default function PerformerBookings({ bookings, onBookingUpdate, performerProfile }: Props) {
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setUpdatingBooking(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      if (status === 'confirmed' && performerProfile) {
        await supabase
          .from('performer_profiles')
          .update({ total_bookings: performerProfile.total_bookings + 1 })
          .eq('id', performerProfile.id);
      }

      onBookingUpdate();
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setUpdatingBooking(null);
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

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p>No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div key={booking.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{booking.event_type}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
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
                  {new Date(booking.event_date).toLocaleDateString()} at {booking.event_time}
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

          {booking.customer_notes && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-slate-900 mb-1">Customer Notes</p>
              <p className="text-sm text-slate-600">{booking.customer_notes}</p>
            </div>
          )}

          {booking.status === 'pending' && (
            <div className="flex space-x-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                disabled={updatingBooking === booking.id}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                disabled={updatingBooking === booking.id}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Decline</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
