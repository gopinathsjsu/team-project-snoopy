"use client";
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const center = { lat, lng };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "",
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {/* ✅ Add Marker */}
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default React.memo(GMap);
