"use server";

import config from "@/config/config";
import { cookies } from "next/headers";

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

  cookies().set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    domain: config.environment === "production" ? ".banfan.app" : undefined,
  });

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

  cookies().set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    domain: config.environment === "production" ? ".banfan.app" : undefined,
  });

  return data.user;
}
