import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";

interface MapProps {
  latitude: number;
  longitude: number;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Map: React.FC<MapProps> = ({ latitude, longitude }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = L.map(mapContainer.current).setView(
        [latitude, longitude],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker([latitude, longitude]).addTo(map).bindPopup("Ubicación");

      return () => {
        map.remove();
      };
    }
  }, [latitude, longitude]);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Mapa Interactivo
      </h1>
      <div
        ref={mapContainer}
        className="w-full h-96 rounded-lg shadow-lg border border-gray-300"
      />
    </div>
  );
};

export default Map;
