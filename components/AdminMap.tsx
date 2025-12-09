'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CourierDelivery {
  id: string;
  courierName: string;
  orderId: string;
  lat: number;
  lng: number;
  status: string;
  customerName?: string;
  address?: string;
  completedDeliveries?: number;
}

export default function AdminMap({
  deliveries,
  selectedDelivery,
}: {
  deliveries: CourierDelivery[];
  selectedDelivery: CourierDelivery | null;
}) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  useEffect(() => {
    const mapContainer = document.getElementById('admin-map');
    if (!mapContainer) return;

    const newMap = L.map('admin-map').setView([39.0, 35.0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(newMap);

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, []);

  // Update markers when deliveries change
  useEffect(() => {
    if (!map) return;

    // Clear old markers
    markers.forEach((marker) => map.removeLayer(marker));

    // Add new markers
    const newMarkers = deliveries.map((delivery) => {
      const isSelected = selectedDelivery?.id === delivery.id;
      const iconColor = isSelected ? 'green' : delivery.status === 'DELIVERED' ? 'gray' : 'blue';

      const marker = L.marker([delivery.lat, delivery.lng], {
        icon: L.icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: isSelected ? [35, 57] : [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .addTo(map)
        .bindPopup(
          `<strong>${delivery.courierName}</strong><br/>
        Sipariş: ${delivery.orderId}<br/>
        Durum: ${delivery.status}`
        );

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, deliveries, selectedDelivery]);

  return (
    <div id="admin-map" className="w-full h-96" style={{ zIndex: 1 }} />
  );
}
