'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function TrackingMap({
  orderId,
  currentLocation,
}: {
  orderId: string;
  currentLocation: { lat: number; lng: number; address: string };
}) {
  useEffect(() => {
    // Map container'ın ID'sine göre harita oluştur
    const mapContainer = document.getElementById(`map-${orderId}`);
    if (!mapContainer) return;

    // Harita oluştur
    const newMap = L.map(`map-${orderId}`).setView(
      [currentLocation.lat, currentLocation.lng],
      13
    );

    // OpenStreetMap tile layer ekle
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(newMap);

    // Marker: Kurye konumu
    L.marker([currentLocation.lat, currentLocation.lng], {
      icon: L.icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    })
      .addTo(newMap)
      .bindPopup(`<strong>🚚 Kurye</strong><br/>${currentLocation.address}`);

    // Demo: Fırın konumu (Gaziantep)
    L.marker([37.0662, 37.3832], {
      icon: L.icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    })
      .addTo(newMap)
      .bindPopup('<strong>🍰 Coşkun Yaycı Fırını</strong><br/>Gaziantep');

    return () => {
      newMap.remove();
    };
  }, [orderId, currentLocation]);

  return (
    <div id={`map-${orderId}`} className="w-full h-96" style={{ zIndex: 1 }} />
  );
}
