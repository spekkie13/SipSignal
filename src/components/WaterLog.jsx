import React from 'react'

export default function WaterLog({ onLog, disabled }) {
    const sizes = [
        { label: 'Small', ml: 100 },
        { label: 'Medium', ml: 250 },
        { label: 'Large', ml: 500 },
    ]

    return (
        <div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 text-center transition-colors">
                {disabled ? '🎯 Goal met — great job!' : 'How much did you drink just now?'}
            </div>
            <div className="flex space-x-2">
                {sizes.map((size) => {
                    // choose the proper FontAwesome class
                    const iconClass =
                        size.ml === 100
                            ? 'fas fa-mug-hot'
                            : size.ml === 250
                                ? 'fas fa-wine-glass'
                                : 'fas fa-wine-bottle'

                    return (
                        <button
                            key={size.ml}
                            onClick={() => !disabled && onLog(size.ml)}
                            disabled={disabled}
                            className={`flex-1 flex flex-col items-center py-3 px-2 rounded-2xl border text-center shadow-sm transition transform hover:scale-105 ${
                                disabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white dark:bg-[#2a2a2a] border-gray-300 hover:bg-[#F0F8FC] dark:hover:bg-[#333333] text-[#1B2E4B] dark:text-white'
                            }`}
                        >
                            <i
                                className={`${iconClass} text-2xl mb-1 transition-colors`}
                                aria-hidden="true"
                            />
                            <div className="font-semibold">{size.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                                ({size.ml}ml)
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
