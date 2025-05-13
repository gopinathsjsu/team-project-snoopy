"use client";
import React from "react";
import Parse from "@/utils/parseCmp";
import { useSearchParams, useRouter } from "next/navigation";
import InputBox from "@/components/forms/InputBox";
import ButtonBox from "@/components/forms/ButtonBox";

import { register } from "./auth";
import { handleError } from "@/utils/funcs";
import AlertBox from "@/components/forms/AlertBox";
import Footer from "./Footer";
import Loading from "@/components/utility/Loading";

function replaceWithUnderscore(str: string): string {
  return str.replace(/[^\w.-]/g, "");
}

function RegisterCmp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const [state, setState] = React.useState({
    name: name ?? "",
    username: "",
    email: email ?? "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [pageLoad, setPageLoad] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleChange = (name: string, value: string) => {
    let val = value;
    if (name === "username") {
      val = replaceWithUnderscore(val);
    }
    setState((prev) => {
      return {
        ...prev,
        [name]: val,
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
      if (!state.username) {
        throw new Error("Username is missing");
      }
      if (!state.name) {
        throw new Error("Name is missing");
      }
      if (!state.password) {
        throw new Error("Password is missing");
      }
      if (state.password !== state.confirm_password) {
        throw new Error("Password does not match with confirm password.");
      }
      setLoading(true);
      await register(state);
      setLoading(false);
      router.push("/auth/login");
    } catch (err: unknown) {
      const errMessage: string = await handleError(err); // check again
      setError(errMessage);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const user = Parse.User.current();
    if (user) {
      router.push("/");
      return;
    }
    setPageLoad(true);
  }, [router]);

  if (!pageLoad) {
    return <Loading />;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", width: "100%" }}>
      <h1 style={{ marginBottom: "20px" }}>Register</h1>
      <form onSubmit={handleSubmit}>
        <InputBox
          name="email"
          value={state.email}
          handleChange={handleChange}
          label="Email"
          type="email"
        />
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
        <InputBox
          name="confirm_password"
          value={state.confirm_password}
          handleChange={handleChange}
          label="Confirm Password"
          type="password"
        />
        <InputBox
          name="name"
          value={state.name}
          handleChange={handleChange}
          label="Name"
        />
        {loading && <Loading />}
        {error && <AlertBox message={error} title="Error" />}
        <ButtonBox type="submit" label="Register" />
      </form>
      <Footer />
    </div>
  );
}

export default RegisterCmp;
