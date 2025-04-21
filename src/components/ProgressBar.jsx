import React from 'react'

export default function ProgressBar({ total, waterGoal }) {
    const progress = Math.min((total / waterGoal) * 100, 100)
    const goalReached = total >= waterGoal

    return (
        <div className="pt-4 space-y-1">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 transition-colors">
                <span>{goalReached ? '🥳 Goal Reached!' : 'Daily Goal:'}</span>
                <span>
          {(total / 1000).toFixed(2)}L / {(waterGoal / 1000).toFixed(2)}L
        </span>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 rounded-full ${
                        goalReached ? 'bg-green-400 dark:bg-green-500' : 'bg-[#94D7A2]'
                    }`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    )
}
