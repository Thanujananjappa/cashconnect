import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

export default function MoneyExchangePage() {
  const [params] = useSearchParams();
  const loanId = params.get('loanId');
  const { user } = useAuth();

  const [confirmed, setConfirmed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpConfirmed, setOtpConfirmed] = useState(false);

  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    alert(`Generated OTP: ${newOtp}`);
  };

  const confirmOtp = () => {
    if (otp === generatedOtp) {
      setOtpConfirmed(true);
      alert('✅ OTP verified successfully.');
    } else {
      alert('❌ Invalid OTP. Please try again.');
    }
  };

  const handleConfirm = async () => {
    if (!otpConfirmed) {
      alert('❌ Please verify OTP before confirming exchange.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/loans/confirm-exchange', {
        loanId,
        role: user?.userType,
      });

      setConfirmed(true);
      if (res.data.isCompleted) {
        setCompleted(true);
        alert('✅ Loan process completed successfully!');
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to confirm exchange.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">💸 Cash/UPI Exchange</h2>
      <p className="mb-4 text-gray-600">Confirm the exchange only after verifying UPI/Cash.</p>

      {!generatedOtp && (
        <button
          onClick={generateOtp}
          className="px-6 py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate OTP
        </button>
      )}

      {generatedOtp && !otpConfirmed && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={confirmOtp}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Verify OTP
          </button>
        </div>
      )}

      {!confirmed && otpConfirmed && (
        <button
          onClick={handleConfirm}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Mark as Completed
        </button>
      )}

      {confirmed && completed && (
        <p className="text-green-700 font-bold mt-4">✅ Exchange Completed Successfully</p>
      )}

      {confirmed && !completed && (
        <p className="text-yellow-600 mt-4 font-semibold">Waiting for the other party to confirm...</p>
      )}
    </div>
  );
}
