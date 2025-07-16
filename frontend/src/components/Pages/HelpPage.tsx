// 📂 /components/Pages/HelpPage.tsx
export const HelpPage = () => (
  <div className="p-6 max-w-2xl mx-auto space-y-4">
    <h2 className="text-2xl font-bold">❓ Help & Support</h2>
    <div className="space-y-2">
      <h3 className="font-semibold">Frequently Asked Questions</h3>
      <ul className="list-disc list-inside text-gray-700">
        <li>How do I request a loan?</li>
        <li>How are interest rates calculated?</li>
        <li>Can I change my repayment schedule?</li>
      </ul>
    </div>
    <div className="mt-6">
      <h3 className="font-semibold">Contact Support</h3>
      <p>Email: support@lendconnect.com</p>
    </div>
  </div>
);