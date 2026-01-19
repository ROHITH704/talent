# TalentHub - Talent Discovery and Booking Platform

A comprehensive platform connecting skilled performers with customers looking to hire talent for events.

## Features

### For Performers
- Create detailed performer profiles with stage name, bio, and pricing
- Select multiple talent categories (dancer, singer, magician, etc.)
- Manage incoming booking requests (accept/decline)
- Track total bookings and ratings
- Set location and availability

### For Customers
- Browse and search performers by category, location, and keywords
- Filter by popularity, rating, or price
- View performer profiles with ratings and experience
- Book performers with detailed event information
- Track booking status and history
- Cancel bookings if needed

### Platform Features
- Secure authentication with separate flows for performers and customers
- Row Level Security for data protection
- Advanced search and filtering
- Real-time booking status updates
- Rating and review system
- Location-based discovery

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

The database schema has been automatically created with the following tables:
- profiles (user accounts)
- performer_profiles (performer details)
- categories (talent categories)
- performer_categories (many-to-many)
- demo_videos (performer videos)
- hashtags (searchable tags)
- performer_hashtags (many-to-many)
- bookings (booking records)
- reviews (customer reviews)
- payments (payment tracking)

All tables include Row Level Security policies for secure access control.

### 4. Run the Application

```bash
npm run dev
```

## User Flow

### Performers
1. Sign up as a performer
2. Complete profile setup (stage name, bio, pricing, location, categories)
3. Receive and manage booking requests
4. Accept or decline bookings
5. Build reputation through completed bookings

### Customers
1. Sign up as a customer
2. Browse available performers
3. Use filters to find the right talent
4. View detailed profiles
5. Submit booking requests
6. Track booking status
7. Leave reviews after events

## Technology Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Database + Authentication)
- Lucide React (Icons)

## Database Schema

### Key Tables

**profiles**: Extended user information
- Stores both performer and customer accounts
- Links to auth.users

**performer_profiles**: Detailed performer information
- Stage name, bio, pricing
- Location, experience
- Ratings and booking statistics
- Availability status

**bookings**: Event booking records
- Event details (date, time, location)
- Pricing and duration
- Status tracking (pending, confirmed, completed, cancelled)
- Customer and performer notes

**categories**: Talent categories
- Pre-populated with common categories
- Used for filtering and discovery

## Security

- All tables protected with Row Level Security
- Users can only access their own data
- Performers visible to all authenticated users for discovery
- Secure authentication with Supabase
- Protected API endpoints

## Future Enhancements

- Video upload and management
- In-app messaging between customers and performers
- Payment processing integration
- Calendar integration
- Advanced analytics for performers
- Mobile application
- Social sharing features
