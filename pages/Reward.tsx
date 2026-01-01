import React from 'react';
import { Layout } from '../components/Layout';
import { UserProfile } from '../types';
import { Gift, Coins, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  user: UserProfile;
}

export const Reward: React.FC<Props> = ({ user }) => {
  const [copied, setCopied] = useState(false);

  const formatNumber = (num?: number) => {
    return num ? new Intl.NumberFormat('id-ID').format(num) : '0';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Layout user={user} title="Rewards">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-amber-200 border-4 border-white">
              <Gift size={48} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-4">My Rewards</h2>
          <p className="text-slate-500 text-lg mb-8">Track your points and referral progress</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3">Referral Code</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-mono font-bold text-indigo-600 tracking-wider select-all cursor-pointer hover:text-indigo-700 transition-colors">
                  {user.referralCode || '-'}
                </div>
                <button
                  onClick={() => copyToClipboard(user.referralCode || '')}
                  className="p-2 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 rounded-xl transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3">Current Level</div>
              <div className="text-2xl font-bold text-slate-800">{user.level || 'Rookie'}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-3">Balance</div>
              <div className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-2">
                <Coins size={24} className="fill-amber-600 stroke-amber-700" />
                {formatNumber(user.balance)}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 max-w-2xl mx-auto">
            <div className="flex gap-3 items-start">
              <div className="text-indigo-600 mt-0.5">
                <Gift size={20} />
              </div>
              <div>
                <h4 className="font-bold text-indigo-800 mb-2">How to Earn Points</h4>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  Complete lessons, practice pronunciation, and refer friends to earn points. Use your referral code to invite others and get bonus rewards!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
