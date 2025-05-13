"use client";
import React from "react";
import InputBox from "@/components/forms/InputBox";
import ButtonBox from "@/components/forms/ButtonBox";
import AlertBox from "@/components/forms/AlertBox";
import { forgot } from "@/utils/parseMod/client/auth";
import { handleError } from "@/utils/funcs";
import Footer from "./Footer";

function ForgotCmp() {
  const [state, setState] = React.useState({
    email: "",
  });
  const [error, setError] = React.useState("");
  const handleChange = (name: string, value: string) => {
    setState((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError("");
      if (!state.email) {
        throw new Error("Email is missing");
      }
      await forgot(state.email);
      setError("Reset Email sent successfully.");
    } catch (err: unknown) {
      const errMessage: string = await handleError(err);
      setError(errMessage);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Forgot My Password</h1>
      <form onSubmit={handleSubmit}>
        {error && <AlertBox message={error} title="Error" />}
        <InputBox
          name="email"
          value={state.email}
          handleChange={handleChange}
          label="Email"
        />
        <ButtonBox type="submit" label="Reset My Password" />
      </form>
      <Footer />
    </div>
  );
}

export default ForgotCmp;
