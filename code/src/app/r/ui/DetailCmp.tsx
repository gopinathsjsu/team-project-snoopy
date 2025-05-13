"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ScheduleRowImp } from "@/utils/types";
import "./DetailCmp.css";
import { handleError } from "@/utils/funcs";
import { addReservation } from "@/app/restaurant/funcs";
import GMap from "@/utils/gmap/GMap";

const DetailCmp = ({ id }: { id: string }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [restaurant, setRestaurant] = useState<ScheduleRowImp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingR, setLoadingR] = useState(false);
  const [errorR, setErrorR] = useState<string | null>(null);
  const [state, setState] = React.useState({
    partySize: "",
    reserveDay: "",
    reserveTime: "",
  });
  console.log("state: ", state);

  const handleChange = (name: string, value: string) => {
    setState((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setErrorR("");
      setLoadingR(true);
      if (!state.partySize) {
        throw new Error("Party Size is missing");
      }
      if (!state.reserveDay) {
        throw new Error("Day is missing");
      }
      if (!state.reserveTime) {
        throw new Error("Time is missing");
      }
      await addReservation({
        ...state,
        id: restaurant?.id,
        name: restaurant?.name,
        token: localStorage.getItem("token"),
      });
      setState({
        partySize: "",
        reserveDay: "",
        reserveTime: "",
      });
      setErrorR("Your seat is reserved.");
      setLoadingR(false);
    } catch (err: unknown) {
      const errMessage: string = await handleError(err);
      setErrorR(errMessage);
      setLoadingR(false);
    }
  };

  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/restaurant/${id}?token=${localStorage.getItem("token")}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant");
      }
      const data = await response.json();
      setRestaurant(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const u = localStorage.getItem("userInfo");
    if (!u) {
      setUserInfo(null);
      return;
    }
    const u2 = u && JSON.parse(u);
    setUserInfo(u2);
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  if (loading) {
    return <div>Loading restaurant...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!restaurant) {
    return <div>Loading...</div>;
  }
  console.log(restaurant);
  return (
    <div className="hideout-container">
      <header
        className="hero"
        style={{
          background: `url("${restaurant.photos?.[0]?.value}")
    center/cover no-repeat`,
        }}
      >
        <div className="overlay">
          <h1>{restaurant.name}</h1>
          <p>
            {restaurant.cuisine} Cuisine in {restaurant.address.city}
          </p>
        </div>
      </header>

      {userInfo && (
        <section className="reservation">
          <h2>Make a Reservation</h2>
          {errorR && (
            <div>
              <b>Message:</b> {errorR}
            </div>
          )}
          {loadingR && <div>Reservation in progress...</div>}
          <div>
            <label htmlFor="party-size">Party Size:</label>
            <select
              id="party-size"
              onChange={(e: any) => {
                handleChange("partySize", e.target.value);
              }}
            >
              <option value="">Select</option>
              <option value="1">1 person</option>
              <option value="2">2 people</option>
              <option value="3">3 people</option>
              <option value="4">4 people</option>
              <option value="5">5 people</option>
            </select>

            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={state.reserveDay}
              onChange={(e: any) => {
                handleChange("reserveDay", e.target.value);
              }}
            />

            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              value={state.reserveTime}
              onChange={(e: any) => {
                handleChange("reserveTime", e.target.value);
              }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              style={{ marginTop: "20px" }}
            >
              Reserve Now
            </button>
          </div>
        </section>
      )}

      <section className="about">
        <h2>About Us</h2>
        <p>{restaurant.description}</p>
      </section>

      {restaurant.menu.length > 0 && (
        <section className="menu">
          <h2>Menu Highlights</h2>
          <ul>
            {restaurant.menu.map((item) => {
              return (
                <li key={item.id}>
                  <strong>{item.value.label}</strong> – {item.value.desc}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="contact">
        <div style={{ display: "flex", gap: "16px" }}>
          <div>
            <h2>Contact & Location</h2>
            <p>
              <strong>Address:</strong> {restaurant.address.formatted_address}
            </p>
            <p>
              <strong>Phone:</strong> {restaurant.phone}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a href={`${restaurant.website}`}>{restaurant.website}</a>
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <GMap lat={restaurant.lat} lng={restaurant.lng} />
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 {restaurant.name}</p>
      </footer>
    </div>
  );
};

export default DetailCmp;
