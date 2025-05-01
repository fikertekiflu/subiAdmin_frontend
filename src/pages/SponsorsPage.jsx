import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import loadingAnimationData from '../assets/loading.json'; // Import your Lottie animation data

const SponsorsPage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeIframe: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sponsor');
        setSponsors(response.data.data);
      } catch (err) {
        console.error('Error fetching sponsors:', err.response?.data || err.message);
        setError('Failed to fetch sponsors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await axios.put(
          `http://localhost:5000/api/sponsor/${selectedSponsor._id}`,
          formData
        );
        setSponsors((prev) =>
          prev.map((sponsor) =>
            sponsor._id === selectedSponsor._id ? response.data.data : sponsor
          )
        );
      } else {
        const response = await axios.post('http://localhost:5000/api/sponsor', formData);
        setSponsors((prev) => [...prev, response.data.data]);
      }

      setFormData({ title: '', description: '', youtubeIframe: '' });
      setIsEditing(false);
      setSelectedSponsor(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error saving sponsor:', err.response?.data || err.message);
      setError('Failed to save sponsor. Please try again.');
    }
  };

  const handleEdit = (sponsor) => {
    setSelectedSponsor(sponsor);
    setFormData({
      title: sponsor.title,
      description: sponsor.description,
      youtubeIframe: sponsor.youtubeIframe,
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await axios.delete(`http://localhost:5000/api/sponsor/${id}`);
        setSponsors((prev) => prev.filter((sponsor) => sponsor._id !== id));
      } catch (err) {
        console.error('Error deleting sponsor:', err.response?.data || err.message);
        setError('Failed to delete ad. Please try again.');
      }
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setIsEditing(false);
    setFormData({ title: '', description: '', youtubeIframe: '' });
    setSelectedSponsor(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ title: '', description: '', youtubeIframe: '' });
    setSelectedSponsor(null);
    setShowAddForm(false);
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Lottie options={defaultOptions} height={200} width={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8">
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Manage Ads</h2>
            {!showAddForm && (
              <button
                onClick={handleShowAddForm}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-300"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add New Ad
              </button>
            )}
          </div>
          <div className="p-6">
            <div
              className={`mb-8 p-6 bg-gray-50 rounded-md border border-gray-200 transition-all duration-300 overflow-hidden ${
                showAddForm ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isEditing ? 'Edit Ad' : 'Add New Ad'}
                </h3>
                <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 gap-4">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    required
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="youtubeIframe" className="block text-sm font-medium text-gray-700">
                    YouTube Iframe Code
                  </label>
                  <textarea
                    id="youtubeIframe"
                    name="youtubeIframe"
                    rows="3"
                    value={formData.youtubeIframe}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="<iframe src='...'></iframe>"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    {isEditing ? 'Update Ad' : 'Add Ad'}
                  </button>
                </div>
              </form>
            </div>

            {showAddForm ? null : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Ads</h2>
                {sponsors.length === 0 ? (
                  <p className="text-gray-500">No ads available yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sponsors.map((sponsor) => (
                      <div
                        key={sponsor._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300"
                      >
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{sponsor.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{sponsor.description}</p>
                          <div
                            className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: sponsor.youtubeIframe }}
                          ></div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(sponsor)}
                              className="inline-flex items-center px-3 py-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 rounded-md text-sm font-medium transition-all duration-300"
                            >
                              <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(sponsor._id)}
                              className="inline-flex items-center px-3 py-2 border border-red-500 text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-md text-sm font-medium transition-all duration-300"
                            >
                              <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorsPage;