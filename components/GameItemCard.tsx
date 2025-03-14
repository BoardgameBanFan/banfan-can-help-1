import React from 'react';

export function GameItemCard({gameWithAddUser, canVote = true, handleVoteClick}: any) {
    const {_id, game, add_by, vote_by} = gameWithAddUser
    const getUserVoteStatus = voteBy => {
        const userInfo = localStorage.getItem('userVoteInfo');
        if (!userInfo) return null;

        const {email} = JSON.parse(userInfo);
        // 確保比對時使用小寫
        const userVote = voteBy?.find(vote => vote.email.toLowerCase() === email.toLowerCase());

        if (!userVote) return null;

        return {
            hasVoted: true,
            isInterested: userVote.is_interested,
        };
    };
    const voteStatus = getUserVoteStatus(vote_by);
    return (
        <div key={_id} className="flex p-3 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 mr-3 bg-gray-100 rounded overflow-hidden">
                <img
                    src={game?.thumbnail}
                    alt={game?.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1">
                <h3 className="font-semibold">{game?.name}</h3>
                <div className="text-xs text-gray-600 space-y-1">
                    {/*<p className="line-clamp-2">{gameItem.description}</p>*/}
                    {/*<p>*/}
                    {/*    遊戲人數：{gameItem.min_player}-{gameItem.max_player} 人*/}
                    {/*</p>*/}
                    <p className="text-gray-500">Nominated by {add_by}</p>
                    {vote_by && (
                        <div className="flex items-center gap-2">
                            <p className="text-gray-500">
                                {vote_by.length} vote{vote_by.length > 1 ? 's' : ''}
                                {vote_by.some(vote => vote.is_interested) && (
                                    <span className="text-green-600 ml-1">
                                  ({vote_by.filter(vote => vote.is_interested).length} interested)
                                </span>
                                )}
                            </p>
                            {voteStatus && (
                                <span
                                    className={`text-xs px-2 py-0.5 rounded ${
                                        voteStatus.isInterested
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                {voteStatus.isInterested ? '有興趣' : '沒興趣'}
                              </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {canVote && (
                <button
                    className={`py-1 px-4 rounded self-center ml-2 transition-colors duration-200 bg-[#2E6999] hover:bg-[#245780] text-white'`}
                    onClick={() => handleVoteClick(_id)}

                >
                    投票
                </button>
            )}
        </div>
    );
}
