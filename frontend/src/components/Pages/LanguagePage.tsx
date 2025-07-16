// 📂 /components/Pages/LanguagePage.tsx
export const LanguagePage = () => (
  <div className="p-6 max-w-md mx-auto space-y-4">
    <h2 className="text-2xl font-bold">🌐 Language Preferences</h2>
    <select className="w-full p-2 border rounded">
      <option>English</option>
      <option>हिन्दी</option>
      <option>ಕನ್ನಡ</option>
      <option>தமிழ்</option>
      <option>తెలుగు</option>
      <option>മലയാളം</option>
    </select>
    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
  </div>
);