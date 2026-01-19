import { Star, MapPin, Briefcase, DollarSign, CheckCircle } from 'lucide-react';

type Performer = {
  id: string;
  stage_name: string;
  bio: string | null;
  experience_years: number;
  base_price: number;
  location_city: string | null;
  location_state: string | null;
  average_rating: number;
  total_bookings: number;
  is_verified: boolean;
  categories?: string[];
};

type Props = {
  performer: Performer;
  onBook: () => void;
};

export default function PerformerCard({ performer, onBook }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        {performer.is_verified && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1">
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {performer.stage_name}
            </h3>
            {performer.location_city && (
              <div className="flex items-center space-x-1 text-sm text-slate-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {performer.location_city}, {performer.location_state}
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-bold text-slate-900">{performer.average_rating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-slate-500">{performer.total_bookings} bookings</p>
          </div>
        </div>

        {performer.bio && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-3">{performer.bio}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {performer.categories?.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span>{performer.experience_years}y</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold text-slate-900">₹{performer.base_price}</span>
            </div>
          </div>
          <button
            onClick={onBook}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
