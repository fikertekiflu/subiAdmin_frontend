import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import { XMarkIcon } from '@heroicons/react/24/outline';
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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/article');
        const publishedArticles = response.data.data.filter(
          (article) => article.status === 'published'
        );
        setArticles(publishedArticles);
      } catch (err) {
        console.error('Error fetching articles:', err.response?.data || err.message);
        setError('Failed to fetch articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
      featuredImage: null, // Reset the image for editing
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Lottie options={defaultOptions} height={200} width={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Article</h2>
        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6">
          {/* ... (Edit form remains the same) ... */}
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              rows="8"
              value={formData.content}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {['🌍 World', '🏛️ Politics', '📈 Business', '⚽ Sports', '⚕️ Health', '🎭 Entertainment', '🎨 Culture', '🧪 Science & Tech'].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700">
              YouTube Link (Optional)
            </label>
            <textarea
              id="youtubeLink"
              name="youtubeLink"
              rows="3"
              value={formData.youtubeLink}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Paste YouTube URL or iframe/embed code here"
            ></textarea>
          </div>

          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
              Featured Image (Optional)
            </label>
            <input
              type="file"
              id="featuredImage"
              name="featuredImage"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
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
              className="ml-2 bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Published Articles</h2>
      {articles.length === 0 ? (
        <p className="text-gray-500 text-center">No published articles available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article._id}
              className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{article.content}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{article.category}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReadMore(article)}
                      className="text-indigo-500 hover:text-indigo-700 text-sm font-medium"
                    >
                      Read More
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full relative">
            <button
              onClick={handleCloseFullArticle}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{fullArticle.title}</h2>
            {fullArticle.featuredImage && (
              <img
                src={fullArticle.featuredImage}
                alt={fullArticle.title}
                className="w-full rounded-md shadow-md mb-4"
              />
            )}
            <p className="text-gray-700 leading-relaxed">{fullArticle.content}</p>
            {fullArticle.youtubeLink && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">YouTube Video</h3>
                {/* Basic handling of YouTube link - you might want to embed it properly */}
                {fullArticle.youtubeLink.includes('embed') ? (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      className="w-full h-full rounded-md"
                      src={fullArticle.youtubeLink}
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
                    className="text-blue-500 hover:underline"
                  >
                    Watch on YouTube
                  </a>
                )}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">Category: {fullArticle.category}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllArticlesPage;