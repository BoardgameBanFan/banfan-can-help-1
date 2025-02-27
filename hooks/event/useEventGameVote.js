import { mutate } from 'swr';

export function useEventGameVote() {
  const voteGame = async (eventId, gameId, payload) => {
    try {
      const response = await fetch(`https://api.banfan.app/event/${eventId}/games/${gameId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_interested: payload.is_interested,
          email: payload.email,
          name: payload.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      // 投票成功後重新獲取遊戲列表
      await mutate(`https://api.banfan.app/event/${eventId}/games`);

      return true;
    } catch (error) {
      console.error('Vote failed:', error);
      return false;
    }
  };

  return { voteGame };
}
