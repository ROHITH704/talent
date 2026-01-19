import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase, PerformerProfile, Category } from '../lib/supabase';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

type Props = {
  existingProfile: PerformerProfile | null;
  onProfileUpdate: () => void;
};

export default function PerformerProfileSetup({ existingProfile, onProfileUpdate }: Props) {
  const { profile } = useAuth();
  const [stageName, setStageName] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [locationCity, setLocationCity] = useState('');
  const [locationState, setLocationState] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    fetchCategories();
    if (existingProfile) {
      setStageName(existingProfile.stage_name);
      setBio(existingProfile.bio || '');
      setExperienceYears(existingProfile.experience_years);
      setBasePrice(existingProfile.base_price);
      setLocationCity(existingProfile.location_city || '');
      setLocationState(existingProfile.location_state || '');
      fetchSelectedCategories(existingProfile.id);
    }
  }, [existingProfile]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchSelectedCategories = async (performerId: string) => {
    const { data } = await supabase
      .from('performer_categories')
      .select('category_id')
      .eq('performer_id', performerId);
    if (data) setSelectedCategories(data.map(pc => pc.category_id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (existingProfile) {
        const { error } = await supabase
          .from('performer_profiles')
          .update({
            stage_name: stageName,
            bio,
            experience_years: experienceYears,
            base_price: basePrice,
            location_city: locationCity,
            location_state: locationState,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProfile.id);

        if (error) throw error;

        await supabase
          .from('performer_categories')
          .delete()
          .eq('performer_id', existingProfile.id);

        if (selectedCategories.length > 0) {
          await supabase
            .from('performer_categories')
            .insert(
              selectedCategories.map(catId => ({
                performer_id: existingProfile.id,
                category_id: catId,
              }))
            );
        }
      } else {
        const { data: newProfile, error } = await supabase
          .from('performer_profiles')
          .insert({
            user_id: profile!.id,
            stage_name: stageName,
            bio,
            experience_years: experienceYears,
            base_price: basePrice,
            location_city: locationCity,
            location_state: locationState,
          })
          .select()
          .single();

        if (error) throw error;

        if (selectedCategories.length > 0 && newProfile) {
          await supabase
            .from('performer_categories')
            .insert(
              selectedCategories.map(catId => ({
                performer_id: newProfile.id,
                category_id: catId,
              }))
            );
        }
      }

      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      onProfileUpdate();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg flex items-start space-x-3 ${
            message.type === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-green-50 border border-green-200'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${message.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
            {message.text}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Stage Name / Professional Name
        </label>
        <input
          type="text"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Bio / Description
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Tell customers about your skills and experience..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            value={experienceYears}
            onChange={(e) => setExperienceYears(Number(e.target.value))}
            min="0"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Base Price (₹)
          </label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            min="0"
            step="100"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={locationState}
            onChange={(e) => setLocationState(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Categories / Specializations
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedCategories.includes(category.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <Save className="w-5 h-5" />
        <span>{loading ? 'Saving...' : 'Save Profile'}</span>
      </button>
    </form>
  );
}
