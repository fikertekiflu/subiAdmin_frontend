import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import { EyeIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import loadingAnimationData from '../../assets/loading.json'; // Import your Lottie animation data

const DraftsPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    youtubeLink: '',
    featuredImage: null,
  });
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewArticle, setPreviewArticle] = useState(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/article');
        const draftArticles = response.data.data.filter((article) => article.status === 'draft');
        setDrafts(draftArticles);
      } catch (err) {
        console.error('Error fetching drafts:', err.response?.data || err.message);
        setError('Failed to fetch drafts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handlePublish = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/article/${id}`, {
        status: 'published',
      });
      setDrafts(drafts.filter((draft) => draft._id !== id));
      console.log('Article published:', response.data);
    } catch (err) {
      console.error('Error publishing draft:', err.response?.data || err.message);
      setError('Failed to publish the draft. Please try again.');
    }
  };

  const handleEdit = (draft) => {
    setSelectedDraft(draft);
    setFormData({
      title: draft.title,
      content: draft.content,
      category: draft.category,
      youtubeLink: draft.youtubeLink,
      featuredImage: draft.featuredImage,
    });
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/article/${selectedDraft._id}`,
        formData
      );
      setDrafts((prevDrafts) =>
        prevDrafts.map((draft) => (draft._id === selectedDraft._id ? response.data.data : draft))
      );
      setIsEditing(false);
      setSelectedDraft(null);
      console.log('Draft updated:', response.data);
    } catch (err) {
      console.error('Error updating draft:', err.response?.data || err.message);
      setError('Failed to update the draft. Please try again.');
    }
  };

  const handlePreview = (draft) => {
    setPreviewArticle(draft);
    setIsPreviewing(true);
  };

  const handleClosePreview = () => {
    setIsPreviewing(false);
    setPreviewArticle(null);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <Lottie options={defaultOptions} height={300} width={300} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <svg className="w-6 h-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (isEditing && selectedDraft) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex justify-center sm:py-12">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Edit Draft</h2>
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
                Update Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-5 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Your Draft Articles</h2>
          </div>
          <div className="p-6">
            {drafts.length === 0 ? (
              <div className="py-8 px-4 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12h.01M12 12h.01M6 12h.01M3 16v-4c0-4 2.24-8 8-8s8 4 8 8v4m-16 0h16" />
                </svg>
                <p className="mt-3">No draft articles available.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {drafts.map((draft) => (
                  <li key={draft._id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-800 hover:text-yellow-600 transition-colors duration-200">
                          {draft.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{draft.content}</p>
                        <span className="inline-block bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs font-medium mt-2">{draft.category}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0 space-x-2">
                        <button
                          onClick={() => handlePreview(draft)}
                          className="inline-flex items-center px-2 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                          <EyeIcon className="h-5 w-5" />
                          <span className="sr-only">Preview</span>
                        </button>
                        <button
                          onClick={() => handleEdit(draft)}
                          className="inline-flex items-center px-2 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() => handlePublish(draft._id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                        >
                          <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                          Publish
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewing && previewArticle && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full relative">
            <button
              onClick={handleClosePreview}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">{previewArticle.title}</h2>
              {previewArticle.featuredImage && (
                <img
                  src={previewArticle.featuredImage}
                  alt={previewArticle.title}
                  className="w-full rounded-md shadow-md mb-6"
                />
              )}
              <p className="text-gray-700 leading-relaxed mb-6">{previewArticle.content}</p>
              {previewArticle.youtubeLink && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">YouTube Video</h3>
                  <div className="rounded-md overflow-hidden shadow-md">
                    {previewArticle.youtubeLink.includes('embed') ? (
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          className="w-full h-full"
                          src={previewArticle.youtubeLink}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <a
                        href={previewArticle.youtubeLink}
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
              <p className="text-sm text-gray-500 mt-4">Category: {previewArticle.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftsPage;