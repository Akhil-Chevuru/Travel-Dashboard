import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plane, Building, Users, User, Filter, MapPin, Download } from 'lucide-react';

interface BookingStatus {
  status: string;
  count: number;
  percentage: number;
  value: number;
  color: string;
}

interface BookingError {
  error: string;
  count: number;
}

interface CalendarDay {
  day: number;
  flights: number;
  hotels: number;
  guestHouses: number;
  isCurrentMonth?: boolean;
  tripDetails?: {
    flights: Array<{ id: string; bookedBy: string; destination: string; origin: string }>;
    hotels: Array<{ id: string; bookedBy: string; hotelName: string; city: string }>;
    guestHouses: Array<{ id: string; bookedBy: string; guestHouseName: string; city: string }>;
  };
}

function App() {
  const [currentView, setCurrentView] = useState<'myself' | 'team' | 'company'>('myself');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showAllFlightStatuses, setShowAllFlightStatuses] = useState(false);
  const [showAllFlightErrors, setShowAllFlightErrors] = useState(false);
  const [showAllHotelStatuses, setShowAllHotelStatuses] = useState(false);
  const [showAllHotelErrors, setShowAllHotelErrors] = useState(false);
  
  // Separate states for popup
  const [showAllPopupFlights, setShowAllPopupFlights] = useState(false);
  const [showAllPopupHotels, setShowAllPopupHotels] = useState(false);
  const [showAllPopupGuestHouses, setShowAllPopupGuestHouses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Set default date range to last 7 days
  const getDefaultDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };
  
  const [filters, setFilters] = useState({
    startDate: getDefaultDateRange().startDate,
    endDate: getDefaultDateRange().endDate,
    parentCompany: 'all',
    childCompany: 'all'
  });

  // Mock data for flight bookings
  const flightStatuses: BookingStatus[] = [
    { status: 'Confirmed', count: 245, percentage: 78, value: 2450000, color: 'bg-green-500' },
    { status: 'Pending', count: 45, percentage: 14, value: 450000, color: 'bg-yellow-500' },
    { status: 'Cancelled', count: 18, percentage: 6, value: 180000, color: 'bg-red-500' },
    { status: 'Refunded', count: 6, percentage: 2, value: 60000, color: 'bg-blue-500' },
    { status: 'On Hold', count: 12, percentage: 3.8, value: 120000, color: 'bg-orange-500' },
    { status: 'Processing', count: 8, percentage: 2.5, value: 80000, color: 'bg-purple-500' },
    { status: 'Expired', count: 5, percentage: 1.6, value: 50000, color: 'bg-gray-500' },
    { status: 'Waitlisted', count: 15, percentage: 4.7, value: 150000, color: 'bg-indigo-500' },
    { status: 'Partially Confirmed', count: 9, percentage: 2.8, value: 90000, color: 'bg-teal-500' },
    { status: 'Under Review', count: 7, percentage: 2.2, value: 70000, color: 'bg-pink-500' },
    { status: 'Payment Failed', count: 11, percentage: 3.5, value: 110000, color: 'bg-red-400' },
    { status: 'Seat Selection Pending', count: 6, percentage: 1.9, value: 60000, color: 'bg-yellow-400' },
    { status: 'Document Verification', count: 4, percentage: 1.3, value: 40000, color: 'bg-blue-400' },
    { status: 'Upgrade Requested', count: 3, percentage: 0.9, value: 30000, color: 'bg-green-400' },
    { status: 'Change Request', count: 8, percentage: 2.5, value: 80000, color: 'bg-orange-400' }
  ];

  const flightErrors: BookingError[] = [
    { error: 'Payment Gateway Timeout', count: 15 },
    { error: 'Seat Unavailable', count: 12 },
    { error: 'Invalid Booking Details', count: 8 },
    { error: 'System Error', count: 5 },
    { error: 'Credit Card Declined', count: 18 },
    { error: 'Flight Fully Booked', count: 14 },
    { error: 'Invalid Passport Details', count: 10 },
    { error: 'API Connection Failed', count: 9 },
    { error: 'Duplicate Booking Attempt', count: 7 },
    { error: 'Fare Rules Violation', count: 6 },
    { error: 'Booking Time Expired', count: 11 },
    { error: 'Invalid Travel Dates', count: 8 },
    { error: 'Insufficient Balance', count: 13 },
    { error: 'Airline System Down', count: 5 },
    { error: 'Document Upload Failed', count: 4 },
    { error: 'Age Restriction Violation', count: 3 },
    { error: 'Visa Requirements Not Met', count: 6 },
    { error: 'Baggage Policy Violation', count: 2 },
    { error: 'Corporate Policy Breach', count: 9 }
  ];

  // Mock data for hotel bookings
  const hotelStatuses: BookingStatus[] = [
    { status: 'Confirmed', count: 180, percentage: 75, value: 1800000, color: 'bg-green-500' },
    { status: 'Pending', count: 36, percentage: 15, value: 360000, color: 'bg-yellow-500' },
    { status: 'Cancelled', count: 18, percentage: 7.5, value: 180000, color: 'bg-red-500' },
    { status: 'Refunded', count: 6, percentage: 2.5, value: 60000, color: 'bg-blue-500' },
    { status: 'On Hold', count: 12, percentage: 5, value: 120000, color: 'bg-orange-500' },
    { status: 'Processing', count: 8, percentage: 3.3, value: 80000, color: 'bg-purple-500' },
    { status: 'Expired', count: 5, percentage: 2.1, value: 50000, color: 'bg-gray-500' },
    { status: 'Waitlisted', count: 15, percentage: 6.3, value: 150000, color: 'bg-indigo-500' },
    { status: 'Partially Confirmed', count: 9, percentage: 3.8, value: 90000, color: 'bg-teal-500' },
    { status: 'Under Review', count: 7, percentage: 2.9, value: 70000, color: 'bg-pink-500' },
    { status: 'Payment Failed', count: 11, percentage: 4.6, value: 110000, color: 'bg-red-400' },
    { status: 'Room Assignment Pending', count: 6, percentage: 2.5, value: 60000, color: 'bg-yellow-400' },
    { status: 'Document Verification', count: 4, percentage: 1.7, value: 40000, color: 'bg-blue-400' },
    { status: 'Upgrade Requested', count: 3, percentage: 1.3, value: 30000, color: 'bg-green-400' },
    { status: 'Change Request', count: 8, percentage: 3.3, value: 80000, color: 'bg-orange-400' }
  ];

  const hotelErrors: BookingError[] = [
    { error: 'Room Unavailable', count: 18 },
    { error: 'Credit Card Declined', count: 14 },
    { error: 'Booking Conflict', count: 10 },
    { error: 'API Connection Failed', count: 7 },
    { error: 'Payment Gateway Timeout', count: 12 },
    { error: 'Invalid Check-in Date', count: 9 },
    { error: 'Hotel System Down', count: 8 },
    { error: 'Rate Change During Booking', count: 11 },
    { error: 'Guest Limit Exceeded', count: 6 },
    { error: 'Invalid Guest Details', count: 5 },
    { error: 'Booking Time Expired', count: 13 },
    { error: 'Corporate Policy Breach', count: 7 },
    { error: 'Insufficient Balance', count: 10 },
    { error: 'Duplicate Booking Attempt', count: 4 },
    { error: 'Special Request Unavailable', count: 8 },
    { error: 'Age Restriction Violation', count: 3 },
    { error: 'Document Upload Failed', count: 6 },
    { error: 'Loyalty Program Error', count: 5 },
    { error: 'Tax Calculation Failed', count: 2 }
  ];

  // Generate calendar days for current month
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get the first Monday of the calendar view
    const startDay = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0, Sunday = 6
    startDay.setDate(firstDay.getDate() - daysToSubtract);
    
    // Generate 42 days (6 weeks) for complete calendar view
    const calendarDays: CalendarDay[] = [];
    const currentDay = new Date(startDay);
    
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDay.getMonth() === month;
      calendarDays.push({
        day: currentDay.getDate(),
        flights: isCurrentMonth ? Math.floor(Math.random() * 10) : 0,
        hotels: isCurrentMonth ? Math.floor(Math.random() * 8) : 0,
        guestHouses: isCurrentMonth ? Math.floor(Math.random() * 5) : 0,
        isCurrentMonth
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return calendarDays;
  };

  // Generate mock trip details for a day
  const generateTripDetails = (day: number, flights: number, hotels: number, guestHouses: number) => {
    const names = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez', 'Lisa Wang'];
    const destinations = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai'];
    const origins = ['San Francisco', 'Los Angeles', 'Chicago', 'Boston', 'Seattle', 'Miami'];
    const hotelNames = ['Grand Hotel', 'Business Inn', 'City Center', 'Airport Lodge', 'Downtown Suites'];
    const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Hong Kong'];
    const guestHouseNames = ['Cozy Stay', 'Home Away', 'Comfort Lodge', 'Traveler Rest', 'Budget Inn'];
    
    return {
      flights: Array.from({ length: flights }, (_, i) => ({
        id: `FL${day}${String(i + 1).padStart(3, '0')}`,
        bookedBy: names[Math.floor(Math.random() * names.length)],
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        origin: origins[Math.floor(Math.random() * origins.length)]
      })),
      hotels: Array.from({ length: hotels }, (_, i) => ({
        id: `HT${day}${String(i + 1).padStart(3, '0')}`,
        bookedBy: names[Math.floor(Math.random() * names.length)],
        hotelName: hotelNames[Math.floor(Math.random() * hotelNames.length)],
        city: cities[Math.floor(Math.random() * cities.length)]
      })),
      guestHouses: Array.from({ length: guestHouses }, (_, i) => ({
        id: `GH${day}${String(i + 1).padStart(3, '0')}`,
        bookedBy: names[Math.floor(Math.random() * names.length)],
        guestHouseName: guestHouseNames[Math.floor(Math.random() * guestHouseNames.length)],
        city: cities[Math.floor(Math.random() * cities.length)]
      }))
    };
  };

  const calendarDays = generateCalendarDays();

  // Add trip details to calendar days
  const calendarDaysWithDetails = React.useMemo(() => calendarDays.map(day => ({
    ...day,
    tripDetails: day.isCurrentMonth && (day.flights > 0 || day.hotels > 0 || day.guestHouses > 0)
      ? generateTripDetails(day.day, day.flights, day.hotels, day.guestHouses)
      : undefined
  })), [currentMonth]);

  // Prevent background scrolling when popup is open
  React.useEffect(() => {
    if (selectedDay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDay]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
    };
    
    if (startDate && endDate) {
      return `${formatDate(startDate)} to ${formatDate(endDate)}`;
    }
    return formatDate(startDate || endDate);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const downloadCSV = (data: any[], filename: string, type: 'status' | 'error') => {
    let csvContent = '';
    
    if (type === 'status') {
      csvContent = 'Status,Count,Percentage,Value\n';
      data.forEach(item => {
        csvContent += `"${item.status}",${item.count},${item.percentage}%,"${formatCurrency(item.value)}"\n`;
      });
    } else {
      csvContent = 'Error,Count\n';
      data.forEach(item => {
        csvContent += `"${item.error}",${item.count}\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const FilterSection = () => (
    <>
      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-6">
          {/* View Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'myself' as const, label: 'Myself', icon: User },
              { key: 'team' as const, label: 'My Team', icon: Users },
              { key: 'company' as const, label: 'My Company', icon: Building }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentView === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Filter size={18} />
            <span className="font-medium">Filters</span>
          </button>
          
          {/* Current Filter Summary */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {(filters.startDate || filters.endDate) && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                {formatDateRange(filters.startDate, filters.endDate)}
              </span>
            )}
            {filters.childCompany !== 'all' && (
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
                {filters.childCompany === 'division1' ? 'North America Division' :
                 filters.childCompany === 'division2' ? 'Europe Division' :
                 filters.childCompany === 'division3' ? 'Asia Pacific Division' : 
                 filters.childCompany}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vibrant Filter Popup */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Filter size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Advanced Filters</h3>
                      <p className="text-white/80 text-sm">Customize your dashboard view</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Date Range Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Calendar size={20} />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Date Range</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={filters.startDate}
                          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          type="date"
                          value={filters.endDate}
                          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Company Selection Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <Building size={20} />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Company Selection</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent Company</label>
                        <select
                          value={filters.parentCompany}
                          onChange={(e) => setFilters(prev => ({ ...prev, parentCompany: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        >
                          <option value="all">All Group Companies</option>
                          <option value="fastcollab">FastCollab Inc.</option>
                          <option value="subsidiary1">Tech Solutions Ltd.</option>
                          <option value="subsidiary2">Global Services Corp.</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Child Company</label>
                        <select
                          value={filters.childCompany}
                          onChange={(e) => setFilters(prev => ({ ...prev, childCompany: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        >
                          <option value="all">All Child Companies</option>
                          <option value="division1">North America Division</option>
                          <option value="division2">Europe Division</option>
                          <option value="division3">Asia Pacific Division</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setFilters({
                        startDate: getDefaultDateRange().startDate,
                        endDate: getDefaultDateRange().endDate,
                        parentCompany: 'all',
                        childCompany: 'all'
                      });
                    }}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                  >
                    Reset to Last 7 Days
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  const BookingStatusCard = ({ title, statuses, totalBooked, totalFailed, errors, icon: Icon, gradientFrom, gradientTo }: {
    title: string;
    statuses: BookingStatus[];
    totalBooked: number;
    totalFailed: number;
    errors: BookingError[];
    icon: React.ComponentType<{ size?: number; className?: string }>;
    gradientFrom: string;
    gradientTo: string;
  }) => (
    <div 
      id={title === 'Flight Bookings' ? 'flight-card' : title === 'Hotel Bookings' ? 'hotel-card' : 'card'}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon size={24} />
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalBooked}</div>
              <div className="text-sm opacity-90">Booked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{statuses.find(s => s.status === 'Cancelled')?.count || 0}</div>
              <div className="text-sm opacity-90">Cancelled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalFailed}</div>
              <div className="text-sm opacity-90">Failed</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Booking Status</h4>
              {title === 'Flight Bookings' && (
                <button
                  onClick={() => downloadCSV(statuses, 'flight-booking-status.csv', 'status')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Download size={14} />
                </button>
              )}
              {title === 'Hotel Bookings' && (
                <button
                  onClick={() => downloadCSV(statuses, 'hotel-booking-status.csv', 'status')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Download size={14} />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(title === 'Flight Bookings' ? 
                (showAllFlightStatuses ? statuses : statuses.slice(0, 5)) :
                (showAllHotelStatuses ? statuses : statuses.slice(0, 5))
              ).map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                    <span className="font-medium text-gray-700">{status.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{status.count}</div>
                    <div className="text-sm text-gray-500">{status.percentage}% • {formatCurrency(status.value)}</div>
                  </div>
                </div>
              ))}
              {statuses.length > 5 && (
                <button
                  onClick={() => {
                    if (title === 'Flight Bookings') {
                      setShowAllFlightStatuses(!showAllFlightStatuses);
                      // Scroll to flight card after state update
                      setTimeout(() => {
                        document.getElementById('flight-card')?.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start' 
                        });
                      }, 100);
                    } else {
                      setShowAllHotelStatuses(!showAllHotelStatuses);
                      // Scroll to hotel card after state update
                      setTimeout(() => {
                        document.getElementById('hotel-card')?.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start' 
                        });
                      }, 100);
                    }
                  }}
                  className="w-full p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                  {(title === 'Flight Bookings' ? showAllFlightStatuses : showAllHotelStatuses) 
                    ? 'Show Less' 
                    : `Load More (${statuses.length - 5} more)`}
                </button>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Booking Errors</h4>
              {title === 'Flight Bookings' && (
                <button
                  onClick={() => downloadCSV(errors, 'flight-booking-errors.csv', 'error')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Download size={14} />
                </button>
              )}
              {title === 'Hotel Bookings' && (
                <button
                  onClick={() => downloadCSV(errors, 'hotel-booking-errors.csv', 'error')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Download size={14} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {(title === 'Flight Bookings' ? 
                (showAllFlightErrors ? errors : errors.slice(0, 5)) :
                (showAllHotelErrors ? errors : errors.slice(0, 5))
              ).map((error, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-700 text-sm">{error.error}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {error.count}
                  </span>
                </div>
              ))}
              {errors.length > 5 && (
                <button
                  onClick={() => {
                    if (title === 'Flight Bookings') {
                      setShowAllFlightErrors(!showAllFlightErrors);
                      // Scroll to flight card after state update
                      setTimeout(() => {
                        document.getElementById('flight-card')?.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start' 
                        });
                      }, 100);
                    } else {
                      setShowAllHotelErrors(!showAllHotelErrors);
                      // Scroll to hotel card after state update
                      setTimeout(() => {
                        document.getElementById('hotel-card')?.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start' 
                        });
                      }, 100);
                    }
                  }}
                  className="w-full p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                  {(title === 'Flight Bookings' ? showAllFlightErrors : showAllHotelErrors) 
                    ? 'Show Less' 
                    : `Load More (${errors.length - 5} more)`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TravelCalendar = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar size={24} />
            <h3 className="text-xl font-bold">Travel Calendar</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-lg font-medium px-4">{getMonthName(currentMonth)}</span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {calendarDaysWithDetails.map((day, index) => (
            <div
              key={index}
              onClick={() => {
                if (day.isCurrentMonth && day.tripDetails) {
                  setSelectedDay(day);
                  // Reset popup states when opening
                  setShowAllPopupFlights(false);
                  setShowAllPopupHotels(false);
                  setShowAllPopupGuestHouses(false);
                  setSearchQuery('');
                }
              }}
              className={`p-3 border rounded-lg transition-colors cursor-pointer group ${
                day.isCurrentMonth 
                  ? day.tripDetails 
                    ? 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50' 
                    : 'border-gray-200 bg-white cursor-default'
                  : 'border-gray-100 bg-gray-50 text-gray-400 cursor-default'
              }`}
            >
              <div className={`text-lg font-semibold mb-2 ${
                day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {day.day}
              </div>
              <div className="space-y-1">
                {day.flights > 0 && day.isCurrentMonth && (
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-600">{day.flights} flights</span>
                  </div>
                )}
                {day.hotels > 0 && day.isCurrentMonth && (
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600">{day.hotels} hotels</span>
                  </div>
                )}
                {day.guestHouses > 0 && day.isCurrentMonth && (
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-600">{day.guestHouses} guest houses</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Flight Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Hotel Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Guest House Bookings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Day Details Popup */}
      {selectedDay && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={() => {
              setSelectedDay(null);
              setShowAllPopupFlights(false);
              setShowAllPopupHotels(false);
              setShowAllPopupGuestHouses(false);
              setSearchQuery('');
            }}
          />
          
          {/* Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Travel Details</h3>
                      <p className="text-white/80 text-sm">
                        {getMonthName(currentMonth).split(' ')[0]} {selectedDay.day}, {getMonthName(currentMonth).split(' ')[1]}
                      </p>
                    </div>
                  </div>
                  
                  {/* Search Bar in Header */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search trips..."
                        value={searchQuery}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSearchQuery(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        autoFocus
                        className="w-64 pl-9 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 text-white placeholder-white/60 text-sm"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedDay(null);
                        setShowAllPopupFlights(false);
                        setShowAllPopupHotels(false);
                        setShowAllPopupGuestHouses(false);
                        setSearchQuery('');
                      }}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
                  {/* Flight Bookings */}
                  {selectedDay.tripDetails?.flights && selectedDay.tripDetails.flights.length > 0 && (
                    (() => {
                      const filteredFlights = selectedDay.tripDetails.flights.filter(flight =>
                        flight.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        flight.bookedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        flight.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        flight.origin.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      
                      if (filteredFlights.length === 0 && searchQuery) return null;
                      
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                              <Plane size={20} />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Flight Bookings
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {(showAllPopupFlights ? filteredFlights : filteredFlights.slice(0, 5)).map((flight, index) => (
                              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="font-medium text-blue-800 mb-1">Trip ID: {flight.id}</div>
                                <div className="text-sm text-blue-600 mb-1">Origin: {flight.origin}</div>
                                <div className="text-sm text-blue-600 mb-1">Destination: {flight.destination}</div>
                                <div className="text-sm text-gray-600">Booked by: {flight.bookedBy}</div>
                              </div>
                            ))}
                            {filteredFlights.length > 5 && (
                              <button
                                onClick={() => setShowAllPopupFlights(!showAllPopupFlights)}
                                className="w-full p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                              >
                                {showAllPopupFlights 
                                  ? 'Show Less' 
                                  : `Load More (${filteredFlights.length - 5} more)`}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  )}

                  {/* Hotel Bookings */}
                  {selectedDay.tripDetails?.hotels && selectedDay.tripDetails.hotels.length > 0 && (
                    (() => {
                      const filteredHotels = selectedDay.tripDetails.hotels.filter(hotel =>
                        hotel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        hotel.bookedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      
                      if (filteredHotels.length === 0 && searchQuery) return null;
                      
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                              <MapPin size={20} />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Hotel Bookings
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {(showAllPopupHotels ? filteredHotels : filteredHotels.slice(0, 5)).map((hotel, index) => (
                              <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="font-medium text-green-800 mb-1">Trip ID: {hotel.id}</div>
                                <div className="text-sm text-green-600 mb-1">Hotel: {hotel.hotelName}</div>
                                <div className="text-sm text-green-600 mb-1">City: {hotel.city}</div>
                                <div className="text-sm text-gray-600">Booked by: {hotel.bookedBy}</div>
                              </div>
                            ))}
                            {filteredHotels.length > 5 && (
                              <button
                                onClick={() => setShowAllPopupHotels(!showAllPopupHotels)}
                                className="w-full p-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                              >
                                {showAllPopupHotels 
                                  ? 'Show Less' 
                                  : `Load More (${filteredHotels.length - 5} more)`}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  )}

                  {/* Guest House Bookings */}
                  {selectedDay.tripDetails?.guestHouses && selectedDay.tripDetails.guestHouses.length > 0 && (
                    (() => {
                      const filteredGuestHouses = selectedDay.tripDetails.guestHouses.filter(guestHouse =>
                        guestHouse.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        guestHouse.bookedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        guestHouse.guestHouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        guestHouse.city.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      
                      if (filteredGuestHouses.length === 0 && searchQuery) return null;
                      
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                              <Building size={20} />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Guest House Bookings
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {(showAllPopupGuestHouses ? filteredGuestHouses : filteredGuestHouses.slice(0, 5)).map((guestHouse, index) => (
                              <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="font-medium text-purple-800 mb-1">Trip ID: {guestHouse.id}</div>
                                <div className="text-sm text-purple-600 mb-1">Guest House: {guestHouse.guestHouseName}</div>
                                <div className="text-sm text-purple-600 mb-1">City: {guestHouse.city}</div>
                                <div className="text-sm text-gray-600">Booked by: {guestHouse.bookedBy}</div>
                              </div>
                            ))}
                            {filteredGuestHouses.length > 5 && (
                              <button
                                onClick={() => setShowAllPopupGuestHouses(!showAllPopupGuestHouses)}
                                className="w-full p-3 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
                              >
                                {showAllPopupGuestHouses 
                                  ? 'Show Less' 
                                  : `Load More (${filteredGuestHouses.length - 5} more)`}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
                
                {/* No Results Message */}
                {searchQuery && 
                 (!selectedDay.tripDetails?.flights?.some(f => 
                   f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   f.bookedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   f.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   f.origin.toLowerCase().includes(searchQuery.toLowerCase())
                 )) &&
                 (!selectedDay.tripDetails?.hotels?.some(h => 
                   h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   h.bookedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   h.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   h.city.toLowerCase().includes(searchQuery.toLowerCase())
                 )) &&
                 (!selectedDay.tripDetails?.guestHouses?.some(g => 
                   g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   g.bookedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   g.guestHouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   g.city.toLowerCase().includes(searchQuery.toLowerCase())
                 )) && (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-lg mb-2">No results found</div>
                    <div className="text-gray-400 text-sm">Try searching with different keywords</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8" style={{ maxWidth: '80%', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Travel Dashboard</h1>
            <p className="text-gray-600">FastCollab Travel Management System</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterSection />
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Flight Bookings */}
          <BookingStatusCard
            title="Flight Bookings"
            statuses={flightStatuses}
            totalBooked={245}
            totalFailed={69}
            errors={flightErrors}
            icon={Plane}
            gradientFrom="from-blue-500"
            gradientTo="to-cyan-500"
          />

          {/* Hotel Bookings */}
          <BookingStatusCard
            title="Hotel Bookings"
            statuses={hotelStatuses}
            totalBooked={180}
            totalFailed={60}
            errors={hotelErrors}
            icon={MapPin}
            gradientFrom="from-green-500"
            gradientTo="to-teal-500"
          />

          {/* Travel Calendar */}
          <TravelCalendar />
        </div>
      </div>
    </div>
  );
}

export default App;

var _c;$RefreshReg$(_c, "App");