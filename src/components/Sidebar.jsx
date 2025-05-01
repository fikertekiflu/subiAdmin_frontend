import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  NewspaperIcon,
  PlusCircleIcon,
  ArchiveBoxIcon,
  BoltIcon,
  BellAlertIcon,
  UsersIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();

  const toggleSubMenu = (label) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    {
      label: 'Content',
      icon: NewspaperIcon,
      children: [
        { path: '/admin/articles', label: 'All Articles', icon: NewspaperIcon },
        { path: '/admin/articles/new', label: 'Add New Article', icon: PlusCircleIcon },
        { path: '/admin/breaking-news', label: 'Breaking News', icon: BoltIcon },
      ],
    },
    { path: '/admin/articles/drafts', label: 'Drafts', icon: ArchiveBoxIcon },
    {
      label: 'Announcements',
      icon: BellAlertIcon,
      children: [
        { path: '/admin/sponsors', label: 'Ads', icon: BellAlertIcon },
        { path: '/admin/partners', label: 'Partners', icon: UsersIcon },
      ],
    },
  ];

  return (
    <motion.div
      className="w-64 flex-shrink-0 transition-all duration-300 ease-in-out"
      style={{
        background: 'linear-gradient(to bottom right, #374151 0%, #111827 100%)', // bg-gradient-to-br from-gray-700 to-black equivalent
        borderRight: '1px solid #4b5563',
        color: '#e5e7eb',
      }}
    >
      <div className="p-6 flex items-center border-b border-gray-700">
        <span className="text-xl font-semibold text-white font-mono tracking-tight">Subitimes</span>
      </div>
      <nav className="mt-4 space-y-1">
        {navItems.map((item, index) => (
          <div key={index}>
            {item.children ? (
              <div>
                <motion.div
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors duration-200 rounded-md ${
                    openSubMenu === item.label || item.children.some(child => location.pathname.startsWith(child.path))
                      ? 'bg-gray-800 text-white' // Apply active style if submenu is open or a child is active
                      : 'hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => toggleSubMenu(item.label)}
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 223, 0, 0.1)', color: '#ffdb58' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="flex items-center">
                    {item.icon && <item.icon className="h-5 w-5 mr-3 text-gray-400" />}
                    <span className="text-sm font-medium">{item.label}</span>
                  </span>
                  <motion.div
                    animate={{ rotate: openSubMenu === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {openSubMenu === item.label ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </motion.div>
                </motion.div>
                <motion.div
                  className={`ml-4 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    openSubMenu === item.label ? 'max-h-96' : 'max-h-0'
                  }`}
                  style={{ marginLeft: '1rem' }}
                >
                  {item.children.map((child, childIndex) => (
                    <NavLink
                      key={childIndex}
                      to={child.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 flex items-center text-sm rounded-md transition-colors duration-200 ${
                          isActive
                            ? 'bg-amber-600 text-gray-900 font-semibold shadow-sm'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`
                      }
                      style={{ paddingLeft: '1.5rem' }}
                    >
                      {child.icon && <child.icon className="h-4 w-4 mr-2 text-gray-500" />}
                      <span className="truncate">{child.label}</span>
                    </NavLink>
                  ))}
                </motion.div>
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-3 flex items-center text-sm rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-amber-600 text-gray-900 font-semibold shadow-sm'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
                style={{ marginBottom: '0.25rem' }}
                exact
              >
                {item.icon && <item.icon className="h-5 w-5 mr-3 text-gray-400" />}
                <span style={{ fontSize: item.label === 'Dashboard' ? '1.1rem' : '1rem' }} className="truncate">
                  {item.label}
                </span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;