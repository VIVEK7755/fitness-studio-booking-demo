import React, { useState, useEffect } from 'react';
import './index.css';

// Types
interface FitnessClass {
  id: number;
  name: string;
  start_datetime_IST: string; // New field for IST
  instructor: string;
  available_slots: number;
}

interface BookingFormData {
  client_name: string;
  client_email: string;
}

interface Booking {
  id: number;
  class_name: string;
  client_name: string;
  client_email: string;
  start_datetime_IST: string;
  instructor: string;
}

const API_BASE = 'http://localhost:8000';

const App: React.FC = () => {
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<FitnessClass | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    client_name: '',
    client_email: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookings, setShowBookings] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [filterEmail, setFilterEmail] = useState('');


  // API Tester
  const [showApiTester, setShowApiTester] = useState(false);
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiEndpoint, setApiEndpoint] = useState('/classes');
  const [apiRequestBody, setApiRequestBody] = useState(
    `{\n  "class_id": 1,\n  "client_name": "Test User",\n  "client_email": "test@example.com"\n}`
  );
  const [apiResponse, setApiResponse] = useState('');
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setErrorMessage('Failed to load classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      setBookingsError('');
      const encodedEmail = encodeURIComponent(filterEmail.trim());
      const response = await fetch(`${API_BASE}/bookings?email=${encodedEmail}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
      setBookingsError('Could not load bookings.');
    } finally {
      setBookingsLoading(false);
    }
  };


  const handleBookClass = (classItem: FitnessClass) => {
    setSelectedClass(classItem);
    setBookingForm({ client_name: '', client_email: '' });
    setBookingStatus('idle');
    setErrorMessage('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    setBookingStatus('loading');
    try {
      const response = await fetch(`${API_BASE}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class_id: selectedClass.id,
          client_name: bookingForm.client_name,
          client_email: bookingForm.client_email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Booking failed');
      }

      setBookingStatus('success');
      await fetchClasses();

      setTimeout(() => {
        setSelectedClass(null);
        setBookingStatus('idle');
      }, 2000);

    } catch (error) {
      setBookingStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Booking failed');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-brand-blue text-xl">Loading classes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-blue text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">💪 Fitness Studio</h1>
          <p className="text-gray-200 mt-2">Book your fitness classes</p>
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setShowBookings(true)}
              className="bg-white text-brand-blue font-medium py-1 px-4 rounded hover:bg-gray-100"
            >
              View Bookings
            </button>
            <button
              onClick={() => setShowApiTester(true)}
              className="bg-white text-brand-blue font-medium py-1 px-4 rounded hover:bg-gray-100"
            >
              Test API
            </button>
          </div>
        </div>
      </header>

      {/* Class List */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-brand-blue mb-2">{classItem.name}</h3>
              <p className="text-gray-600 mb-2">📅 {formatDateTime(classItem.start_datetime_IST)}</p>
              <p className="text-gray-600 mb-2">👤 Instructor: {classItem.instructor}</p>
              <p className="text-gray-600 mb-4">
                🎯 {classItem.available_slots} slots available
              </p>

              <button
                onClick={() => handleBookClass(classItem)}
                disabled={classItem.available_slots === 0}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  classItem.available_slots === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-brand-gold hover:bg-yellow-400 text-brand-blue'
                }`}
              >
                {classItem.available_slots === 0 ? 'Fully Booked' : 'Book Class'}
              </button>
            </div>
          ))}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No classes available at the moment.</p>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-brand-blue mb-4">
              Book {selectedClass.name}
            </h2>
            <p className="text-gray-600 mb-4">
              📅 {formatDateTime(selectedClass.start_datetime_IST)}
            </p>

            {bookingStatus === 'success' ? (
              <div className="text-center py-4">
                <div className="text-green-600 text-2xl mb-2">✅</div>
                <p className="text-green-600 font-medium">Booking confirmed!</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.client_name}
                    onChange={(e) => setBookingForm({ ...bookingForm, client_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.client_email}
                    onChange={(e) => setBookingForm({ ...bookingForm, client_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="your.email@example.com"
                  />
                </div>

                {bookingStatus === 'error' && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
                    {errorMessage}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedClass(null)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={bookingStatus === 'loading'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingStatus === 'loading'}
                    className="flex-1 py-2 px-4 bg-brand-gold hover:bg-yellow-400 text-brand-blue rounded-md font-medium disabled:opacity-50"
                  >
                    {bookingStatus === 'loading' ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bookings Viewer */}
      {showBookings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-blue">📋 Bookings</h2>
              <button
                onClick={() => {
                  setShowBookings(false);
                  setBookings([]);
                  setFilterEmail('');
                  setBookingsError('');
                }}
                className="text-gray-500 hover:text-black"
              >
                ✖
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter Email to Search Bookings</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 border px-3 py-2 rounded"
                />
                <button
                  onClick={fetchBookings}
                  className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setFilterEmail('');
                    fetch(`${API_BASE}/bookings`)
                      .then((res) => res.json())
                      .then((data) => setBookings(data))
                      .catch(() => setBookingsError('Could not fetch all bookings.'));
                  }}
                  className="bg-brand-gold text-brand-blue px-4 py-2 rounded hover:bg-yellow-400"
                >
                  Fetch All
                </button>
              </div>
            </div>

            {bookingsLoading ? (
              <p className="text-brand-blue">Loading bookings...</p>
            ) : bookingsError ? (
              <p className="text-red-600">{bookingsError}</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-600">No bookings found for this email.</p>
            ) : (
              <ul className="space-y-4">
                {bookings.map((b) => (
                  <li key={b.id} className="border border-gray-200 rounded p-4">
                    <p className="font-medium text-brand-blue">{b.class_name}</p>
                    <p className="text-sm text-gray-600">📅 {formatDateTime(b.start_datetime_IST)}</p>
                    <p className="text-sm text-gray-600">👤 {b.client_name}</p>
                    <p className="text-sm text-gray-600">✉️ {b.client_email}</p>
                    <p className="text-sm text-gray-600">👨‍🏫 {b.instructor}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* API Tester Modal */}
      {showApiTester && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-blue">🧪 API Tester</h2>
              <button onClick={() => setShowApiTester(false)} className="text-gray-500 hover:text-black">
                ✖
              </button>
            </div>

            <div className="mb-4 flex gap-4 items-center">
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value as 'GET' | 'POST')}
                className="border px-3 py-2 rounded"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>

              <input
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                placeholder="/classes or /book"
              />

              <button
                onClick={async () => {
                  setApiLoading(true);
                  setApiResponse('');
                  try {
                    const response = await fetch(`${API_BASE}${apiEndpoint}`, {
                      method: apiMethod,
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      ...(apiMethod === 'POST' && { body: apiRequestBody }),
                    });
                    const text = await response.text();
                    setApiResponse(text);
                  } catch (err) {
                    setApiResponse('Error: ' + String(err));
                  } finally {
                    setApiLoading(false);
                  }
                }}
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>

            {apiMethod === 'POST' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Body (JSON)</label>
                <textarea
                  rows={6}
                  className="w-full border px-3 py-2 rounded font-mono text-sm"
                  value={apiRequestBody}
                  onChange={(e) => setApiRequestBody(e.target.value)}
                />
              </div>
            )}

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Response</label>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-[500px] whitespace-pre-wrap">
                {apiLoading
                  ? 'Loading...'
                  : Array.isArray(apiResponse)
                    ? apiResponse.map((item) => JSON.stringify(item)).join('\n')
                    : typeof apiResponse === 'object'
                      ? JSON.stringify(apiResponse, null, 2)
                      : apiResponse}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
