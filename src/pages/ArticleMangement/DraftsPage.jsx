import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DraftsPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      // Remove the published article from the drafts list
      setDrafts(drafts.filter((draft) => draft._id !== id));

      console.log('Article published:', response.data);
    } catch (err) {
      console.error('Error publishing draft:', err.response?.data || err.message);
      setError('Failed to publish the draft. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-3 text-gray-600 text-lg">Loading drafts...</p>
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
                        <p className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition-colors duration-200">
                          {draft.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{draft.content}</p>
                        <span className="inline-block bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-full text-xs font-medium mt-2">{draft.category}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => handlePublish(draft._id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
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
    </div>
  );
};

export default DraftsPage;