'use client';

export default function TestStylesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tailwind CSS Test Page</h1>
        
        {/* Test basic colors and spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Card 1</h2>
            <p className="text-gray-600">This is a test card with Tailwind styles.</p>
          </div>
          
          <div className="bg-green-500 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">Card 2</h2>
            <p className="text-green-100">This card has a green background.</p>
          </div>
          
          <div className="bg-red-500 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">Card 3</h2>
            <p className="text-red-100">This card has a red background.</p>
          </div>
        </div>
        
        {/* Test buttons */}
        <div className="space-x-4 mb-8">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Primary Button
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Secondary Button
          </button>
          <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded">
            Outline Button
          </button>
        </div>
        
        {/* Test flexbox */}
        <div className="flex items-center justify-between bg-yellow-100 p-4 rounded-lg mb-8">
          <span className="text-yellow-800 font-medium">Flexbox Test</span>
          <div className="flex space-x-2">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Tag 1</span>
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Tag 2</span>
          </div>
        </div>
        
        {/* Test responsive design */}
        <div className="bg-purple-500 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Responsive Test</h3>
          <p className="text-sm md:text-base lg:text-lg">
            This text should change size on different screen sizes.
          </p>
        </div>
      </div>
    </div>
  );
}