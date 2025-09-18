import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Plane, 
  Hotel, 
  Camera, 
  Star,
  Clock,
  Navigation,
  Heart,
  Share2
} from 'lucide-react';

interface Trip {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  rating?: number;
}

const mockTrips: Trip[] = [
  {
    id: '1',
    destination: 'Santorini',
    country: 'Greece',
    startDate: '2024-06-15',
    endDate: '2024-06-22',
    travelers: 2,
    budget: 3500,
    image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'upcoming'
  },
  {
    id: '2',
    destination: 'Tokyo',
    country: 'Japan',
    startDate: '2024-04-10',
    endDate: '2024-04-20',
    travelers: 1,
    budget: 4200,
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'completed',
    rating: 5
  },
  {
    id: '3',
    destination: 'Bali',
    country: 'Indonesia',
    startDate: '2024-03-01',
    endDate: '2024-03-10',
    travelers: 4,
    budget: 2800,
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'ongoing'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trips' | 'planning'>('dashboard');
  const [trips] = useState<Trip[]>(mockTrips);

  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');
  const ongoingTrips = trips.filter(trip => trip.status === 'ongoing');
  const completedTrips = trips.filter(trip => trip.status === 'completed');

  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
  const averageRating = completedTrips.reduce((sum, trip) => sum + (trip.rating || 0), 0) / completedTrips.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'text-blue-600' }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gray-50`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const TripCard = ({ trip }: { trip: Trip }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={trip.image} 
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 left-4 flex space-x-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{trip.destination}</h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {trip.country}
            </p>
          </div>
          {trip.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700 ml-1">{trip.rating}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            ${trip.budget.toLocaleString()} budget
          </div>
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FastCollab Travel</h1>
                  <p className="text-sm text-gray-500">Your journey starts here</p>
                </div>
              </div>
            </div>
            
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Navigation },
                { id: 'trips', label: 'My Trips', icon: MapPin },
                { id: 'planning', label: 'Planning', icon: Calendar }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, Explorer!</h2>
                  <p className="text-blue-100 text-lg">Ready for your next adventure?</p>
                </div>
                <div className="hidden md:block">
                  <Camera className="w-16 h-16 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={MapPin}
                title="Total Trips"
                value={trips.length}
                subtitle="destinations visited"
                color="text-blue-600"
              />
              <StatCard
                icon={DollarSign}
                title="Total Budget"
                value={`$${totalBudget.toLocaleString()}`}
                subtitle="across all trips"
                color="text-green-600"
              />
              <StatCard
                icon={Clock}
                title="Upcoming"
                value={upcomingTrips.length}
                subtitle="trips planned"
                color="text-orange-600"
              />
              <StatCard
                icon={Star}
                title="Average Rating"
                value={averageRating ? averageRating.toFixed(1) : 'N/A'}
                subtitle="trip satisfaction"
                color="text-yellow-600"
              />
            </div>

            {/* Current Trip */}
            {ongoingTrips.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Current Trip</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {ongoingTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Trips */}
            {upcomingTrips.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Upcoming Adventures</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {upcomingTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Trips</h2>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2">
                <Plane className="w-4 h-4" />
                <span>Plan New Trip</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {trips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'planning' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Trip Planning</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Start Planning Your Next Adventure</h3>
                <p className="text-gray-600 mb-6">Create detailed itineraries, set budgets, and collaborate with fellow travelers.</p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto">
                  <Plane className="w-5 h-5" />
                  <span>Create New Trip</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <Hotel className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Find Accommodations</h4>
                <p className="text-sm text-gray-600">Discover the perfect places to stay for your journey.</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Explore Destinations</h4>
                <p className="text-sm text-gray-600">Get inspired by amazing destinations around the world.</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Collaborate</h4>
                <p className="text-sm text-gray-600">Plan together with friends and family in real-time.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;