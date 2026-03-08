"use client";

import { Star, MessageSquare } from "lucide-react";

export default function RatingsPage() {
  const reviews = [
    { id: 1, driver: "Ramesh K.", rating: 5, date: "2 days ago", comment: "Very polite passenger. Was ready at pickup location." },
    { id: 2, driver: "Suresh S.", rating: 5, date: "1 week ago", comment: "Great trip." },
    { id: 3, driver: "Amit P.", rating: 4, date: "2 weeks ago", comment: "" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Ratings</h1>
          <p className="text-sm text-gray-500 mt-1">See what drivers are saying about you</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-center text-white shadow-md relative overflow-hidden">
        <h2 className="text-slate-400 font-medium mb-2 relative z-10">Current Rating</h2>
        <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
          <span className="text-5xl font-bold">4.92</span>
          <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
        </div>
        <p className="text-sm text-slate-300 relative z-10">Based on 45 lifetime trips</p>
        
        {/* Decorative background */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Star className="w-48 h-48" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent Feedback</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {reviews.map(review => (
            <div key={review.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{review.driver}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} 
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-3 text-sm text-gray-600 italic relative">
                  <MessageSquare className="h-5 w-5 text-gray-400 flex-shrink-0" />
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
