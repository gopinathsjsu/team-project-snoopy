"use client";
import React from "react";
import Parse from "@/utils/parseCmp";
import InputBox from "@/components/forms/InputBox";
import ButtonBox from "@/components/forms/ButtonBox";
import { getPrivateInfo, updateProfile } from "@/utils/parseMod/client/auth";
import { handleError } from "@/utils/funcs";
import AlertBox from "@/components/forms/AlertBox";
import Footer from "./Footer";
import WrapLoggedIn from "@/components/utility/WrapLoggedIn";

function ProfileCmp() {
  const user = Parse.User.current();
  const [severity, setSeverity] = React.useState<
    "error" | "info" | "success" | "warning"
  >("error");
  const [state, setState] = React.useState<{
    name: any;
    profile_pic: any;
    whatsapp: string;
    telegram: string;
    phone: string;
  }>({
    name: user?.get("name") ?? "",
    profile_pic: user?.get("profile_pic") ?? "",
    whatsapp: "",
    telegram: "",
    phone: "",
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
      if (!state.name) {
        throw new Error("Name is missing");
      }
      if (!state.whatsapp) {
        throw new Error("Whatsapp number is missing");
      }
      if (!state.telegram) {
        throw new Error("Telegram username is missing");
      }
      if (!state.phone) {
        throw new Error("Phone Number is missing");
      }
      await updateProfile(state);
      setError("Profile Updated.");
      setSeverity("success");
    } catch (err: unknown) {
      const errMessage: string = await handleError(err); // check again
      setError(errMessage);
      setSeverity("error");
    }
  };

  React.useEffect(() => {
    getPrivateInfo({ user })
      .then((r) => {
        if (!r) {
          return;
        }
        setState((prev) => {
          return {
            ...prev,
            whatsapp: r.get("whatsapp"),
            telegram: r.get("telegram"),
            phone: r.get("phone"),
          };
        });
      })
      .catch((err: unknown) => {
        handleError(err).then((errMessage: string) => {
          setError(errMessage);
          setSeverity("error");
        });
      });
  }, [user]);

  return (
    <WrapLoggedIn>
      <div style={{ padding: "20px", maxWidth: "500px", width: "100%" }}>
        <h1 style={{ marginBottom: "20px" }}>Update Profile</h1>
        <form onSubmit={handleSubmit}>
          <InputBox
            name="name"
            value={state.name}
            handleChange={handleChange}
            label="name"
          />
          <InputBox
            name="profilePic"
            value={state.profile_pic}
            handleChange={handleChange}
            label="Profile Picture URL"
          />
          <InputBox
            name="whatsapp"
            value={state.whatsapp}
            handleChange={handleChange}
            label="Whatsapp Number with Country Code"
          />
          <InputBox
            name="telegram"
            value={state.telegram}
            handleChange={handleChange}
            label="Telegram Username"
          />
          <InputBox
            name="phone"
            value={state.phone}
            handleChange={handleChange}
            label="Phone Number with Country Code"
          />
          {error && (
            <AlertBox message={error} title="Message" severity={severity} />
          )}
          <ButtonBox type="submit" label="Update Profile" />
        </form>
        <Footer />
      </div>
    </WrapLoggedIn>
  );
}

export default ProfileCmp;
