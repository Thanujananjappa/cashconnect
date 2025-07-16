// 📂 /components/Pages/SettingsPage.tsx
export const SettingsPage = () => (
  <div className="p-6 max-w-xl mx-auto space-y-6">
    <h2 className="text-2xl font-bold">⚙️ Settings</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Enable Notifications</span>
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Dark Mode</span>
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </div>
      <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">Save Settings</button>
    </div>
  </div>
);