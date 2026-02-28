import { useEffect, useRef, useState } from "react";
import { Trophy, Star, TrendingUp, Crown } from "lucide-react";
import gsap from "gsap";
import userService from "../services/userService";
import Loading from "../components/common/Loading";
import Pagination from "../components/common/Pagination";
import useAuthStore from "../context/AuthContext";

const LIMIT = 20;

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState({ data: [], total: 0, page: 1, totalPage: 1 });
  const pageRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    userService.getLeaderboard(page, LIMIT).then((res) => {
      setLeaderboardData(res);
      setLoading(false);
    });
  }, [page]);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".lb-header", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
      if (page === 1) {
        gsap.fromTo(".lb-podium", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)", delay: 0.2 });
      }
      gsap.fromTo(".lb-row", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out", delay: 0.4 });
    }, pageRef);
    return () => ctx.revert();
  }, [loading, page]);

  const allUsers = leaderboardData.data;
  const isFirstPage = page === 1;
  const top3 = isFirstPage ? allUsers.slice(0, 3) : [];
  const listUsers = isFirstPage ? allUsers.slice(3) : allUsers;
  const myRank = allUsers.findIndex((u) => u._id === user?.id);
  const globalRank = (page - 1) * LIMIT + myRank + 1;

  if (loading) return <Loading />;
  if (allUsers.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400 font-bold">
      No data available
    </div>
  );

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="lb-header mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
            <p className="text-sm text-gray-400 font-medium">
              {leaderboardData.total} players ranked
            </p>
          </div>
        </div>
      </div>

      {/* Podium - only on page 1 with at least 3 users */}
      {isFirstPage && top3.length >= 3 && (
        <div className="lb-podium grid grid-cols-3 gap-3 mb-8">
          {/* 2nd place */}
          <div className="flex flex-col items-center pt-6">
            <div className="w-16 h-16 bg-linear-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg mb-2">
              <span className="text-2xl font-bold text-white">{top3[1].username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center -mt-4 mb-1 border-2 border-white shadow-sm">
              <span className="text-xs font-bold text-white">2</span>
            </div>
            <p className="text-xs font-bold text-gray-800 text-center truncate w-full">{top3[1].username.split(" ")[0]}</p>
            <p className="text-[10px] font-bold text-gray-400">{top3[1].stats.totalXP.toLocaleString()} XP</p>
          </div>

          {/* 1st place */}
          <div className="flex flex-col items-center">
            <Crown className="w-6 h-6 text-amber-400 mb-1" />
            <div className="w-20 h-20 bg-linear-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl mb-2 ring-4 ring-amber-200">
              <span className="text-3xl font-bold text-white">{top3[0].username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center -mt-4 mb-1 border-2 border-white shadow-sm">
              <span className="text-xs font-bold text-white">1</span>
            </div>
            <p className="text-xs font-bold text-gray-800 text-center truncate w-full">{top3[0].username.split(" ")[0]}</p>
            <p className="text-[10px] font-bold text-amber-500">{top3[0].stats.totalXP.toLocaleString()} XP</p>
          </div>

          {/* 3rd place */}
          <div className="flex flex-col items-center pt-8">
            <div className="w-14 h-14 bg-linear-to-br from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg mb-2">
              <span className="text-xl font-bold text-white">{top3[2].username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center -mt-4 mb-1 border-2 border-white shadow-sm">
              <span className="text-xs font-bold text-white">3</span>
            </div>
            <p className="text-xs font-bold text-gray-800 text-center truncate w-full">{top3[2].username.split(" ")[0]}</p>
            <p className="text-[10px] font-bold text-gray-400">{top3[2].stats.totalXP.toLocaleString()} XP</p>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {listUsers.map((u, idx) => {
          const rank = isFirstPage ? idx + 4 : (page - 1) * LIMIT + idx + 1;
          const isMe = u._id === user?.id;
          return (
            <div
              key={u._id}
              className={`lb-row flex items-center gap-4 rounded-2xl p-4 border-2 shadow-sm transition ${
                isMe ? "bg-orange-50 border-orange-200" : "bg-white border-gray-100 hover:border-orange-200"
              }`}
            >
              <span className="w-7 text-center text-xs font-bold text-gray-400">#{rank}</span>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-orange-500">{u.username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {u.username}{isMe && <span className="text-orange-500"> (You)</span>}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-sm font-bold text-gray-800">{u.stats.totalXP.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPage={leaderboardData.totalPage} onChange={setPage} />

      {/* Your position card */}
      {myRank !== -1 && (
        <div className="mt-6 bg-linear-to-r from-orange-500 to-amber-500 rounded-2xl p-4 shadow-lg shadow-orange-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Your Position</p>
              <p className="text-xs text-orange-100 font-medium">Keep practicing to climb the ranks!</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">#{globalRank}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
