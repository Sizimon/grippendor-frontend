import React, { useState } from 'react';
const moment = require('moment')

const CustomDropdown = ({ options, selectedOption, onOptionSelect, formatDateTime }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option) => {
        onOptionSelect(option); 
        setIsOpen(false);
      };

    return (
        <div className='relative inline-blow w-64'>
            {/* Dropdown Button */}
            <div 
                className='bg-zinc-800 text-white p-3 rounded cursor-pointer'
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? selectedOption.name : 'Select and option'}
            </div>
            {/* Dropdown Options */}
            {isOpen && (
                <ul className='absolute z-10 bg-zinc-900 text-white w-full mt-1 rounded shadow-lg'>
                    {options.map((option) => (
                        <li
                        key={option.id}
                        className='p-3 hover:bg-zinc-800 cursor-pointer'
                        onClick={() => handleOptionClick(option)}
                        >
                            {option.name} - {formatDateTime(moment(option.event_date).unix())}
                        </li>
                    ))}

                </ul>
            )}
        </div>
    )
}

export default CustomDropdown;