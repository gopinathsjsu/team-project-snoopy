"use client";
import React, { useEffect, useState, useCallback } from "react";
import BookingItem from "./BookingItem";

function BookingsCmp() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log("bookings: ", bookings);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/restaurant/booking?token=${localStorage.getItem("token")}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div style={{ padding: "20px" }}>
      <h3>My Bookings</h3>
      {bookings?.length > 0 && (
        <section className="menu" style={{ margin: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {bookings.map((item: any) => {
              return (
                <div key={item.booking_id}>
                  <BookingItem item={item} />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default React.memo(BookingsCmp);
