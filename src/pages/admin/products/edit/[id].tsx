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
        }
      } catch (error) {
        console.error('Error fetching product: ', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);

    try {
      await updateDoc(doc(db, 'products', id), {
        name,
        description,
        price: Number(price),
        inStock,
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                Price
              </label>
              <div className="flex items-center justify-between mt-4">
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

            <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">₦</span>
                <input
                  type="number"
                  id="price"
                  required
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                disabled={loading}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
