export default function TailwindTest() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold text-blue-600 text-center">
        🎨 Tailwind CSS Test
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Test Card 1 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-xl font-semibold mb-2">Gradients</h3>
          <p className="text-blue-100">Beautiful gradient backgrounds</p>
        </div>
        
        {/* Test Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-500 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-green-600 mb-2">Animations</h3>
          <p className="text-gray-600">Hover effects and transitions</p>
        </div>
        
        {/* Test Card 3 */}
        <div className="bg-yellow-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">Colors</h3>
          <p className="text-yellow-700">Custom color palette</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Responsive Grid</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-brand-500 text-white p-4 rounded-lg text-center font-semibold">
              {i}
            </div>
          ))}
        </div>
      </div>
      
      <button className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full">
        ✅ Tailwind is Working!
      </button>
    </div>
  );
}
