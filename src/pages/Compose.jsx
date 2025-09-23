import React, { useState, useCallback, useMemo } from 'react';
import { FiUpload, FiX, FiImage, FiPlus, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useStore from '../store';

export default function Compose() {
  const { tags } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedTags: [],
    images: []
  });
  const [tagSearch, setTagSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Quill modules configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  }), []);

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'color', 'background', 'align'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDescriptionChange = (content) => {
    setFormData({
      ...formData,
      description: content
    });
  };

  const handleTagSelect = (tag) => {
    if (!formData.selectedTags.find(t => t.id === tag.id)) {
      setFormData({
        ...formData,
        selectedTags: [...formData.selectedTags, tag]
      });
    }
    setTagSearch('');
    setShowTagSuggestions(false);
  };

  const handleTagRemove = (tagId) => {
    setFormData({
      ...formData,
      selectedTags: formData.selectedTags.filter(t => t.id !== tagId)
    });
  };

  const handleTagSearchChange = (e) => {
    const value = e.target.value;
    setTagSearch(value);
    setShowTagSuggestions(value.length > 0);
  };

  const handleTagSearchFocus = () => {
    if (tagSearch.length > 0) {
      setShowTagSuggestions(true);
    }
  };

  const handleTagSearchBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowTagSuggestions(false), 200);
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !formData.selectedTags.find(t => t.id === tag.id)
  );

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (formData.images.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages = imageFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });
  };

  const handleImageRemove = (imageId) => {
    const imageToRemove = formData.images.find(img => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    setFormData({
      ...formData,
      images: formData.images.filter(img => img.id !== imageId)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim() || formData.description === '<p><br></p>') {
      toast.error('Description is required');
      return;
    }

    setIsLoading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Post created successfully!');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      selectedTags: [],
      images: []
    });
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compose Post</h1>
        <p className="text-gray-600">Create a new post to share with your audience.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter post title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write your post description..."
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {/* Selected Tags */}
              {formData.selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.selectedTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        border: `1px solid ${tag.color}40`
                      }}
                    >
                      <FiTag className="w-3 h-3 mr-1" />
                      #{tag.name}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag.id)}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Tag Search */}
              <div className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={handleTagSearchChange}
                    onFocus={handleTagSearchFocus}
                    onBlur={handleTagSearchBlur}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search tags..."
                  />
                </div>
                
                {/* Tag Suggestions */}
                {showTagSuggestions && filteredTags.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagSelect(tag)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">#{tag.name}</span>
                            <span className="text-xs text-gray-500">
                              {tag.postsCount} posts
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results message */}
                {showTagSuggestions && tagSearch && filteredTags.length === 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                    <p className="text-sm text-gray-500 text-center">
                      No tags found matching "{tagSearch}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Max 5)
            </label>
            
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FiImage className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop images here, or click to select
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {formData.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(image.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FiUpload className="w-4 h-4" />
            <span>{isLoading ? 'Publishing...' : 'Publish Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
