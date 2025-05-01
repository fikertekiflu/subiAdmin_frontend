import React, { useState, useRef } from 'react';
import axios from 'axios';
import { PaperClipIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const AddNewArticlePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('🌍 World');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState('draft'); // Initialize status here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const categories = [
    '🌍 World',
    '🏛️ Politics',
    '📈 Business',
    '⚽ Sports',
    '⚕️ Health',
    '🎭 Entertainment',
    '🎨 Culture',
    '🧪 Science & Tech',
  ];

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (event, articleStatus) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('youtubeLink', youtubeLink);
    formData.append('status', articleStatus); // Use the status passed to the function
    if (image) {
      formData.append('featuredImage', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/article', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(`Article ${articleStatus === 'draft' ? 'saved as draft' : 'published'} successfully!`);
      console.log('Response:', response.data);

      setTitle('');
      setContent('');
      setCategory('🌍 World');
      setYoutubeLink('');
      setImage(null);
      setImagePreview(null);
      setStatus('draft'); // Reset status to default after submission
    } catch (err) {
      console.error('Error creating article:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDraftSubmit = (event) => {
    handleSubmit(event, 'draft');
  };

  const handlePublishSubmit = (event) => {
    handleSubmit(event, 'published');
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Article</h2>
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-semibold">Error:</strong> <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-semibold">Success:</strong> <span className="block sm:inline">{success}</span>
        </div>
      )}
      <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-3">
            <PhotoIcon className="inline-block mr-2 h-5 w-5 text-yellow-500" />
            <span className="font-semibold">Featured Image</span>
          </label>
          <div
            className="relative border-dashed border-2 border-yellow-500 rounded-md p-6 cursor-pointer hover:border-yellow-600 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500 bg-gray-50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <input
              type="file"
              id="image"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
              ref={fileInputRef}
              accept="image/*"
            />
            <div className="text-center">
              <CloudArrowUpIcon className="mx-auto h-10 w-10 text-yellow-500" />
              <p className="mt-1 text-sm text-gray-500">
                Drag and drop an image here or <button type="button" className="text-yellow-600 hover:text-yellow-700 focus:outline-none">browse</button>
              </p>
            </div>
            {imagePreview && (
              <div className="mt-4">
                <h3 className="block text-sm font-medium text-gray-700 mb-1">Image Preview:</h3>
                <img src={imagePreview} alt="Featured Image Preview" className="max-w-md h-auto rounded-md shadow-md" />
                <p className="mt-1 text-sm text-gray-500">Selected Image: {image.name}</p>
              </div>
            )}
            {!imagePreview && image && <p className="mt-2 text-sm text-gray-500">Selected Image: {image.name}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-3">
            <PaperClipIcon className="inline-block mr-2 h-5 w-5 text-gray-500" />
            <span className="font-semibold">Title</span>
          </label>
          <input
            type="text"
            id="title"
            className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4" // Increased padding
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-3">
            <svg className="inline-block mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="font-semibold">Content</span>
          </label>
          <textarea
            id="content"
            rows="8"
            className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4" // Increased padding
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-3">
            <svg className="inline-block mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9a2 2 0 00-2-2h-10a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6m-3 3v3" />
            </svg>
            <span className="font-semibold">Category</span>
          </label>
          <select
            id="category"
            className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 appearance-none pr-8 bg-white" // Increased padding and white background
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="currentColor" viewBox="0 0 20 20"><path d="M7 7l3-3 3 3m0 6l-3 3-3-3"/></svg>')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1em',
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700 mb-3">
            <svg className="inline-block mr-2 h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14.518 5.092A3 3 0 0016 11.5a3 3 0 00-2.518-1.592.75.75 0 01-.704-1.207 4.5 4.5 0 018.044 4.8z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">YouTube Link (Optional)</span>
          </label>
          <textarea
            id="youtubeLink"
            rows="3"
            className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4" // Increased padding
            placeholder="Paste YouTube URL or iframe/embed code here"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            onClick={handleDraftSubmit}
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-200 disabled:opacity-50"
            onClick={handlePublishSubmit}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewArticlePage;