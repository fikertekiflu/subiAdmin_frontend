import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    NewspaperIcon,
    ArchiveBoxIcon,
    UsersIcon,
    BellAlertIcon,
    TagIcon,
    PlusIcon,
    ChartBarIcon,
    LightBulbIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import Lottie from 'react-lottie';
import loadingAnimation from '../assets/loading.json'; // Adjust path if needed

const DashboardPage = () => {
    const [totalArticles, setTotalArticles] = useState(0);
    const [draftsCount, setDraftsCount] = useState(0);
    const [sponsorsCount, setSponsorsCount] = useState(0);
    const [partnersCount, setPartnersCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [postsTrendData, setPostsTrendData] = useState([10, 12, 11, 14, 13, 15, 16]);
    const [draftsTrendData, setDraftsTrendData] = useState([5, 7, 6, 5, 4, 6, 5]);
    const [sponsorsTrendData, setSponsorsTrendData] = useState([20, 22, 21, 23, 24, 22, 25]);
    const [partnersTrendData, setPartnersTrendData] = useState([8, 9, 8, 10, 11, 10, 12]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [articlesRes, sponsorsRes, partnersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/article'),
                    axios.get('http://localhost:5000/api/sponsor'),
                    axios.get('http://localhost:5000/api/partner'),
                ]);

                const articles = articlesRes.data.data;
                setTotalArticles(articles.length);
                setDraftsCount(articles.filter((article) => article.status === 'draft').length);
                setSponsorsCount(sponsorsRes.data.data.length);
                setPartnersCount(partnersRes.data.data.length);
            } catch (err) {
                console.error('Error fetching dashboard data:', err.response?.data || err.message);
                setError('Failed to fetch dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleAddNewArticle = () => {
        navigate('/admin/articles/new');
    };

    const generateSVGPath = (data, color, width = 100, height = 30) => {
        if (!data || data.length < 2) return '';

        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const range = maxValue - minValue;
        const stepX = width / (data.length - 1);

        let path = `M0 ${height - (data[0] - minValue) / (range === 0 ? 1 : range) * height}`;

        for (let i = 1; i < data.length; i++) {
            const y = height - (data[i] - minValue) / (range === 0 ? 1 : range) * height;
            path += ` L${i * stepX} ${y}`;
        }

        return `<path d="${path}" stroke="${color}" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />`;
    };

    const OverviewCard = ({ label, value, trendData, color, icon }) => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
            <div className={`px-6 py-5 flex items-center space-x-5 bg-${color}-50 bg-opacity-10`}>
                <div className={`p-3 rounded-md text-white bg-${color}-400 shadow`}>
                    {React.cloneElement(icon, { className: 'h-6 w-6' })}
                </div>
                <p className="text-lg font-medium text-gray-800">{label}</p>
            </div>
            <div className="p-6 flex flex-col justify-center items-start">
                <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
                <div className="w-full relative overflow-hidden h-8">
                    <svg viewBox={`0 0 100 30`} className="absolute inset-0 w-full h-full opacity-80">
                        {generateSVGPath(trendData, color)}
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-20"></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">Last 7 days trend</p>
            </div>
        </div>
    );

    const QuickAction = ({ label, icon, onClick, color = 'amber' }) => (
        <button
            onClick={onClick}
            className={`relative overflow-hidden inline-flex items-center px-5 py-3 rounded-md font-medium text-white shadow-sm transition-all duration-300
                            bg-${color}-500 hover:bg-${color}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
        >
            <span className="absolute left-0 top-0 h-full w-1 bg-white bg-opacity-20"></span>
            {React.cloneElement(icon, { className: '-ml-1 mr-2 h-5 w-5' })}
            <span className="text-sm">{label}</span>
            <span className="absolute right-0 top-0 h-full w-1 bg-white bg-opacity-20"></span>
        </button>
    );

    const DashboardHeader = () => (
        <div className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    <span className="text-amber-500">Admin</span> Hub
                </h2>
                <p className="mt-1 text-md text-gray-500">Your central command for managing content and community.</p>
            </div>
            <div className="flex items-center space-x-3">
                <button className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Analytics
                </button>
                <button className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
                    Suggestions
                </button>
                <Link to="/admin/profile" className="relative inline-flex items-center px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <UserCircleIcon className="h-7 w-7" />
                </Link>
            </div>
        </div>
    );

    const loadingOptions = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Lottie options={loadingOptions} height={180} width={180} />
                <p className="text-gray-500 text-lg ml-6 italic">Summoning the data spirits...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="bg-white shadow-lg rounded-xl p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938-4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 12c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-500 text-lg mb-4">Hiccups occurred: {error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                                    transition-all duration-300"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-indigo-100 bg-opacity-80 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <DashboardHeader />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
                    <OverviewCard
                        label="Published Articles"
                        value={totalArticles}
                        trendData={postsTrendData}
                        color="blue"
                        icon={<NewspaperIcon />}
                    />
                    <OverviewCard
                        label="Awaiting Review"
                        value={draftsCount}
                        trendData={draftsTrendData}
                        color="amber"
                        icon={<ArchiveBoxIcon />}
                    />
                    <OverviewCard
                        label="Supporting Sponsors"
                        value={sponsorsCount}
                        trendData={sponsorsTrendData}
                        color="purple"
                        icon={<BellAlertIcon />}
                    />
                    <OverviewCard
                        label="Strategic Partners"
                        value={partnersCount}
                        trendData={partnersTrendData}
                        color="green"
                        icon={<UsersIcon />}
                    />
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border border-gray-100">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">
                            <span className="text-amber-500">Quick</span> Access
                        </h3>
                        <span className="text-gray-500 text-sm italic">Your shortcuts to key actions.</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <QuickAction label="Compose Article" icon={<PlusIcon />} onClick={handleAddNewArticle} color="amber" />
                        <Link
                            to="/admin/categories"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300"
                        >
                            <TagIcon className="-ml-1 mr-2 h-5 w-5" />
                            Manage Tags
                        </Link>
                        <Link
                            to="/admin/articles/drafts"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300"
                        >
                            <ArchiveBoxIcon className="-ml-1 mr-2 h-5 w-5" />
                            Review Queue
                        </Link>
                        <Link
                            to="/admin/sponsors"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300"
                        >
                            <BellAlertIcon className="-ml-1 mr-2 h-5 w-5" />
                            Sponsor Relations
                        </Link>
                        <Link
                            to="/admin/partners"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300"
                        >
                            <UsersIcon className="-ml-1 mr-2 h-5 w-5" />
                            Partner Network
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            <span className="text-amber-500">Focus</span> Insights
                        </h3>
                        <span className="text-gray-500 text-sm italic">A curated view of your key activities.</span>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                        <li className="mb-2">
                            <span className="font-semibold text-amber-500">Content Pipeline:</span> Track the progress of articles from ideation to publication.
                        </li>
                        <li className="mb-2">
                            <span className="font-semibold text-amber-500">Engagement Metrics:</span> Monitor reader interaction and feedback on your latest content.
                        </li>
                        <li className="mb-2">
                            <span className="font-semibold text-amber-500">Community Growth:</span> Observe the expansion of your partner and sponsor network.
                        </li>
                        <li>
                            <span className="font-semibold text-amber-500">System Health:</span> Stay informed about any alerts or issues requiring your attention.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;