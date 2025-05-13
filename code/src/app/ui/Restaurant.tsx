import React from "react";
import { ScheduleRowImp } from "@/utils/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getRandomBetween100And5000,
  getRandomBetween2And30,
  getRandomBetween3And5,
} from "@/utils/funcs";

const Restaurant = ({
  restaurants,
  fetchRestaurants,
}: {
  restaurants: ScheduleRowImp[];
  fetchRestaurants?: any;
}) => {
  const router = useRouter();
  const u = localStorage.getItem("userInfo");
  const userInfo = u && JSON.parse(u);
  const token = localStorage.getItem("token");

  const handleUpdate = async (id: number, status: string) => {
    fetch(
      `/api/restaurant/change-status?status=${status}&id=${id}&token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Success:", data);
        fetchRestaurants?.();
      })
      .catch((err) => {
        console.error("❌ Error:", err);
      });
  };
  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant: ScheduleRowImp) => (
        <div className="restaurant-card" key={restaurant.id}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "400px",
            }}
          >
            <a href={`/r/${restaurant.id}`}>
              <Image
                src={restaurant.photos?.[0]?.value}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </a>
          </div>
          <div className="restaurant-info">
            <h2>{restaurant.name}</h2>
            <p>
              {restaurant.cuisine} • $$ • {restaurant.address.city}
            </p>
            <p>
              Rating: {getRandomBetween3And5().toFixed(1)} (
              {getRandomBetween100And5000()} reviews)
            </p>
            <p>Booked {getRandomBetween2And30()} times today</p>
            {userInfo?.role === "manager" &&
              userInfo?.user_id === restaurant.user_id && (
                <div>
                  <Link
                    href={`/restaurant/listing/create/${restaurant.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                </div>
              )}
            {userInfo?.role === "admin" && (
              <div>
                <div>
                  <b>Current Status: </b> {restaurant.status}
                </div>
                {restaurant.status !== "approved" && (
                  <>
                    <span
                      aria-hidden="true"
                      onClick={() => {
                        handleUpdate(restaurant.id, "approved");
                      }}
                      style={{
                        textDecoration: "none",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </span>{" "}
                    |{" "}
                  </>
                )}
                <span
                  aria-hidden="true"
                  onClick={() => {
                    const a = window.confirm(
                      "Do you really want to delete this restaurant?"
                    );
                    if (!a) {
                      return;
                    }
                    handleUpdate(restaurant.id, "deleted");
                  }}
                  style={{
                    textDecoration: "none",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </span>{" "}
                |{" "}
                <Link
                  href={`/restaurant/listing/create/${restaurant.id}`}
                  style={{ textDecoration: "none" }}
                >
                  Edit
                </Link>
              </div>
            )}
            <button
              onClick={() => {
                const url = `/r/${restaurant.id}`;
                router.push(url);
              }}
            >
              Find next available
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Restaurant;
