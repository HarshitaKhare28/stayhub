// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Auth API
export const authAPI = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Hotels API (for future backend integration)
export const hotelsAPI = {
  search: async (params: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE_URL}/api/hotels?${queryParams}`);
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${id}`);
    return response.json();
  },
};

// Bookings API (for future backend integration)
export const bookingsAPI = {
  create: async (data: {
    hotelId: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    fullName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getUserBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },
};

export default {
  authAPI,
  hotelsAPI,
  bookingsAPI,
};
