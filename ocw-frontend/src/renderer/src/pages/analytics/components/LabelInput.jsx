import React from "react";

export default function LabelInput({ label, id, value, onChange, type = 'number' }) {
    return (
        <div className="mb-[15px]">
            <label className="block mb-[5px] text-[0.9rem] text-gray-600" htmlFor={id}>
                {label}
            </label>
            <input 
                type={type}
                id={id}
                value={value}              
                onChange={onChange}        
                className="border rounded w-full p-2.5 text-base transition-colors duration-300" 
            />
        </div>
    );
};