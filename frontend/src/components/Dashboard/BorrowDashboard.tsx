import React, { useEffect, useState } from "react";
import {
  DollarSign,
  MapPin,
  PlusCircle,
  LocateFixed,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import LiveMap from "../Maps/LiveMap";
import { updateUserLocation } from "../../hooks/updateUserLocation";

interface Lender {
  _id: string;
  full_name?: string;
  phone?: string;
  distance?: number;
  rating?: number;
  location?: {
    latitude?: number;
    longitude?: number;
    coordinates?: [number, number];
  };
}

export const BorrowerDashboard = () => {
  const { user } = useAuth();
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [activeLoan, setActiveLoan] = useState<any>(null);
  const [matchedLenders, setMatchedLenders] = useState<Lender[]>([]);
  const [borrowerLocation, setBorrowerLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    setTotalBorrowed(12500); // Replace with dynamic fetch if needed

    const fetchLoanStatus = async () => {
      try {
        const res = await axios.get(`/api/loans/status/${user._id}`);
        setActiveLoan(res.data.loan || null);
      } catch (err) {
        console.error("Error fetching active loan:", err);
        setActiveLoan(null);
      }
    };

    fetchLoanStatus();
    const interval = setInterval(fetchLoanStatus, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!borrowerLocation || !user?._id) return;

    setLoading(true);
    axios
      .get(`/api/loans/match`, {
        params: {
          userId: user._id,
          latitude: borrowerLocation.latitude,
          longitude: borrowerLocation.longitude,
        },
      })
      .then((res) => {
        setMatchedLenders(res.data.matches || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching nearby lenders:", err);
        setMatchedLenders([]);
        setError("Failed to fetch nearby lenders.");
      })
      .finally(() => setLoading(false));
  }, [borrowerLocation, user]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setBorrowerLocation(coords);

        try {
          if (user?._id) {
            await updateUserLocation(user._id, coords.latitude, coords.longitude);
            console.log("📡 Location updated on backend.");
          }
        } catch (error) {
          console.error("❌ Failed to update location on server", error);
        }
      },
      () => alert("Unable to retrieve your location")
    );
  };

  useEffect(() => {
    if (!user?.location?.latitude || !user?.location?.longitude) {
      handleGetLocation();
    } else {
      setBorrowerLocation({
        latitude: user.location.latitude,
        longitude: user.location.longitude,
      });
    }
  }, [user]);

  // ✅ Updated: Redirect to money exchange page
  const handleConfirmArrival = () => {
    if (!activeLoan?._id) {
      alert("Loan ID not available");
      return;
    }

    navigate(`/dashboard/money-exchange?loanId=${activeLoan._id}`);
  };

  const lenderCoords = activeLoan?.lender?.location?.coordinates;
  const finalBorrowerCoords = borrowerLocation || user?.location;

  const isMapReady =
    Array.isArray(lenderCoords) &&
    lenderCoords.length === 2 &&
    typeof lenderCoords[0] === "number" &&
    typeof lenderCoords[1] === "number" &&
    typeof finalBorrowerCoords?.latitude === "number" &&
    typeof finalBorrowerCoords?.longitude === "number";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome back, {user?.full_name || "Borrower"}!</h1>
      <p className="text-gray-600 mb-6">Here’s your borrowing overview.</p>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <DollarSign className="text-blue-500 w-6 h-6 mb-2" />
          <h3 className="text-2xl font-bold">₹{totalBorrowed}</h3>
          <p className="text-sm text-gray-600">Total Borrowed</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <Users className="text-green-500 w-6 h-6 mb-2" />
          <h3 className="text-2xl font-bold">{matchedLenders.length}</h3>
          <p className="text-sm text-gray-600">Nearby Lenders</p>
        </div>
      </div>

      {/* Loan Request Status */}
      {activeLoan && (
        <div className="bg-white rounded-xl shadow-sm p-6 border mb-6">
          <h2 className="text-xl font-bold mb-4">Loan Request Status</h2>
          <p>Status: <strong>{activeLoan.status}</strong></p>

          {activeLoan.status === "pending" ? (
            <p className="text-orange-600 mt-2">Waiting for a lender to accept your request.</p>
          ) : (
            <>
              <div className="text-green-700 mt-2">
                ✅ Accepted by {activeLoan.lender?.full_name || "N/A"}
                <br />
                📞 {activeLoan.lender?.phone || "N/A"}
                <br />
                <MapPin className="inline w-4 h-4 mr-1" />
                {lenderCoords?.join(", ") || "No location available"}
              </div>

              <button
                onClick={handleGetLocation}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 flex items-center"
              >
                <LocateFixed className="w-5 h-5 mr-2" />
                Get My Current Location
              </button>

              {isMapReady && (
                <>
                  <div className="mt-4">
                    <LiveMap
                      lenderLocation={{ lat: lenderCoords[1], lng: lenderCoords[0] }}
                      borrowerLocation={{
                        lat: finalBorrowerCoords.latitude,
                        lng: finalBorrowerCoords.longitude,
                      }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/live-tracking?lat=${lenderCoords[1]}&lng=${lenderCoords[0]}&loanId=${activeLoan._id}`
                        )
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View Live Meeting Point
                    </button>

                    <button
                      onClick={handleConfirmArrival}
                      className="mt-4 px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Confirm Lender Arrival
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Loan request button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/dashboard/borrowform")}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Request a Loan
        </button>
      </div>
    </div>
  );
};
