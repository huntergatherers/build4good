"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
    GoogleMap,
    Marker,
    InfoWindow,
    useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "100vh",
};

const center = {
    lat: 1.371645,
    lng: 103.821493,
};

function GoogleMapsItem({ markers = [], users }) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS,
    });

    const [map, setMap] = useState(null);
    const [icon, setIcon] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        if (isLoaded && window.google) {
            setIcon({
                url: "https://cdn4.iconfinder.com/data/icons/social-messaging-productivity-5/128/map-location-person-512.png",
                scaledSize: new window.google.maps.Size(40, 40),
            });
        }
    }, [isLoaded]);

    const onLoad = useCallback(function callback(map) {
        const bufferDistance = 0.05; // Adjust this value to set how far the bounds are from the location

        const bounds = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(
                center.lat - bufferDistance,
                center.lng - bufferDistance
            ), // Southwest coordinates
            new window.google.maps.LatLng(
                center.lat + bufferDistance,
                center.lng + bufferDistance
            ) // Northeast coordinates
        );
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    return isLoaded ? (
        <GoogleMap
            options={{
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
            }}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={4}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {markers.length > 0 &&
                markers.map((marker, index) => (
                    <Marker
                        style={{ width: "10px", height: "10px" }}
                        icon={icon}
                        key={index}
                        position={{
                            lat: marker.latitude,
                            lng: marker.longitude,
                        }}
                        onClick={() => handleMarkerClick(marker)}
                    />
                ))}

            {selectedMarker && (
                <InfoWindow
                    position={{
                        lat: selectedMarker.latitude,
                        lng: selectedMarker.longitude,
                    }}
                    onCloseClick={() => setSelectedMarker(null)}
                >
                    <div className="text-2xl">
                        <h2 className="font-bold">
                            {users[selectedMarker.id - 1].name}
                        </h2>
                        <p className="text-green-600 font-medium text-xl">
                            {users[selectedMarker.id - 1].wasteDonated +
                                users[selectedMarker.id - 1].wasteDonated}{" "}
                            kg{" "}
                            <span className="text-md text-black font-normal">
                                recycled
                            </span>
                        </p>
                        <p>{users[selectedMarker.id - 1].about}</p>
                        <div className="text-gray-500 flex justify-between space-x-2 mt-4">
                            {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                            ].map((day, idx) => (
                                <p
                                    key={idx}
                                    className={`flex items-center justify-center font-semibold rounded-full w-6 h-6 ${
                                        users[
                                            selectedMarker.id - 1
                                        ].freeDays.includes(day)
                                            ? "bg-green-300"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {day[0]}
                                </p>
                            ))}
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    ) : (
        <></>
    );
}

export default React.memo(GoogleMapsItem);
