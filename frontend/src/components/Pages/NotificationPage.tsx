// 📂 /components/Pages/NotificationsPage.tsx
export const NotificationsPage = () => (
  <div className="p-6 max-w-2xl mx-auto space-y-4">
    <h2 className="text-2xl font-bold">🔔 Notifications</h2>
    <ul className="space-y-2">
      <li className="bg-yellow-50 p-3 border-l-4 border-yellow-500">Your loan request was accepted by Anjali.</li>
      <li className="bg-blue-50 p-3 border-l-4 border-blue-500">Reminder: EMI due in 2 days.</li>
      <li className="bg-green-50 p-3 border-l-4 border-green-500">You received ₹2,000 repayment from Ravi.</li>
    </ul>
  </div>
);