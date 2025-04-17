export interface UserInfo {
  email: string;
  name: string;
}

export interface UserInfoModalProps {
  open: boolean;
  onSubmit: (userInfo: UserInfo) => Promise<void>;
}

export interface UserInfoState {
  userInfo: UserInfo | null;
  showUserInfoModal: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserInfoActions {
  updateUserInfo: (userInfo: UserInfo) => Promise<void>;
  clearUserInfo: () => void;
}

export type UseUserInfoReturn = UserInfoState & UserInfoActions;