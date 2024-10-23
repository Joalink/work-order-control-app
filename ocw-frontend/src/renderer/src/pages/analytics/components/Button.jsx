import React from 'react'

export default function Button(id, onClick, text) {
    return (
        <button
            id={id}
            className="bg-blue-500 text-white p-2.5 rounded hover:bg-blue-700 transition-colors duration-300"
            onClick={onClick}
        >
            {text}
        </button>
    );
};
