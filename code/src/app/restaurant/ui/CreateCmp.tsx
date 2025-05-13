"use client";
import React from "react";
import InputBox from "@/components/forms/InputBox";
import ButtonBox from "@/components/forms/ButtonBox";
import AlertBox from "@/components/forms/AlertBox";
import { handleError } from "@/utils/funcs";
import GetInput from "@/components/forms/GetInput";
import TextAreaBox from "@/components/forms/TextAreaBox";
import GetImage from "@/components/forms/GetImage";
import LocationBox from "@/components/location/LocationBox";
import { addRestaurant } from "../funcs";
import GetMenu from "@/components/forms/GetMenu";

const initial_values = {
  name: "",
  address: {
    formatted_address: "",
  },
  contact: "",
  cuisine: "",
  hours: [],
  availableTimes: [],
  tableSize: [],
  description: "",
  photos: [],
  phone: "",
  website: "",
  menu: [],
};
const CreateCmp = ({ id }: { id?: string }) => {
  const [state, setState] = React.useState(initial_values);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

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
      setError("");
      setLoading(true);
      if (!state.name) {
        throw new Error("Name is missing");
      }
      if (!state.address.formatted_address) {
        throw new Error("Address is missing");
      }
      if (!state.contact) {
        throw new Error("Contact is missing");
      }
      if (state.photos.length === 0) {
        throw new Error("Add atleast one photo.");
      }
      await addRestaurant({
        ...state,
        token: localStorage.getItem("token"),
      });
      setState({ ...initial_values, address: state.address });
      if (id) {
        setError("Restaurant updated Successfully.");
      } else {
        setError(
          "Restaurant created successfully, It is pending admin approval."
        );
      }
      setLoading(false);
    } catch (err: unknown) {
      const errMessage: string = await handleError(err);
      setError(errMessage);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!id) {
      return;
    }
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`/api/restaurant/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant");
        }
        const data = await response.json();
        setState(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [id]);
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>New Listing</h1>
      <form>
        <InputBox
          name="name"
          value={state.name}
          handleChange={handleChange}
          label="Name"
        />
        <LocationBox handleChange={handleChange.bind(null, "address")} />
        {state.address && (
          <InputBox
            name="address"
            value={state.address.formatted_address}
            handleChange={handleChange}
            label="Address"
            disabled={true}
          />
        )}
        <InputBox
          name="contact"
          value={state.contact}
          handleChange={handleChange}
          label="Contact"
        />
        <InputBox
          name="phone"
          value={state.phone}
          handleChange={handleChange}
          label="Phone"
        />
        <InputBox
          name="website"
          value={state.website}
          handleChange={handleChange}
          label="Website"
        />
        <InputBox
          name="cuisine"
          value={state.cuisine}
          handleChange={handleChange}
          label="Cuisine"
        />
        <GetInput
          onHandleChange={handleChange}
          title="Hours"
          name="hours"
          value={state.hours ?? []}
          disabled={false}
        />
        <GetInput
          onHandleChange={handleChange}
          title="Available Times"
          name="availableTimes"
          value={state.availableTimes ?? []}
          disabled={false}
        />
        <GetInput
          onHandleChange={handleChange}
          title="Table Size"
          name="tableSize"
          value={state.tableSize ?? []}
          disabled={false}
        />
        <TextAreaBox
          name="description"
          value={state.description ?? ""}
          handleChange={handleChange}
          label="Description"
          maxRows={7}
        />
        <GetImage
          onHandleChange={handleChange}
          title="Photos"
          name="photos"
          value={state.photos ?? []}
          disabled={false}
        />
        <GetMenu
          onHandleChange={handleChange}
          title="Menu"
          name="menu"
          value={state.menu ?? []}
          disabled={false}
        />
        {error && <AlertBox message={error} title="Message" />}
        <ButtonBox
          type="button"
          label="Submit"
          handleClick={handleSubmit}
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default CreateCmp;
