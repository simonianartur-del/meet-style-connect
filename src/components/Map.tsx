import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface UserLocation {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  lat: number;
  lng: number;
}

interface MapProps {
  userLocation?: { lat: number; lng: number };
  nearbyUsers: UserLocation[];
  className?: string;
}

const Map: React.FC<MapProps> = ({ userLocation, nearbyUsers, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([20, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add user's current location marker (blue)
    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng])
        .addTo(map.current)
        .bindPopup('Your Location')
        .openPopup();
      
      // Custom blue icon for current user
      const blueIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      userMarker.setIcon(blueIcon);
      markersRef.current.push(userMarker);

      // Center map on user location
      map.current.setView([userLocation.lat, userLocation.lng], 10);
    }

    // Add nearby users markers (red)
    nearbyUsers.forEach(user => {
      const redIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([user.lat, user.lng], { icon: redIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div class="p-2">
            <div class="font-semibold">${user.display_name || user.username}</div>
            <div class="text-sm text-muted-foreground">@${user.username}</div>
          </div>
        `);
      
      markersRef.current.push(marker);
    });
  }, [userLocation, nearbyUsers]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default Map;