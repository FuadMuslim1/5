import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { UserProfile } from '../types';
import { BookOpen, HelpCircle, ArrowLeft } from 'lucide-react';

interface Props {
  user: UserProfile;
}

export const Tutorial: React.FC<Props> = ({ user }) => {
  const [viewingTutorial, setViewingTutorial] = useState<any | null>(null);

  const tutorialItems = [
    {
        id: 1,
        title: 'Cara Melihat Progress',
        desc: 'Klik menu "View Progress" lalu pilih level bahasa inggris Anda (A1-C2).',
        steps: [
            'Buka Sidebar (Menu kiri).',
            'Klik menu "View Progress" (icon grafik).',
            'Pilih Level Bahasa Inggris Anda.',
            'Lihat grafik kemajuan belajar Anda.'
        ]
    },
    {
        id: 2,
        title: 'Cara Mengklaim Reward',
        desc: 'Kumpulkan poin dari latihan soal dan tukarkan di menu "Reward".',
        steps: [
            'Pastikan Anda sudah login dan memiliki poin.',
            'Buka menu "Rewards" di sidebar.',
            'Lihat total poin Anda.',
            'Hubungi admin jika poin belum masuk.'
        ]
    },
  ];

  return (
    <Layout user={user} title="Tutorial">
      <div className="max-w-4xl mx-auto">
        {!viewingTutorial ? (
          <div className="py-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-200 mx-auto mb-6">
                <BookOpen size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Help & Tutorials</h2>
              <p className="text-slate-500 text-lg">Learn how to use the app effectively</p>
            </div>

            <div className="space-y-4">
              {tutorialItems.map((tut) => (
                <button
                  key={tut.id}
                  onClick={() => setViewingTutorial(tut)}
                  className="w-full text-left bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-blue-100 hover:shadow-lg transition-all group duration-300"
                >
                  <h5 className="font-bold text-slate-800 flex items-center gap-3 mb-2 group-hover:text-blue-600 transition-colors">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <BookOpen size={20} />
                    </div>
                    {tut.title}
                  </h5>
                  <p className="text-sm text-slate-500 leading-relaxed pl-12">
                    {tut.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-8 duration-300 py-8">
            <button
              onClick={() => setViewingTutorial(null)}
              className="mb-8 text-sm font-bold text-slate-400 hover:text-blue-600 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={16} /> Back to List
            </button>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <h3 className="font-bold text-2xl text-slate-800 mb-3 relative z-10">{viewingTutorial.title}</h3>
              <p className="text-slate-500 mb-8 relative z-10">{viewingTutorial.desc}</p>

              <div className="space-y-5 relative z-10">
                {viewingTutorial.steps?.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-blue-200">
                      {idx + 1}
                    </span>
                    <span className="text-slate-600 font-medium pt-1">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-3 items-start">
              <div className="text-blue-600 mt-0.5">
                <HelpCircle size={20} />
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                Jika Anda mengalami kendala teknis, silakan hubungi admin via WhatsApp untuk bantuan lebih lanjut.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
