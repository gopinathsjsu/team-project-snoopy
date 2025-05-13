export const addRestaurant = async (state: any) => {
  const response = await fetch("/api/restaurant", {
    method: !state.id ? "POST" : "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data;
};

export const addReservation = async (state: any) => {
  const response = await fetch("/api/restaurant/booking", {
    method: !state.booking_id ? "POST" : "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data;
};
