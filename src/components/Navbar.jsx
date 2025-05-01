import React from 'react';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  return (
    <div className="bg-white shadow-md py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search..."
          />
        </div>

      </div>
      <div className="flex items-center">
        {/* User profile icon and dropdown */}
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <UserCircleIcon className="h-8 w-8 text-gray-500" />
        </button>
        {/* Add user dropdown menu if needed */}
      </div>
    </div>
  );
};

export default Navbar;