
// 📂 /components/Pages/ProfilePage.tsx
export const ProfilePage = () => (
  <div className="p-6 max-w-2xl mx-auto space-y-6">
    <h2 className="text-2xl font-bold">👤 My Profile</h2>
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input type="text" placeholder="John Doe" className="mt-1 w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" placeholder="john@example.com" className="mt-1 w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input type="tel" placeholder="+91 9876543210" className="mt-1 w-full border p-2 rounded" />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Profile</button>
    </form>
  </div>
);