'use client';

import { useEffect, useState } from 'react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }
    setUser(JSON.parse(storedUser));

    // Load bookings from localStorage (in real app, fetch from backend)
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet. Start exploring our hotels!
            </p>
            <a
              href="/hotels"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Browse Hotels
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {booking.hotelName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                      <p>👤 Guest: {booking.fullName}</p>
                      <p>📧 Email: {booking.email}</p>
                      <p>📅 Check-in: {booking.checkIn}</p>
                      <p>📅 Check-out: {booking.checkOut}</p>
                      <p>🌙 Nights: {booking.nights}</p>
                      <p>🏠 Rooms: {booking.rooms}</p>
                      <p>👥 Adults: {booking.adults}</p>
                      <p>👶 Children: {booking.children}</p>
                      {booking.mealPreference && booking.mealPreference !== 'none' && (
                        <p>🍽️ Meals: {booking.mealPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</p>
                      )}
                    </div>
                    {booking.specialRequests && (
                      <p className="mt-2 text-gray-600">
                        💬 Special Requests: {booking.specialRequests}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      ₹{booking.totalPrice.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600">Total Price</p>
                    <span className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
