'use client';

/**
 * Counter 組件示例
 * 用於展示如何使用 Zustand store
 *
 * 這個組件展示了：
 * 1. 如何訂閱 store 中的狀態
 * 2. 如何調用 store 中的方法
 * 3. store 的響應式更新
 */

import React from 'react';
import useCounterStore from '@/stores/useCounterStore';
import styles from './CounterExample.module.css';

export default function CounterExample() {
  const { count, increment, decrement, reset, incrementBy } = useCounterStore();

  return (
    <div className={styles.container}>
      <h2>Counter Example</h2>
      <p className={styles.count}>Count: {count}</p>
      <div className={styles.buttons}>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={reset}>Reset</button>
        <button onClick={() => incrementBy(5)}>+5</button>
      </div>
    </div>
  );
}
