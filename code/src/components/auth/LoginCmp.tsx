"use client";
import React from "react";
import InputBox from "@/components/forms/InputBox";
import ButtonBox from "@/components/forms/ButtonBox";
import AlertBox from "@/components/forms/AlertBox";
import { login } from "./auth";
import { handleError } from "@/utils/funcs";
import Footer from "./Footer";

function LoginCmp() {
  const [state, setState] = React.useState({
    username: "",
    password: "",
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
      if (!state.username) {
        throw new Error("Username is missing");
      }
      if (!state.password) {
        throw new Error("Password is missing");
      }
      await login(state.username, state.password);
      window.location.href = "/";
    } catch (err: unknown) {
      const errMessage: string = await handleError(err);
      setError(errMessage);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Login</h1>
      <form onSubmit={handleSubmit}>
        <InputBox
          name="username"
          value={state.username}
          handleChange={handleChange}
          label="Username"
        />
        <InputBox
          name="password"
          value={state.password}
          handleChange={handleChange}
          label="Password"
          type="password"
        />
        <ButtonBox type="submit" label="Login" />
        {error && <AlertBox message={error} title="Error" />}
      </form>
      <Footer />
    </div>
  );
}

export default LoginCmp;
