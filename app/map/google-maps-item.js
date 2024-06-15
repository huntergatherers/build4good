"use client";
import React from "react";
import {
    GoogleMap,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "100vh",
};

const center = {
    lat: 1.4491,
    lng: 103.8185,
};

function GoogleMapsItem({ markers = [] }) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS,
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

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
            zoom={6}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {markers.length > 0 && markers.map((marker, index) => (
                <Marker key={index} position={marker} />
            ))}
        </GoogleMap>
    ) : (
        <></>
    );
}

export default React.memo(GoogleMapsItem);
