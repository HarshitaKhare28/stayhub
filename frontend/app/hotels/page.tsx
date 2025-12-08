'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  description: string;
}

function HotelsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    // Mock hotel data filtered by location search
    const mockHotels: Hotel[] = [
      {
        id: 1,
        name: 'Grand Plaza Hotel',
        location: location || 'New York',
        price: 250,
        rating: 4.8,
        reviews: 342,
        image: '🏨',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
        description: 'Luxury hotel in the heart of the city with stunning views',
      },
      {
        id: 2,
        name: 'Sunset Beach Resort',
        location: location || 'New York',
        price: 180,
        rating: 4.6,
        reviews: 256,
        image: '🏖️',
        amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant'],
        description: 'Beachfront resort perfect for a relaxing getaway',
      },
      {
        id: 3,
        name: 'City Center Inn',
        location: location || 'New York',
        price: 120,
        rating: 4.3,
        reviews: 189,
        image: '🏢',
        amenities: ['WiFi', 'Parking', 'Breakfast'],
        description: 'Comfortable accommodation in downtown area',
      },
      {
        id: 4,
        name: 'Mountain View Lodge',
        location: location || 'New York',
        price: 200,
        rating: 4.7,
        reviews: 298,
        image: '⛰️',
        amenities: ['WiFi', 'Mountain View', 'Restaurant', 'Fireplace'],
        description: 'Cozy lodge with breathtaking mountain scenery',
      },
      {
        id: 5,
        name: 'Royal Palace Hotel',
        location: location || 'New York',
        price: 350,
        rating: 4.9,
        reviews: 428,
        image: '👑',
        amenities: ['WiFi', 'Spa', 'Pool', 'Fine Dining', 'Concierge'],
        description: 'Five-star luxury with world-class amenities',
      },
      {
        id: 6,
        name: 'Budget Comfort Suites',
        location: location || 'New York',
        price: 80,
        rating: 4.1,
        reviews: 156,
        image: '🛏️',
        amenities: ['WiFi', 'Parking', 'Breakfast'],
        description: 'Affordable and comfortable rooms for budget travelers',
      },
    ];

    setHotels(mockHotels);
    setFilteredHotels(mockHotels);
  }, [location]);

  useEffect(() => {
    const filtered = hotels.filter(
      (hotel) =>
        hotel.price >= priceRange[0] &&
        hotel.price <= priceRange[1] &&
        hotel.rating >= minRating
    );
    setFilteredHotels(filtered);
  }, [priceRange, minRating, hotels]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">
            Hotels in {location || 'All Locations'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {checkIn && <span>Check-in: {checkIn}</span>}
            {checkOut && <span>Check-out: {checkOut}</span>}
            <span>Guests: {guests}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Filters</h3>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    $0 - ${priceRange[1]} per night
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="0">Any</option>
                  <option value="4.0">4.0+</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.8">4.8+</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setPriceRange([0, 1000]);
                  setMinRating(0);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Hotel Listings */}
          <div className="flex-1">
            <div className="mb-4 text-gray-600">
              {filteredHotels.length} hotels found
            </div>

            <div className="space-y-6">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Hotel Image */}
                    <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-7xl">
                      {hotel.image}
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {hotel.name}
                          </h3>
                          <p className="text-gray-600">📍 {hotel.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                            ⭐ {hotel.rating}
                          </div>
                          <p className="text-sm text-gray-600">
                            ({hotel.reviews} reviews)
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{hotel.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-3xl font-bold text-blue-600">
                            ${hotel.price}
                          </p>
                          <p className="text-sm text-gray-600">per night</p>
                        </div>
                        <Link
                          href={`/booking?hotelId=${hotel.id}&hotelName=${encodeURIComponent(hotel.name)}&price=${hotel.price}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
