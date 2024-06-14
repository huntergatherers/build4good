"use client";
import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
    OverlayView,
} from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "200px",
    borderRadius: "0.75rem",
};

function GoogleMaps({ location, listing }) {
    const placesLibrary = ["places"];
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS,
        libraries: placesLibrary,
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        const bufferDistance = 0.01; // Adjust this value to set how far the bounds are from the location

        const bounds = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(
                location.lat - bufferDistance,
                location.lng - bufferDistance
            ), // Southwest coordinates
            new window.google.maps.LatLng(
                location.lat + bufferDistance,
                location.lng + bufferDistance
            ) // Northeast coordinates
        );
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    const getPixelPositionOffset = (width, height) => ({
        x: -(width / 2),
        y: -(height / 2),
    });

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
            center={location}
            zoom={20}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {/* <OverlayView
                position={location}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={getPixelPositionOffset}
                zIndex={50}
            >
                <div className="bg-white w-36 h-36">
                    <div>
                        <h1 className="bg-white w-20 h-20">OverlayView</h1>
                    </div>
                    <div />
                </div>
            </OverlayView> */}
            <Marker position={location}>
                {/* <InfoWindow>
                    <div>
                        <h2 className="font-bold">Preferred Meet-up point</h2>
                        <p>Exact location provided after</p>
                    </div>
                </InfoWindow> */}
            </Marker>

            {/* <InfoWindow></InfoWindow> */}
        </GoogleMap>
    ) : (
        <></>
    );
}

export default React.memo(GoogleMaps);
