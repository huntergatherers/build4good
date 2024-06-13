"use client";
export const dynamic = "force-dynamic";
import "leaflet/dist/leaflet.css";
import nextDynamic from "next/dynamic";
import { getMarkerIcon } from "./utils";

const MapContainer = nextDynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = nextDynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = nextDynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = nextDynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

export default function MapItem() {
    const userData = [
        {
            id: 1,
            name: "John Doe",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 150,
            wasteDonated: 75,
            startDate: new Date("2023-05-15"),
            freeDays: ["Monday", "Wednesday", "Friday"],
            role: "Gardener",
            latitude: 1.3521,
            longitude: 103.8198,
        },
        {
            id: 2,
            name: "Jane Smith",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 200,
            wasteDonated: 100,
            startDate: new Date("2023-03-20"),
            freeDays: ["Tuesday", "Thursday"],
            role: "Compostor",
            latitude: 1.3422,
            longitude: 103.82,
        },
        {
            id: 3,
            name: "Tim Poon",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 100,
            wasteDonated: 50,
            startDate: new Date("2024-05-15"),
            freeDays: ["Saturday", "Sunday"],
            role: "Donor",
            latitude: 1.3623,
            longitude: 103.8202,
        },
        {
            id: 1,
            name: "Lay Bay",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 150,
            wasteDonated: 75,
            startDate: new Date("2023-01-15"),
            freeDays: ["Monday", "Wednesday", "Friday"],
            role: "Gardener",
            latitude: 1.3524,
            longitude: 103.8004,
        },
        {
            id: 2,
            name: "Sean Tane",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 200,
            wasteDonated: 100,
            startDate: new Date("2023-05-15"),
            freeDays: ["Tuesday", "Thursday"],
            role: "Compostor",
            latitude: 1.3525,
            longitude: 103.8406,
        },
        {
            id: 3,
            name: "Tom Lee",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 100,
            wasteDonated: 50,
            startDate: new Date("2023-05-15"),
            freeDays: ["Saturday", "Sunday"],
            role: "Donor",
            latitude: 1.3526,
            longitude: 103.8318,
        },
    ];

    return (
        <MapContainer
            center={[1.3521, 103.8198]}
            zoom={13}
            scrollWheelZoom={false}
            zoomControl={false}
            className="absolute inset-0 z-1"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright"'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userData.map((item) => (
                <Marker
                    key={item.id}
                    position={[item.latitude, item.longitude]}
                    icon={getMarkerIcon(item.role)}
                >
                    <Popup>hi {item.id}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
