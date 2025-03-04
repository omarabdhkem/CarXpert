import { useEffect, useRef, useState } from "react";

interface Marker {
  lat: number;
  lng: number;
  title?: string;
}

interface SimpleMapProps {
  lat: number;
  lng: number;
  zoom: number;
  markers?: Marker[];
  onClick?: (lat: number, lng: number) => void;
}

export default function SimpleMap({ lat, lng, zoom, markers = [], onClick }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || typeof google === "undefined") return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add click event if onClick is provided
    if (onClick) {
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          onClick(e.latLng.lat(), e.latLng.lng());
        }
      });
    }

    setMapInstance(map);

    return () => {
      // Clean up map instance if needed
    };
  }, [mapRef.current]);

  // Update center and zoom when props change
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setCenter({ lat, lng });
      mapInstance.setZoom(zoom);
    }
  }, [lat, lng, zoom]);

  // Update markers when they change
  useEffect(() => {
    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));
    
    if (!mapInstance) return;

    // Add new markers
    const newMarkers = markers.map(marker => {
      const mapMarker = new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: mapInstance,
        title: marker.title,
        animation: google.maps.Animation.DROP,
      });

      // Add info window if title is provided
      if (marker.title) {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div class="p-2">${marker.title}</div>`,
        });

        mapMarker.addListener("click", () => {
          infoWindow.open(mapInstance, mapMarker);
        });
      }

      return mapMarker;
    });

    setMapMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [markers, mapInstance]);

  return (
    <div className="w-full h-full">
      {typeof google === "undefined" ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <p className="text-muted-foreground text-sm">Loading map...</p>
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}
    </div>
  );
}
