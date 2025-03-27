"use client";
import { useState, useEffect } from "react";
import { UserInfo, UseUserInfoReturn } from "@/types/user";

const USER_INFO_KEY = 'userInfo';

export function useUserInfo(): UseUserInfoReturn {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserInfo = () => {
      try {
        setIsLoading(true);
        const storedUserInfo = localStorage.getItem(USER_INFO_KEY);
        
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          if (isValidUserInfo(parsedUserInfo)) {
            setUserInfo(parsedUserInfo);
            setShowUserInfoModal(false);
          } else {
            throw new Error('Invalid user info format');
          }
        } else {
          setShowUserInfoModal(true);
        }
      } catch (err) {
        console.error('Failed to load user info:', err);
        setError(err instanceof Error ? err.message : '載入使用者資料失敗');
        setShowUserInfoModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  const updateUserInfo = async (newUserInfo: UserInfo) => {
    try {
      setIsLoading(true);
      setError(null);

      // 驗證資料格式
      if (!isValidUserInfo(newUserInfo)) {
        throw new Error('Invalid user info format');
      }

      // 儲存到 localStorage
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(newUserInfo));
      
      setUserInfo(newUserInfo);
      setShowUserInfoModal(false);
    } catch (err) {
      console.error('Failed to update user info:', err);
      setError(err instanceof Error ? err.message : '更新使用者資料失敗');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearUserInfo = () => {
    try {
      localStorage.removeItem(USER_INFO_KEY);
      setUserInfo(null);
      setShowUserInfoModal(true);
    } catch (err) {
      console.error('Failed to clear user info:', err);
      setError(err instanceof Error ? err.message : '清除使用者資料失敗');
    }
  };

  return {
    userInfo,
    showUserInfoModal,
    isLoading,
    error,
    updateUserInfo,
    clearUserInfo,
  };
}

// Helper function to validate UserInfo object
function isValidUserInfo(data: any): data is UserInfo {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.email === 'string' &&
    typeof data.name === 'string' &&
    data.email.trim() !== '' &&
    data.name.trim() !== ''
  );
}
