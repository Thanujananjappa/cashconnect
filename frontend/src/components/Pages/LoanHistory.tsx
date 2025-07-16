
// 📂 /components/Pages/LoanHistory.tsx
export const LoanHistory = () => (
  <div className="p-6 max-w-5xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">📜 Loan History</h2>
    <table className="w-full table-auto border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Amount</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Term</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border">2025-07-10</td>
          <td className="p-2 border">₹5000</td>
          <td className="p-2 border text-green-600">Repaid</td>
          <td className="p-2 border">6 months</td>
        </tr>
        <tr>
          <td className="p-2 border">2025-05-20</td>
          <td className="p-2 border">₹8000</td>
          <td className="p-2 border text-yellow-600">Ongoing</td>
          <td className="p-2 border">12 months</td>
        </tr>
      </tbody>
    </table>
  </div>
);