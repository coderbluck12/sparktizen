import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  const CLOUDINARY_CLOUD_NAME = 'dim9ktzis';
  const CLOUDINARY_UPLOAD_PRESET = 'sparktizen';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          setName(productData.name);
          setDescription(productData.description);
          setPrice(productData.price.toString());
          setInStock(productData.inStock);
          
          // Handle both old imageUrl and new imageUrls
          if (productData.imageUrls && productData.imageUrls.length > 0) {
            setExistingImages(productData.imageUrls);
          } else if (productData.imageUrl) {
            setExistingImages([productData.imageUrl]);
          }
        }
      } catch (error) {
        console.error('Error fetching product: ', error);
      }
    };

    fetchProduct();
  }, [id]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'products');

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
    return data.secure_url;
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter(img => img !== imageUrl));
    setImagesToRemove([...imagesToRemove, imageUrl]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Check if there will be at least one image after update
    if (existingImages.length === 0 && newImages.length === 0) {
      alert('Please keep at least one image.');
      return;
    }

    setLoading(true);

    try {
      // Upload new images to Cloudinary
      const newImageUrls = await Promise.all(
        newImages.map(image => uploadToCloudinary(image))
      );

      // Combine existing images (minus removed ones) with new images
      const finalImageUrls = [...existingImages, ...newImageUrls];

      await updateDoc(doc(db, 'products', id), {
        name,
        description,
        price: Number(price),
        inStock,
        imageUrls: finalImageUrls,
      });

      alert('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product: ', error);
      alert('Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Edit Product</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border-2 border-border p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 bg-background text-foreground border-2 border-input focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 bg-background text-foreground border-2 border-input focus:outline-none focus:border-foreground transition-colors resize-none disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-foreground mb-1.5">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-muted-foreground text-sm">₦</span>
                <input
                  type="number"
                  id="price"
                  required
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading}
                  className="w-full pl-7 pr-3 py-2 bg-background text-foreground border-2 border-input focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="inStock" className="block text-sm font-medium text-foreground">
                Availability
              </label>
              <button
                type="button"
                onClick={() => setInStock(!inStock)}
                className={`${inStock ? 'bg-foreground' : 'bg-input'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
              >
                <span className={`${inStock ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform ${inStock ? 'bg-background' : 'bg-muted-foreground'} rounded-full transition-transform`}/>
              </button>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Images
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={imageUrl} 
                        alt={`Product ${index + 1}`} 
                        className="w-full h-32 object-cover border-2 border-border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(imageUrl)}
                        disabled={loading || (existingImages.length === 1 && newImages.length === 0)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {newImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Images to Upload
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {newImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`New ${index + 1}`} 
                        className="w-full h-32 object-cover border-2 border-border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        disabled={loading}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div>
              <label htmlFor="newImages" className="block text-sm font-medium text-foreground mb-1.5">
                Add More Images
              </label>
              <label
                htmlFor="newImages"
                className={`flex justify-center px-6 py-8 border-2 border-input border-dashed cursor-pointer hover:border-muted-foreground transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-muted-foreground"
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
                  <div className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Click to upload</span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
              <input
                type="file"
                id="newImages"
                accept="image/*"
                multiple
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files) {
                    setNewImages([...newImages, ...Array.from(e.target.files)]);
                  }
                }}
                className="hidden"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                disabled={loading}
                className="px-4 py-2.5 text-sm font-medium text-foreground bg-background border-2 border-input hover:border-foreground transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProductPage;