"use client";
import { useState } from "react";
import { DialogModal } from "@/components/DialogModal";
import { UserInfo, UserInfoModalProps } from "@/types/user";

export function UserInfoModal({ open, onSubmit }: UserInfoModalProps) {
  const [formData, setFormData] = useState<UserInfo>({
    email: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof UserInfo, string>>>({});

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof UserInfo, string>> = {};

    if (!formData.email.trim()) {
      errors.email = "請輸入 Email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "請輸入有效的 Email 格式";
    }

    if (!formData.name.trim()) {
      errors.name = "請輸入暱稱";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗，請重試");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogModal
      open={open}
      onClose={() => {}} // 不允許關閉
      title="請輸入您的資料"
      maxWidth="xs"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                setValidationErrors(prev => ({ ...prev, email: undefined }));
                setError(null);
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.email 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300"
              }`}
              placeholder="your@email.com"
              required
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              暱稱
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                setValidationErrors(prev => ({ ...prev, name: undefined }));
                setError(null);
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.name 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300"
              }`}
              placeholder="您的暱稱"
              required
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-full text-white bg-[#2E6999] hover:bg-[#245780] transition-colors ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "儲存中..." : "確認"}
        </button>
      </form>
    </DialogModal>
  );
}
