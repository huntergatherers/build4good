"use client";

import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';


const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
    ssr: false,
});

export default function ListingMap() {
    return (
        <div className="relative min-h-56 w-full my-4">
            <MapContainer
                center={[1.3521, 103.8198]}
                zoom={13}
                scrollWheelZoom={true}
                zoomControl={false}
                className="absolute inset-0 z-1 rounded-2xl"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright"'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[1.3521, 103.8198]}>
                    <Popup>
                        Welcome to Singapore! <br /> The Lion City.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
