"use client";
import React from "react";
import Autocomplete from "react-google-autocomplete";
import "./LocationBox.scss";

const LocationBox = ({ handleChange }: { handleChange?: any }) => {
  const cleanup = (place: any) => {
    const componentForm: any = {
      locality: "long_name", // city
      administrative_area_level_1: "short_name", // state
      administrative_area_level_2: "long_name", // county
      country: "short_name",
      street_number: "long_name",
      route: "long_name",
      postal_code: "long_name",
      postal_code_suffix: "long_name",
    };

    const obj: any = {};
    obj["place_id"] = place.place_id;
    let val2 = "";
    obj.formatted_address = place.formatted_address;
    obj.lat = place.geometry.location.lat();
    obj.lng = place.geometry.location.lng();

    for (const elm of place.address_components) {
      let addressType = elm.types[0];
      console.log("addressType: ", addressType);
      if (componentForm[addressType]) {
        const val = elm[componentForm[addressType]];
        if (addressType === "locality") {
          addressType = "city";
        } else if (addressType === "administrative_area_level_1") {
          addressType = "state";
          val2 = elm["long_name"];
          obj["state_long"] = val2;
        } else if (addressType === "administrative_area_level_2") {
          addressType = "county";
        } else if (addressType === "country") {
          val2 = elm["long_name"];
          obj["country_long"] = val2;
        }
        obj[addressType] = val;
      }
    }
    return obj;
  };
  return (
    <div className="location-box" style={{ marginBottom: "20px" }}>
      <div className="autocomplete-container">
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
          onPlaceSelected={(places) => {
            console.log("places: ", places);
            const obj = cleanup(places);
            console.log("obj is ", obj);
            handleChange?.(obj);
          }}
          options={{ types: [] }}
          className="input"
          type="search"
        />
      </div>
    </div>
  );
};

export default LocationBox;
