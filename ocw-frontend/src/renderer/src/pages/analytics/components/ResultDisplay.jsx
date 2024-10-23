import React from 'react'

export default function ResultDisplay({id, text}) {
    return (
        <div
            id={id}
            className="mb-4 text-sm text-gray-900 text-center"
        >
            {text}
        </div>
    );
};
