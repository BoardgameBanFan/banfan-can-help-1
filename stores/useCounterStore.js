/**
 * Counter Store Example
 * 這是一個使用 Zustand 的簡單計數器 Store 示例
 * 展示了 Zustand 的基本用法，包括：
 * - 狀態管理
 * - 操作方法
 * - 參數傳遞
 */

import { create } from "zustand";

const useCounterStore = create(set => ({
  // 狀態
  count: 0,

  // 操作方法
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementBy: amount => set(state => ({ count: state.count + amount })),
}));

/**
 * 使用方式：
 * import useCounterStore from '@/stores/useCounterStore';
 *
 * function MyComponent() {
 *   const { count, increment, reset } = useCounterStore();
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={increment}>Add</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 */

export default useCounterStore;
