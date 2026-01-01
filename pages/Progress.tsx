import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { UserProfile } from '../types';
import { TrendingUp, Smartphone, ArrowLeft } from 'lucide-react';

interface Props {
  user: UserProfile;
}

export const Progress: React.FC<Props> = ({ user }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Trigger untuk update progress bar saat local storage berubah
  const [progressUpdateTrigger, setProgressUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleStorageUpdate = () => {
        setProgressUpdateTrigger(prev => prev + 1);
    };
    window.addEventListener('storage_update_pronunciation', handleStorageUpdate);
    return () => window.removeEventListener('storage_update_pronunciation', handleStorageUpdate);
  }, []);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const getProgressData = (level: string) => {
    const base = level.charCodeAt(1);

    let pronValue = (base * 2) % 100;

    if (level === 'A1') {
      const savedPron = localStorage.getItem('geuwat_local_progress_pronunciation');
      if (savedPron) {
        const scores = JSON.parse(savedPron);
        const values = Object.values(scores) as number[];
        if (values.length > 0) {
          const sum = values.reduce((a, b) => a + b, 0);
          pronValue = Math.round(sum / 4);
        } else {
          pronValue = 0;
        }
      } else {
        pronValue = 0;
      }
    }

    return [
      { subject: 'Pronunciation', value: pronValue, isLocal: level === 'A1' },
      { subject: 'Vocabulary', value: (base * 3) % 100 },
      { subject: 'Grammar', value: (base * 4) % 100 },
      { subject: 'Speaking', value: (base * 5) % 100 },
    ];
  };

  return (
    <Layout user={user} title="Progress">
      <div className="max-w-4xl mx-auto">
        {!selectedLevel ? (
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-200 mx-auto mb-6">
                <TrendingUp size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Learning Progress</h2>
              <p className="text-slate-500 text-lg">Select your English level to view detailed statistics:</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {levels.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-slate-600 transition-all duration-200 text-2xl shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-8 duration-300">
            <button
              onClick={() => setSelectedLevel(null)}
              className="mb-8 text-sm font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={16} /> Change Level
            </button>

            <div className="flex items-center justify-between mb-10 p-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl text-white shadow-lg shadow-emerald-200">
              <div>
                <p className="text-xs opacity-80 uppercase font-bold tracking-wider mb-2">Current Level</p>
                <h3 className="font-bold text-4xl">{selectedLevel}</h3>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <TrendingUp size={32} className="text-white" />
              </div>
            </div>

            <div className="space-y-6">
              {getProgressData(selectedLevel).map((stat) => (
                <div key={stat.subject} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-700 flex items-center gap-3 text-lg">
                      {stat.subject}
                      {stat.isLocal && (
                        <span className="bg-slate-100 p-1 rounded text-slate-400" title="Saved on this device">
                          <Smartphone size={14} />
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-emerald-600 text-xl">{stat.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
