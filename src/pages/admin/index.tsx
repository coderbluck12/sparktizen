import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);

  // Replace these with your Cloudinary credentials
  const CLOUDINARY_CLOUD_NAME = 'dim9ktzis'; // e.g., 'dxyz123abc'
  const CLOUDINARY_UPLOAD_PRESET = 'sparktizen'; // e.g., 'products_unsigned'

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'products'); // Optional: organize images in a folder

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url; // Returns the image URL
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }

    setLoading(true);

    try {
      // Upload images to Cloudinary
      const imageUrls = await Promise.all(
        images.map(image => uploadToCloudinary(image))
      );

      // Save product to Firestore with Cloudinary URLs
      await addDoc(collection(db, 'products'), {
        name,
        description,
        price: Number(price),
        imageUrls,
        inStock,
        createdAt: new Date().toISOString(),
      });

      setName('');
      setDescription('');
      setPrice('');
      setImages([]);
      setInStock(true);
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product: ', error);
      alert('Failed to add product. Please check your Cloudinary credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImages([]);
    setInStock(true);
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/products"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Manage Products
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Add New Product</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a product to your inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">₦</span>
                <input
                  type="number"
                  id="price"
                  required
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Image
              </label>
              <div className="flex items-center justify-between">
                <label htmlFor="inStock" className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <button
                  type="button"
                  onClick={() => setInStock(!inStock)}
                  className={`${inStock ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <span className={`${inStock ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}/>
                </button>
              </div>

              <div className="mt-1">
                <label
                  htmlFor="image"
                  className={`flex justify-center px-6 py-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-2 text-sm text-gray-600">
                      {images.length > 0 ? (
                        <span className="font-medium text-blue-600">{images.length} file(s) selected</span>
                      ) : (
                        <>
                          <span className="font-medium text-blue-600">Click to upload</span>
                          <span className="text-gray-500"> or drag and drop</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
                <input
                  type="file"
                  id="image"
                  required
                  accept="image/*"
                  multiple
                  disabled={loading}
                  onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])}
                  className="hidden"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Add Product'
                )}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;