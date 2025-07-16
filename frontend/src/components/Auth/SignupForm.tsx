import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    userType: 'borrower' as 'borrower' | 'lender' | 'both',
    city: '',
    state: '',
    latitude: 0,
    longitude: 0,
    amount: '',
    term: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const { signUp, loading } = useAuth();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      (error) => {
        console.warn("Geolocation error:", error);
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('⚠️ Passwords do not match');
      return;
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      alert('⚠️ Please enter a valid loan amount');
      return;
    }

    if (!formData.term || isNaN(Number(formData.term)) || Number(formData.term) <= 0) {
      alert('⚠️ Please enter a valid loan term');
      return;
    }

    try {
      await signUp(formData.email.trim(), formData.password, {
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        user_type: formData.userType,
        amount: Number(formData.amount),
        term: Number(formData.term),
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude,
          city: formData.city.trim(),
          state: formData.state.trim(),
        },
      });

      alert('✅ Account created successfully! Please log in.');
      onSwitchToLogin();
    } catch (error) {
      alert('❌ Signup failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join LendConnect</h1>
          <p className="text-gray-600">Create your account to start lending or borrowing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" icon={<User />} value={formData.fullName} onChange={(val) => setFormData({ ...formData, fullName: val })} type="text" placeholder="Enter your full name" />
          <InputField label="Email Address" icon={<Mail />} value={formData.email} onChange={(val) => setFormData({ ...formData, email: val })} type="email" placeholder="Enter your email" />
          <InputField label="Phone Number" icon={<Phone />} value={formData.phone} onChange={(val) => setFormData({ ...formData, phone: val })} type="tel" placeholder="Enter your phone number" />

          <div className="grid grid-cols-2 gap-4">
            <InputBox label="City" value={formData.city} onChange={(val) => setFormData({ ...formData, city: val })} placeholder="City" />
            <InputBox label="State" value={formData.state} onChange={(val) => setFormData({ ...formData, state: val })} placeholder="State" />
          </div>

          <InputBox label="Amount" type="number" value={formData.amount} onChange={(val) => setFormData({ ...formData, amount: val })} placeholder="Enter amount" />
          <InputBox label="Term (months)" type="number" value={formData.term} onChange={(val) => setFormData({ ...formData, term: val })} placeholder="Enter loan term in months" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
            <select value={formData.userType} onChange={(e) => setFormData({ ...formData, userType: e.target.value as any })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
              <option value="borrower">Borrow money</option>
              <option value="lender">Lend money</option>
              <option value="both">Both lend and borrow</option>
            </select>
          </div>

          <PasswordField label="Password" value={formData.password} onChange={(val) => setFormData({ ...formData, password: val })} showPassword={showPassword} setShowPassword={setShowPassword} />
          <PasswordField label="Confirm Password" value={formData.confirmPassword} onChange={(val) => setFormData({ ...formData, confirmPassword: val })} showPassword={showPassword} setShowPassword={setShowPassword} />

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, value, onChange, type, placeholder }: { label: string, icon: JSX.Element, value: string, onChange: (val: string) => void, type: string, placeholder: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">{icon}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={placeholder} required />
    </div>
  </div>
);

const InputBox = ({ label, value, onChange, type = 'text', placeholder }: { label: string, value: string, onChange: (val: string) => void, type?: string, placeholder: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={placeholder} required />
  </div>
);

const PasswordField = ({ label, value, onChange, showPassword, setShowPassword }: { label: string, value: string, onChange: (val: string) => void, showPassword: boolean, setShowPassword: (val: boolean) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input type={showPassword ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={label} required />
      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  </div>
);
