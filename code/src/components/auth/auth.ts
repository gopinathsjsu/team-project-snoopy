export const login = async (username: string, password: string) => {
  const response = await fetch("/api/auth2/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  // Store token
  localStorage.setItem("token", data.data.token);
  localStorage.setItem("userInfo", JSON.stringify(data.data.userInfo));
};

export const register = async ({
  username,
  password,
  email,
  name,
}: {
  username: string;
  password: string;
  email: string;
  name: string;
}) => {
  const response = await fetch("/api/auth2/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
      username,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
};
