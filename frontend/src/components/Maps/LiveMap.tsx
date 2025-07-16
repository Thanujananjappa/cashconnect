import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Haversine formula for distance in KM
const getDistance = (loc1: any, loc2: any) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface LiveMapProps {
  borrowerLocation: { lat: number; lng: number };
  lenderLocation: { lat: number; lng: number };
}

export const LiveMap: React.FC<LiveMapProps> = ({ borrowerLocation, lenderLocation }) => {
  const distance = getDistance(borrowerLocation, lenderLocation);
  const etaMinutes = Math.round((distance / 5) * 60); // 5 km/h walking speed

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300 shadow">
      <MapContainer center={borrowerLocation} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={borrowerLocation}>
          <Popup>📍 You (Borrower)</Popup>
        </Marker>

        <Marker position={lenderLocation}>
          <Popup>🏦 Lender Location</Popup>
        </Marker>

        <Polyline positions={[borrowerLocation, lenderLocation]} color="blue" />
      </MapContainer>

      <div className="mt-2 text-sm text-gray-700 px-2">
        📏 Distance: <strong>{distance.toFixed(2)} km</strong> | ⏱ ETA: <strong>{etaMinutes} mins</strong>
      </div>
    </div>
  );
};
