import React from 'react';
import { Link } from 'react-router-dom';
import {
  NewspaperIcon,
  ArchiveBoxIcon,
  BoltIcon,
  TagIcon,
  BellAlertIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
const DashboardPage = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Articles</p>
            <p className="text-2xl font-bold text-blue-600">125</p>
          </div>
          <NewspaperIcon className="h-8 w-8 text-blue-400" />
        </div>

        {/* Drafts Card */}
        <Link to="/admin/articles/drafts" className="bg-gray-100 rounded-lg p-4 flex items-center justify-between hover:bg-gray-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500">Drafts</p>
            <p className="text-2xl font-bold text-yellow-600">8</p>
          </div>
          <ArchiveBoxIcon className="h-8 w-8 text-yellow-400" />
        </Link>
        {/* Breaking News Status Card */}
        <Link to="/admin/breaking-news" className="bg-gray-100 rounded-lg p-4 flex items-center justify-between hover:bg-gray-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500">Breaking News</p>
            <p className="text-2xl font-bold text-red-600">Active</p> {/* Dynamic status here */}
          </div>
          <BoltIcon className="h-8 w-8 text-red-400" />
        </Link>

        {/* Categories Count Card */}
        <Link to="/admin/categories" className="bg-gray-100 rounded-lg p-4 flex items-center justify-between hover:bg-gray-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500">Categories</p>
            <p className="text-2xl font-bold text-green-600">10</p>
          </div>
          <TagIcon className="h-8 w-8 text-green-400" />
        </Link>

        {/* Sponsors Count Card */}
        <Link to="/admin/sponsors" className="bg-gray-100 rounded-lg p-4 flex items-center justify-between hover:bg-gray-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500">Sponsors</p>
            <p className="text-2xl font-bold text-purple-600">5</p>
          </div>
          <BellAlertIcon className="h-8 w-8 text-purple-400" />
        </Link>

        <Link to="/admin/partners" className="bg-gray-100 rounded-lg p-4 flex items-center justify-between hover:bg-gray-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500">Partners</p>
            <p className="text-2xl font-bold text-indigo-600">3</p>
          </div>
          <UsersIcon className="h-8 w-8 text-indigo-400" />
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Activity</h3>
        <ul className="bg-gray-100 rounded-lg p-4">
          <li className="py-2 border-b border-gray-200 last:border-b-0 flex items-center space-x-4">
            <span className="text-sm text-gray-600">Article "Breaking News in Tech" published.</span>
            <span className="text-xs text-gray-400">5 minutes ago</span>
          </li>
          <li className="py-2 border-b border-gray-200 last:border-b-0 flex items-center space-x-4">
            <span className="text-sm text-gray-600">Draft "Political Analysis" saved.</span>
            <span className="text-xs text-gray-400">20 minutes ago</span>
          </li>
          <li className="py-2 border-b border-gray-200 last:border-b-0 flex items-center space-x-4">
            <span className="text-sm text-gray-600">New category "Science" created.</span>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </li>
         
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;