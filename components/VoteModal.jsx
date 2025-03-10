import React, { useState } from 'react';

export function VoteModal({ onSubmit, onClose }) {
  // 從 localStorage 獲取已存在的資料
  const existingData = React.useMemo(() => {
    const stored = localStorage.getItem('userVoteInfo');
    return stored ? JSON.parse(stored) : null;
  }, []);

  const [formData, setFormData] = useState({
    name: existingData?.name || '',
    email: existingData?.email || '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = e => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = '請輸入姓名';
    }
    if (!formData.email.trim()) {
      newErrors.email = '請輸入 Email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '請輸入有效的 Email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save to localStorage with consistent format
    const userInfo = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(), // 統一轉換為小寫
    };

    localStorage.setItem('userVoteInfo', JSON.stringify(userInfo));
    onSubmit(userInfo);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">請輸入您的資料</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入姓名"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入 Email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2E6999] hover:bg-[#245780] text-white rounded-md transition-colors duration-200"
            >
              確認
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
