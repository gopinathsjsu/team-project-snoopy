"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ScheduleRowImp } from "@/utils/types";
import Restaurant from "@/app/ui/Restaurant";
import "@/app/ui/smain.css";

const ApprovalsCmp = () => {
  const [restaurants, setRestaurants] = useState<ScheduleRowImp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await fetch("/api/restaurant?status=pending");
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant");
      }
      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="eastbay-container">
      <h1>Restaurants (Pending Approvals)</h1>
      <Restaurant
        restaurants={restaurants}
        fetchRestaurants={fetchRestaurants}
      />
    </div>
  );
};

export default ApprovalsCmp;
