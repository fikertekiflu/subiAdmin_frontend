import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

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

  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <p className="text-gray-500 text-lg">Loading partners...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <motion.div className="bg-white rounded-xl shadow-md overflow-hidden p-6" layout>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-yellow-700">Our Esteemed Partners</h2>
            <button
              onClick={() => {
                setIsFormVisible(true);
                setFormData({ title: '', websiteLink: '', logo: null });
                setIsEditing(false);
                setSelectedPartner(null);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Partner
            </button>
          </div>

          <AnimatePresence>
            {isFormVisible && (
              <motion.form
                key="partnerForm"
                onSubmit={handleCreateOrUpdate}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="mb-8 p-6 bg-yellow-50 rounded-md border border-yellow-200 grid grid-cols-1 gap-4"
              >
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                  {isEditing ? 'Edit Partner' : 'Add New Partner'}
                </h3>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Partner Name
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
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
                    className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                    Partner Logo
                  </label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={handleLogoChange}
                    className="mt-1 block w-full text-sm text-gray-500 border border-yellow-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  {isEditing && selectedPartner?.logo && !formData.logo && (
                    <div className="mt-2">
                      <img
                        src={selectedPartner.logo}
                        alt="Current Logo"
                        className="h-12 w-auto rounded-md"
                      />
                      <p className="text-xs text-gray-500">Current Logo</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    {isEditing ? 'Update Partner' : 'Add Partner'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div variants={tableVariants} initial="hidden" animate="visible" className="overflow-x-auto">
            <table className="min-w-full leading-normal rounded-md shadow-sm border-collapse border border-gray-200">
              <thead>
                <tr className="bg-yellow-100 text-yellow-700">
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Logo
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Partner Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-right text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <motion.tr key={partner._id} variants={rowVariants} className="hover:bg-yellow-50 transition-colors duration-200">
                    <td className="px-5 py-3 border-b border-gray-200 text-sm">
                      <img src={partner.logo} alt={partner.title} className="h-10 w-auto rounded-md shadow-sm" />
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{partner.title}</p>
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 text-sm">
                      <a
                        href={partner.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        Visit
                      </a>
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 text-right text-sm">
                      <div className="space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(partner)}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(partner._id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PartnerPage;