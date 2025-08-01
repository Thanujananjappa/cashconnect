import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix Leaflet icon issue (marker not showing)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  lat: number;
  lng: number;
}

interface LiveMapProps {
  borrowerLocation: Location;
  lenderLocation: Location;
}

const LiveMap = ({ borrowerLocation, lenderLocation }: LiveMapProps) => {
  const center = {
    lat: (borrowerLocation.lat + lenderLocation.lat) / 2,
    lng: (borrowerLocation.lng + lenderLocation.lng) / 2,
  };

  return (
    <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={borrowerLocation}>
        <Popup>Borrower</Popup>
      </Marker>
      <Marker position={lenderLocation}>
        <Popup>Lender</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LiveMap;
