import React from 'react';

export const SearchInput = () => {
    return (
        <div className="relative w-full max-w-[600px]">
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder='Search...'
                    className='w-full pl-4 py-2 rounded-full border focus:outline-none focus:border-blue-100'
                />
            </div>
        </div>
    )
}