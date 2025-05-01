import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import {
    XMarkIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    PhotoIcon,
} from '@heroicons/react/24/outline';
import loadingAnimationData from '../../assets/loading.json'; // Import your Lottie animation data

const AllArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null); // State for the selected article
    const [isEditing, setIsEditing] = useState(false); // State for edit mode
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        youtubeLink: '',
        featuredImage: null,
    });
    const [fullArticle, setFullArticle] = useState(null); // State to show full article
    const [hasLoaded, setHasLoaded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([]);

    const fetchArticles = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/article');
            const publishedArticles = response.data.data.filter(
                (article) => article.status === 'published'
            );
            setArticles(publishedArticles);
            // Extract unique categories
            const uniqueCategories = ['All', ...new Set(publishedArticles.map((article) => article.category))];
            setCategories(uniqueCategories);
            setLoading(false);
            // Set loaded state after a small delay for the animation to be noticeable
            setTimeout(() => setHasLoaded(true), 300);
        } catch (err) {
            console.error('Error fetching articles:', err.response?.data || err.message);
            setError('Failed to fetch articles. Please try again later.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/article/${id}`);
            setArticles(articles.filter((article) => article._id !== id));
        } catch (err) {
            console.error('Error deleting article:', err.response?.data || err.message);
            setError('Failed to delete the article. Please try again.');
        }
    };

    const handleEdit = (article) => {
        setSelectedArticle(article);
        setFormData({
            title: article.title,
            content: article.content,
            category: article.category,
            youtubeLink: article.youtubeLink,
            featuredImage: article.featuredImage, // Set the existing image for editing
        });
        setIsEditing(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, featuredImage: file }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedFormData = new FormData();
            updatedFormData.append('title', formData.title);
            updatedFormData.append('content', formData.content);
            updatedFormData.append('category', formData.category);
            updatedFormData.append('youtubeLink', formData.youtubeLink);
            if (formData.featuredImage) {
                updatedFormData.append('featuredImage', formData.featuredImage);
            }

            const response = await axios.put(
                `http://localhost:5000/api/article/${selectedArticle._id}`,
                updatedFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Update the articles list with the updated article
            setArticles((prev) =>
                prev.map((article) =>
                    article._id === selectedArticle._id ? response.data.data : article
                )
            );

            setIsEditing(false);
            setSelectedArticle(null);
        } catch (err) {
            console.error('Error updating article:', err.response?.data || err.message);
            setError('Failed to update the article. Please try again.');
        }
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
        },
    };

    const handleReadMore = (article) => {
        setFullArticle(article);
    };

    const handleCloseFullArticle = () => {
        setFullArticle(null);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Function to filter articles based on the selected category
    const filteredArticles = selectedCategory === 'All'
        ? articles
        : articles.filter((article) => article.category === selectedCategory);

    // Function to extract YouTube embed URL from various link formats
    const extractEmbedId = (url) => {
        if (url?.includes('embed')) {
            const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
            return match?.[1];
        } else if (
            url?.includes('youtube.com') ||
            url?.includes('youtu.be')
        ) {
            const urlParams = new URLSearchParams(new URL(url).search);
            return urlParams.get('v') || url.split('/').pop();
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 py-6">
                <Lottie options={defaultOptions} height={300} width={300} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 py-6">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8">
                    <p className="text-red-500 text-lg text-center">{error}</p>
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="min-h-screen bg-gray-50 py-6 flex justify-center sm:py-12">
                <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Edit Article
                    </h2>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                rows="6"
                                value={formData.content}
                                onChange={handleFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                            >
                                {[
                                    '🌍 World',
                                    '🏛️ Politics',
                                    '📈 Business',
                                    '⚽ Sports',
                                    '⚕️ Health',
                                    '🎭 Entertainment',
                                    '🎨 Culture',
                                    '🧪 Science & Tech',
                                ].map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700">
                                YouTube Link (Optional)
                            </label>
                            <input
                                type="text"
                                id="youtubeLink"
                                name="youtubeLink"
                                value={formData.youtubeLink}
                                onChange={handleFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                                placeholder="Paste YouTube URL or embed code here"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="featuredImage"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Featured Image (Optional)
                            </label>
                            <div className="mt-1 flex items-center">
                                {formData.featuredImage ? (
                                    <>
                                        {typeof formData.featuredImage === 'string' ? (
                                            <img
                                                src={formData.featuredImage}
                                                alt="Current Preview"
                                                className="h-16 w-16 rounded-md object-cover mr-4"
                                            />
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(formData.featuredImage)}
                                                alt="New Preview"
                                                className="h-16 w-16 rounded-md object-cover mr-4"
                                            />
                                        )}

                                        <label
                                            htmlFor="featuredImageInput"
                                            className="cursor-pointer rounded-md font-semibold text-yellow-600 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                        >
                                            Change
                                        </label>
                                        <input
                                            type="file"
                                            id="featuredImageInput"
                                            name="featuredImage"
                                            onChange={handleImageChange}
                                            className="sr-only"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <label
                                            htmlFor="featuredImageInput"
                                            className="cursor-pointer rounded-md font-semibold text-yellow-600 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                        >
                                            <PhotoIcon className="h-6 w-6" />
                                            <span className="sr-only">Upload Image</span>
                                        </label>
                                        <input
                                            type="file"
                                            id="featuredImageInput"
                                            name="featuredImage"
                                            onChange={handleImageChange}
                                            className="sr-only"
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Published Articles
                    </h2>
                    <div>
                        <label htmlFor="categoryFilter" className="mr-2 text-gray-700">Filter by Category:</label>
                        <select
                            id="categoryFilter"
                            className="rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {filteredArticles.length === 0 ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                        <p className="text-gray-500">No published articles in the selected category.</p>
                    </div>
                ) : (
                    <div
                        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
                            hasLoaded
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4 transition-all duration-500'
                        }`}
                    >
                        {filteredArticles.map((article) => (
                            <div
                                key={article._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                            >
                                <img
                                    src={article.featuredImage}
                                    alt={article.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                        {article.content}
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-sm text-gray-500">
                                            {article.category}
                                        </span>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleReadMore(article)}
                                                className="rounded-md bg-transparent p-2 text-gray-500 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                                <span className="sr-only">Read more</span>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(article)}
                                                className="rounded-md bg-transparent p-2 text-gray-500 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                                <span className="sr-only">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article._id)}
                                                className="rounded-md bg-transparent p-2 text-gray-500 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                                <span className="sr-only">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Full Article Modal */}
                {fullArticle && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full relative">
                            <button
                                onClick={handleCloseFullArticle}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                                    {fullArticle.title}
                                </h2>
                                {fullArticle.featuredImage && (
                                    <img
                                        src={fullArticle.featuredImage}
                                        alt={fullArticle.title}
                                        className="w-full rounded-md shadow-md mb-6"
                                    />
                                )}
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {fullArticle.content}
                                </p>
                                {fullArticle.youtubeLink && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                            YouTube Video
                                        </h3>
                                        <div className="rounded-md overflow-hidden shadow-md">
                                            {extractEmbedId(fullArticle.youtubeLink) ? (
                                                <div className="aspect-w-16 aspect-h-9">
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={`https://www.youtube.com/embed/$$$${extractEmbedId(
                                                            fullArticle.youtubeLink
                                                        )}`}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            ) : (
                                                <a
                                                    href={fullArticle.youtubeLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Watch on YouTube
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500 mt-4">
                                    Category: {fullArticle.category}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllArticlesPage;