// import useSWR from 'swr';

// 模擬資料
const mockEvents = [
  {
    id: '67b0701b4d7b89bdea0e0d05',
    title: '我要玩東印度公司',
    host_at: '2025-02-15T10:44:43.325Z',
    place: {
      Name: '桌兔子',
      Address: '高雄市前金區和平路300號',
    },
    max_players: 4,
    attendees: null,
    host_by: {
      username: '高爾',
    },
    fee: 300,
  },
  {
    id: '67b0701b4d7b89bdea0e0d06',
    title: '卡卡頌馬拉松',
    host_at: '2025-02-16T14:00:00.000Z',
    place: {
      Name: '桌遊盒子',
      Address: '高雄市苓雅區中正二路175號',
    },
    max_players: 6,
    attendees: [1, 2], // 模擬已有2人報名
    host_by: {
      username: '小明',
    },
    fee: 250,
  },
  {
    id: '67b0701b4d7b89bdea0e0d07',
    title: '璀璨寶石新手團',
    host_at: '2025-02-17T09:30:00.000Z',
    place: {
      Name: '私房桌遊',
      Address: '高雄市鼓山區明倫路59號',
    },
    max_players: 5,
    attendees: [1], // 模擬已有1人報名
    host_by: {
      username: '阿華',
    },
    fee: 200,
  },
];

export function useEventList() {
  // 目前返回模擬資料，之後可以改為實際的 API 調用
  // const { data, error, isLoading } = useSWR('https://api.banfan.app/events');

  return {
    events: mockEvents,
    isLoading: false,
    error: null,
  };
}
