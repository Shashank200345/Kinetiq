"use client";

import { Star, MessageSquare } from "lucide-react";

export default function DriverRatingsPage() {
  const reviews = [
    { id: 1, customer: "Aayush S.", rating: 5, date: "Yesterday", comment: "Very polite driver. Smooth driving." },
    { id: 2, customer: "Sumanth D.", rating: 5, date: "3 days ago", comment: "Great trip." },
    { id: 3, customer: "Emily R.", rating: 4, date: "1 week ago", comment: "Car was clean, but AC was a bit slow." },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Your Ratings</h1>
          <p className="text-sm text-slate-500 mt-1">See what passengers are saying about you</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-center text-white shadow-md relative overflow-hidden">
        <h2 className="text-slate-400 font-medium mb-2 relative z-10">Current Rating</h2>
        <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
          <span className="text-5xl font-bold">4.89</span>
          <Star className="h-8 w-8 text-green-400 fill-green-400" />
        </div>
        <p className="text-sm text-slate-300 relative z-10">Based on 145 lifetime trips</p>
        
        {/* Decorative background */}
        <div className="absolute top-0 left-0 p-8 opacity-[0.03]">
          <Star className="w-48 h-48" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Recent Feedback</h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded">Last 30 days</span>
        </div>
        <div className="divide-y divide-slate-100">
          {reviews.map(review => (
            <div key={review.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-800">{review.customer}</p>
                  <p className="text-xs text-slate-500">{review.date}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? "text-green-500 fill-green-500" : "text-slate-200"}`} 
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3 text-sm text-slate-600 italic relative">
                  <MessageSquare className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <p>"{review.comment}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
