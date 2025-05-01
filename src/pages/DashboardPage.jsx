import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    NewspaperIcon,
    ArchiveBoxIcon,
    UsersIcon,
    BellAlertIcon,
    TagIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import Lottie from 'react-lottie';
import loadingAnimation from '../assets/loading.json';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Tooltip, CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, Tooltip, CategoryScale);

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

    const OverviewCard = ({ label, value, trendData, color }) => {
        const chartOptions = {
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#fff',
                    titleColor: '#374151',
                    bodyColor: '#4b5563',
                    borderColor: color,
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: (context) => `Value: ${context.formattedValue}`,
                    },
                },
            },
            scales: {
                x: {
                    display: false,
                },
                y: {
                    display: false,
                    beginAtZero: true,
                },
            },
            elements: {
                line: {
                    shadowColor: 'rgba(0, 0, 0, 0.05)',
                    shadowBlur: 10,
                },
            },
        };

        const chartData = {
            labels: Array.from({ length: trendData.length }, (_, i) => ''),
            datasets: [
                {
                    label: '',
                    data: trendData,
                    borderColor: color,
                    backgroundColor: (chart) => {
                        const ctx = chart.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                        gradient.addColorStop(0, `${color}90`);
                        gradient.addColorStop(1, `${color}10`);
                        return gradient;
                    },
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    fill: true,
                },
            ],
        };

        return (
            <div className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01] bg-gradient-to-br from-white to-${color}-100 transform rotate-3`}>
                <div className="p-6">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-3xl font-semibold text-gray-800">{value}</p>
                </div>
                <div className="relative py-2 px-6">
                    <div
                        className="absolute inset-0 bg-white opacity-10 transform translate-y-2 rounded-full blur-md"
                        style={{ WebkitFilter: 'blur(10px)', filter: 'blur(10px)' }}
                    />
                    <Line key={`${label}-${color}-${JSON.stringify(trendData)}`} data={chartData} options={chartOptions} />
                </div>
            </div>
        );
    };

    const QuickAction = ({ label, icon, onClick, color = 'yellow' }) => (
        <button
            onClick={onClick}
            className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-gray-700
                        bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                        focus:ring-${color}-500 transition-all duration-200 border border-gray-200`}
        >
            {React.cloneElement(icon, { className: '-ml-1 mr-2 h-5 w-5 text-gray-400' })}
            {label}
        </button>
    );

    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Lottie options={lottieOptions} height={200} width={200} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="text-red-500 text-lg">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-4 px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                                    transition-all duration-300"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 tracking-tight">Admin Dashboard</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    <OverviewCard
                        label="Posts"
                        value={totalArticles}
                        trendData={postsTrendData}
                        color="blue"
                    />
                    <OverviewCard
                        label="Drafts"
                        value={draftsCount}
                        trendData={draftsTrendData}
                        color="yellow"
                    />
                    <OverviewCard
                        label="Sponsors"
                        value={sponsorsCount}
                        trendData={sponsorsTrendData}
                        color="purple"
                    />
                    <OverviewCard
                        label="Partners"
                        value={partnersCount}
                        trendData={partnersTrendData}
                        color="green"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <QuickAction label="Add New Article" icon={<PlusIcon />} onClick={handleAddNewArticle} color="indigo" />
                        <Link
                            to="/admin/categories"
                            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md shadow-sm
                                        text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                        transition-all duration-200"
                        >
                            <TagIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                            Manage Categories
                        </Link>
                        <Link
                            to="/admin/articles/drafts"
                            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md shadow-sm
                                        text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                        transition-all duration-200"
                        >
                            <ArchiveBoxIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                            View Drafts
                        </Link>
                        <Link
                            to="/admin/sponsors"
                            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md shadow-sm
                                        text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                        transition-all duration-200"
                        >
                            <BellAlertIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                            Manage Sponsors
                        </Link>
                        <Link
                            to="/admin/partners"
                            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md shadow-sm
                                        text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                        transition-all duration-200"
                        >
                            <UsersIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                            Manage Partners
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Tasks</h3>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                        <li><span className="font-semibold text-gray-800">Review pending drafts:</span> Ensure all submitted articles are reviewed and ready for publishing.</li>
                        <li><span className="font-semibold text-gray-800">Engage with new inquiries:</span> Check for new messages from potential sponsors or partners and respond promptly.</li>
                        <li><span className="font-semibold text-gray-800">Analyze recent performance:</span> Use analytics tools to understand how recent articles are performing and identify areas for improvement.</li>
                        <li><span className="font-semibold text-gray-800">Plan upcoming content:</span> Brainstorm and outline ideas for the next set of articles to maintain a consistent publishing schedule.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;