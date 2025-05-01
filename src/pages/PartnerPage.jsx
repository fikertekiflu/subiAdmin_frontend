import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PartnerPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    websiteLink: '',
    logo: null,
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/partner');
        setPartners(response.data.data);
      } catch (err) {
        console.error('Error fetching partners:', err.response?.data || err.message);
        setError('Failed to fetch partners. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('websiteLink', formData.websiteLink);
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      if (isEditing) {
        const response = await axios.put(
          `http://localhost:5000/api/partner/${selectedPartner._id}`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setPartners((prev) =>
          prev.map((partner) =>
            partner._id === selectedPartner._id ? response.data.data : partner
          )
        );
      } else {
        const response = await axios.post('http://localhost:5000/api/partner', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPartners((prev) => [...prev, response.data.data]);
      }

      setFormData({ title: '', websiteLink: '', logo: null });
      setIsFormVisible(false);
      setIsEditing(false);
      setSelectedPartner(null);
    } catch (err) {
      console.error('Error saving partner:', err.response?.data || err.message);
      setError('Failed to save partner. Please try again.');
    }
  };

  const handleEdit = (partner) => {
    setSelectedPartner(partner);
    setFormData({
      title: partner.title,
      websiteLink: partner.websiteLink,
      logo: null, // Reset the logo for editing
    });
    setIsFormVisible(true);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/partner/${id}`);
      setPartners((prev) => prev.filter((partner) => partner._id !== id));
    } catch (err) {
      console.error('Error deleting partner:', err.response?.data || err.message);
      setError('Failed to delete partner. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500 text-lg">Loading partners...</p>
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Partners</h2>
      {!isFormVisible ? (
        <>
          <button
            onClick={() => {
              setIsFormVisible(true);
              setFormData({ title: '', websiteLink: '', logo: null });
              setIsEditing(false);
            }}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
          >
            Add Partner
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{partner.title}</h3>
                  <a
                    href={partner.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-700 text-sm font-medium"
                  >
                    Visit Website
                  </a>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(partner)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(partner._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 gap-6">
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
            <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-700">
              Website Link
            </label>
            <input
              type="url"
              id="websiteLink"
              name="websiteLink"
              value={formData.websiteLink}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              type="file"
              id="logo"
              name="logo"
              onChange={handleLogoChange}
              className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-2 bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Update Partner' : 'Add Partner'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PartnerPage;