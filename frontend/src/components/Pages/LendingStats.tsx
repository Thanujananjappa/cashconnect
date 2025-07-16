// 📂 /components/Pages/LendingStats.tsx
export const LendingStats = () => (
  <div className="p-6 max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold">📊 Lending Stats</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="bg-white border rounded-lg p-4 shadow">
        <p className="text-gray-600">Total Lent</p>
        <h3 className="text-xl font-bold text-blue-700">₹35,000</h3>
      </div>
      <div className="bg-white border rounded-lg p-4 shadow">
        <p className="text-gray-600">Avg ROI</p>
        <h3 className="text-xl font-bold text-emerald-700">12%</h3>
      </div>
      <div className="bg-white border rounded-lg p-4 shadow">
        <p className="text-gray-600">Active Loans</p>
        <h3 className="text-xl font-bold text-yellow-600">3</h3>
      </div>
    </div>
  </div>
);