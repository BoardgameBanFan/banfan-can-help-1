"use server";

import config from "@/config/config";
import { cookies } from "next/headers";
import useUserStore from "@/stores/useUserStore";

export async function register({ username, email, password, confirmPassword }) {
  const response = await fetch(`${config.apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      confirmPassword,
    }),
  });

  if (response.status === 400) {
    throw new Error(await response.text());
  }

  if (!response.ok) {
    throw new Error("register api error");
  }

  const data = await response.json();

  loginHandler(data);

  return data.user;
}

export async function login({ email, password }) {
  const response = await fetch(`${config.apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("login api error");
  }

  const data = await response.json();

  loginHandler(data);

  return data.user;
}

function loginHandler({ token, user: { username, email } }) {
  cookies().set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    domain: config.environment === "production" ? ".banfan.app" : undefined,
  });
  useUserStore.setState({
    isLogin: true,
    name: username,
    email,
  });
}

// Add a new function to check if the token cookie exists
export async function checkToken() {
  const token = cookies().get("token");
  return !!token; // Returns true if token exists, false otherwise
}
