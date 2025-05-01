import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import AllArticlesPage from './ArticleMangement/AllArticlesPage';
import AddNewArticlePage from './ArticleMangement/AddNewArticlePage';
import DraftsPage from './ArticleMangement/DraftsPage'; 
import SponsorsPage from './SponsorsPage';
import BreakingNewsPage from './BreakingNewsPage';
import PartnerPage from './PartnerPage';
import Navbar from '../components/Navbar'; 
const MainContent = () => (
  <div className="flex-1 bg-gray-100 flex flex-col">
    <Navbar /> 
    <div className="p-6 overflow-auto">
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/articles/new" element={<AddNewArticlePage />} />
        <Route path="/articles" element={<AllArticlesPage />} />
        <Route path="/articles/drafts" element={<DraftsPage />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="/partners" element={<PartnerPage />} /> 
        <Route path="/breaking-news" element={<BreakingNewsPage />} />
      </Routes>
    </div>
  </div>
);
export default MainContent;
