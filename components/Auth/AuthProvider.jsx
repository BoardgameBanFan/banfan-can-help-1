"use client";

import config from "@/config/config";
import useUserStore from "@/store/useUserStore";
import { useEffect } from "react";

function AuthProvider({ children }) {
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    async function getUserData() {
      const response = await fetch(`${config.apiUrl}/validate`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
      }
    }

    getUserData();
  }, []);

  return children;
}

export default AuthProvider;
