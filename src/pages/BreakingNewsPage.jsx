import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { PlusIcon } from '@heroicons/react/24/outline';

const BreakingNewsPage = () => {
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        image: null,
        imagePreview: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/breaking-news');
                setNews(response.data.data);
            } catch (err) {
                console.error('Error fetching breaking news:', err.response?.data || err.message);
                setError('Failed to fetch breaking news. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            if (isEditing && selectedNews?._id) {
                await axios.put(`http://localhost:5000/api/breaking-news/${selectedNews._id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setNews((prev) =>
                    prev.map((item) =>
                        item._id === selectedNews._id
                            ? { ...selectedNews, title: formData.title, description: formData.description, category: formData.category, image: formData.imagePreview || item.image }
                            : item
                    )
                );
            } else {
                const response = await axios.post('http://localhost:5000/api/breaking-news', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setNews((prev) => [...prev, response.data.data]);
            }

            setFormData({ title: '', description: '', category: '', image: null, imagePreview: null });
            setIsEditing(false);
            setSelectedNews(null);
            setShowForm(false);
        } catch (err) {
            console.error('Error saving breaking news:', err.response?.data || err.message);
            setError('Failed to save breaking news. Please try again.');
        }
    };

    const handleEdit = (newsItem) => {
        setSelectedNews(newsItem);
        setFormData({
            title: newsItem.title,
            description: newsItem.description,
            category: newsItem.category,
            image: null,
            imagePreview: newsItem.image,
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/breaking-news/${id}`);
            setNews((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error('Error deleting breaking news:', err.response?.data || err.message);
            setError('Failed to delete breaking news. Please try again.');
        }
    };

    const handleAddNewsClick = () => {
        setShowForm(true);
        setFormData({ title: '', description: '', category: '', image: null, imagePreview: null });
        setIsEditing(false);
        setSelectedNews(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gold-500"></div>
        </div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Breaking News</h1>

                <div className="mb-6">
                    <button
                        onClick={handleAddNewsClick}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        <PlusIcon className="h-5 w-5 inline-block mr-2" />
                        Add Breaking News
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-xl p-6 mb-8 transition-all duration-500 ease-in-out">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">{isEditing ? 'Edit Breaking News' : 'Add New Breaking News'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-gray-600 text-sm font-bold mb-2">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-gray-600 text-sm font-bold mb-2">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-gray-600 text-sm font-bold mb-2">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="">Select a category</option>
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
                                <label htmlFor="image" className="block text-gray-600 text-sm font-bold mb-2">Image</label>
                                <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-4 cursor-pointer ${isDragActive ? 'border-yellow-500 bg-yellow-50' : 'border-gray-400'}`}>
                                    <input {...getInputProps()} id="image" name="image" onChange={handleImageChange} />
                                    {formData.imagePreview ? (
                                        <div className="mt-2">
                                            <img src={formData.imagePreview} alt="Preview" className="max-h-32 rounded-md" />
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Drag 'n' drop an image here, or click to select files</p>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-gold-500 hover:bg-gold-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gold-400"
                            >
                                {isEditing ? 'Update News' : 'Save News'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setIsEditing(false);
                                        setSelectedNews(null);
                                        setFormData({ title: '', description: '', category: '', image: null, imagePreview: null });
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 ml-2"
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                )}

                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Breaking News</h2>
                    {news.length === 0 ? (
                        <p className="text-gray-500">No breaking news available.</p>
                    ) : (
                        <ul className="space-y-6">
                            {news.map((item) => (
                                <li key={item._id} className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 mb-2">{item.description}</p>
                                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                    {item.image && <img src={item.image} alt={item.title} className="max-h-48 rounded-md mb-2" />}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BreakingNewsPage;