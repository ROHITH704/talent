import { useEffect, useState } from 'react';
import { supabase, Category } from '../lib/supabase';
import { Search, Filter, MapPin, TrendingUp, Tag } from 'lucide-react';
import PerformerCard from './PerformerCard';
import BookingModal from './BookingModal';

type PerformerWithCategories = {
  id: string;
  user_id: string;
  stage_name: string;
  bio: string | null;
  experience_years: number;
  base_price: number;
  location_city: string | null;
  location_state: string | null;
  video_reel_url: string | null;
  popularity_score: number;
  total_bookings: number;
  average_rating: number;
  is_verified: boolean;
  is_available: boolean;
  categories?: string[];
};

type Props = {
  onBookingCreated: () => void;
};

export default function PerformerBrowser({ onBookingCreated }: Props) {
  const [performers, setPerformers] = useState<PerformerWithCategories[]>([]);
  const [filteredPerformers, setFilteredPerformers] = useState<PerformerWithCategories[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price'>('popularity');
  const [selectedPerformer, setSelectedPerformer] = useState<PerformerWithCategories | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchPerformers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [performers, searchQuery, selectedCategory, selectedCity, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchPerformers = async () => {
    try {
      const { data: performersData, error } = await supabase
        .from('performer_profiles')
        .select('*')
        .eq('is_available', true);

      if (error) throw error;

      const performersWithCategories = await Promise.all(
        (performersData || []).map(async (performer) => {
          const { data: categoryData } = await supabase
            .from('performer_categories')
            .select('categories(name)')
            .eq('performer_id', performer.id);

          return {
            ...performer,
            categories: categoryData?.map((pc: any) => pc.categories.name) || [],
          };
        })
      );

      setPerformers(performersWithCategories);
    } catch (error) {
      console.error('Error fetching performers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...performers];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.stage_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      const categoryName = categories.find((c) => c.id === selectedCategory)?.name;
      filtered = filtered.filter((p) => p.categories?.includes(categoryName || ''));
    }

    if (selectedCity) {
      filtered = filtered.filter((p) =>
        p.location_city?.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity_score - a.popularity_score;
        case 'rating':
          return b.average_rating - a.average_rating;
        case 'price':
          return a.base_price - b.base_price;
        default:
          return 0;
      }
    });

    setFilteredPerformers(filtered);
  };

  const handleBookingComplete = () => {
    setSelectedPerformer(null);
    onBookingCreated();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading performers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-xl p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, skills, or description..."
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter city..."
                className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-slate-600">
          <span className="font-semibold text-slate-900">{filteredPerformers.length}</span>{' '}
          {filteredPerformers.length === 1 ? 'performer' : 'performers'} found
        </p>
      </div>

      {filteredPerformers.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>No performers found matching your criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPerformers.map((performer) => (
            <PerformerCard
              key={performer.id}
              performer={performer}
              onBook={() => setSelectedPerformer(performer)}
            />
          ))}
        </div>
      )}

      {selectedPerformer && (
        <BookingModal
          performer={selectedPerformer}
          onClose={() => setSelectedPerformer(null)}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
}
