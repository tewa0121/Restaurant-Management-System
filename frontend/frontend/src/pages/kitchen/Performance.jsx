// src/pages/kitchen/Performance.jsx
import React from 'react';
import { TrendingUp, Award, Clock, CheckCircle2 } from 'lucide-react';

export default function Performance() {
  const chefScores = [
    { id: 1, name: 'Chef Alex', role: 'Lead Chef', completedOrders: 28, avgTime: '14 min', accuracy: '98.5%' },
    { id: 2, name: 'Chef Sarah', role: 'Sous Chef', completedOrders: 24, avgTime: '16 min', accuracy: '96.2%' },
    { id: 3, name: 'Chef Daniel', role: 'Line Cook', completedOrders: 19, avgTime: '19 min', accuracy: '95.0%' },
    { id: 4, name: 'Chef Michael', role: 'Prep Cook', completedOrders: 14, avgTime: '21 min', accuracy: '93.4%' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-500" /> Kitchen Staff Performance Scorecard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Individual productivity and speed metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {chefScores.map(chef => (
          <div key={chef.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{chef.name}</h4>
                <p className="text-[10px] text-slate-400">{chef.role}</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Completed Orders:</span>
                <span className="font-bold text-slate-800 dark:text-white">{chef.completedOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Prep Time:</span>
                <span className="font-bold text-emerald-600">{chef.avgTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Accuracy Rate:</span>
                <span className="font-bold text-blue-600">{chef.accuracy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}