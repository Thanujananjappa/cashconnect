// src/pages/LiveTrackingPage.tsx

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../hooks/useAuth';
import DestinationReachedButton from '../../components/DestinationReachedButton';

function RoutingMachine({
  borrowerLat,
  borrowerLng,
  onDestinationReached,
}: {
  borrowerLat: number;
  borrowerLng: number;
  onDestinationReached: () => void;
}) {
  const map = useMap();
  const [routeControl, setRouteControl] = useState<any>(null);

  useEffect(() => {
    const checkProximity = (lenderPos: L.LatLng, borrowerPos: L.LatLng) => {
      const distance = lenderPos.distanceTo(borrowerPos);
      if (distance < 50) {
        onDestinationReached();
      }
    };

    const updateRoute = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lenderLocation = L.latLng(position.coords.latitude, position.coords.longitude);
          const borrowerLocation = L.latLng(borrowerLat, borrowerLng);

          checkProximity(lenderLocation, borrowerLocation);

          if (routeControl) {
            map.removeControl(routeControl);
          }

          const control = L.Routing.control({
            waypoints: [lenderLocation, borrowerLocation],
            lineOptions: {
              styles: [{ color: 'red', weight: 4 }],
            },
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            show: false,
            createMarker: function (i, waypoint, n) {
              if (i === 0 || i === n - 1) {
                return L.marker(waypoint.latLng);
              }
              return null;
            },
          }).addTo(map);

          setRouteControl(control);
        },
        (err) => console.error('Location error', err),
        { enableHighAccuracy: true }
      );
    };

    updateRoute();
    const interval = setInterval(updateRoute, 10000);

    return () => clearInterval(interval);
  }, [borrowerLat, borrowerLng, map]);

  return null;
}

export default function LiveTrackingPage() {
  const [params] = useSearchParams();
  const borrowerLat = parseFloat(params.get('lat') || '');
  const borrowerLng = parseFloat(params.get('lng') || '');
  const loanId = params.get('loanId');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [destinationReached, setDestinationReached] = useState(false);

  const handleBorrowerConfirm = () => {
    setDestinationReached(true);
    alert('✅ You confirmed that the lender has arrived.');
    // Optional: navigate(`/dashboard/money-exchange?loanId=${loanId}`);
  };

  const goToMoneyExchange = () => {
    navigate(`/dashboard/money-exchange?loanId=${loanId}`);
  };

  if (isNaN(borrowerLat) || isNaN(borrowerLng)) {
    return <div className="p-6 text-red-600">❌ Invalid borrower location in URL.</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📍 Live Route to Borrower</h2>

      <MapContainer center={[borrowerLat, borrowerLng]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <RoutingMachine
          borrowerLat={borrowerLat}
          borrowerLng={borrowerLng}
          onDestinationReached={() => setDestinationReached(true)}
        />
      </MapContainer>

      {/* ✅ Borrower-side confirmation button (always shown) */}
      {user?.userType === 'borrower' && (
        <div className="mt-6 text-center">
          <button
            onClick={handleBorrowerConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            ✅ Confirm Lender Has Arrived
          </button>
        </div>
      )}

      {/* 🎯 Message and button shown after confirmation */}
      {destinationReached && (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-semibold mb-2">
            🎯 You have confirmed the lender's arrival.
          </p>
          <DestinationReachedButton />
        </div>
      )}
    </div>
  );
}
