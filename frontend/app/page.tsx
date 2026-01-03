'use client';

import { useState } from 'react';

interface BerthData {
  berthNumber: number;
  position: string;
}

interface ApiResponse {
  success: boolean;
  data: BerthData;
}

interface ApiError {
  error: string;
  message: string;
}

export default function Home() {
  const [berthNumber, setBerthNumber] = useState('');
  const [result, setResult] = useState<BerthData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!berthNumber.trim()) {
      setError('Please enter a berth number');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/getBerthPosition?berthNumber=${encodeURIComponent(berthNumber)}`);

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        setError(errorData.message || 'Failed to fetch berth position');
        return;
      }

      const data: ApiResponse = await response.json();
      setResult(data.data);
    } catch (err) {
      setError('Failed to connect to the API. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Lower':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'Middle':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Upper':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'Side Lower':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'Side Upper':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Berth Position Finder</h1>
        <p className="text-gray-600 mb-8">Find out whether your berth is Lower, Middle, Upper, Side Lower, or Side Upper</p>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="berthNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Berth Number
            </label>
            <div className="flex gap-2">
              <input
                id="berthNumber"
                type="number"
                value={berthNumber}
                onChange={(e) => setBerthNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter berth number (e.g., 1, 25, 48)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800"
                min="1"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Finding...' : 'Find Position'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className={`mt-4 p-6 border rounded-md ${getPositionColor(result.position)}`}>
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Berth Number: {result.berthNumber}</p>
                <p className="text-3xl font-bold">{result.position}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm font-semibold text-gray-800 mb-2">Berth Pattern (repeats every 8 berths):</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Berth 1, 4: <strong>Lower</strong></li>
            <li>• Berth 2, 5: <strong>Middle</strong></li>
            <li>• Berth 3, 6: <strong>Upper</strong></li>
            <li>• Berth 7: <strong>Side Lower</strong></li>
            <li>• Berth 8: <strong>Side Upper</strong></li>
          </ul>
        </div>
      </div>
    </main>
  );
}