import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ProductDetails() {
    const { id } = useParams();
    const { products: productState } = useSelector(state => state.products);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const products = productState?.products || [];

    const product = products.find(p => p.id === parseInt(id)) ;

    useEffect(() => {
        if (product?.colors?.length) {
            setSelectedColor(product.colors[0]);
        }
        if (product?.sizes?.length) {
            setSelectedSize(product.sizes[0]);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="flex items-center justify-center h-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl text-gray-600"
                >
                    Product not found
                </motion.div>
            </div>
        );
    }

    const hasVariants = product.colors.length > 0 || product.sizes.length > 0;
    const defaultImage = product.attachments.length > 0
        ? product.attachments[0].file
        : 'https://via.placeholder.com/800x600?text=No+Image';

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 py-30 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Image Gallery */}
                    <div className="lg:w-1/2">
                        <div className="sticky top-8">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-xl bg-gray-100 shadow-lg"
                            >
                                <img
                                    src={product.attachments[currentImageIndex]?.file || defaultImage}
                                    alt={product.title}
                                    className="h-full w-full object-cover object-center"
                                />
                            </motion.div>

                            {product.attachments.length > 1 && (
                                <div className="mt-6 grid grid-cols-4 gap-4">
                                    {product.attachments.map((img, index) => (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            key={index}
                                            onClick={() => handleImageChange(index)}
                                            className={`rounded-lg overflow-hidden h-24 ${currentImageIndex === index ? 'ring-2 ring-indigo-500' : ''}`}
                                        >
                                            <img
                                                src={img.file}
                                                alt={`${product.title} thumbnail ${index}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {product.title}
                            </h1>

                            <div className="mt-4 flex items-center">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">24 reviews</span>
                            </div>

                            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900">Category</h3>
                                <div className="mt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        {product.category.name}
                                    </span>
                                </div>
                            </div>

                            {hasVariants && (
                                <div className="mt-8 border-t border-gray-200 pt-8">
                                    {/* Color Selector */}
                                    {product.colors.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                            <div className="mt-3 flex flex-wrap gap-3">
                                                {product.colors.map((color) => (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        key={color.id}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${selectedColor?.id === color.id ? 'border-indigo-500' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color.hex_code }}
                                                        title={color.name}
                                                    >
                                                        {selectedColor?.id === color.id && (
                                                            <motion.svg
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-5 h-5 text-white"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </motion.svg>
                                                        )}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Size Selector */}
                                    {product.sizes.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                                <a
                                                    href="#"
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    Size guide
                                                </a>
                                            </div>
                                            <div className="mt-3 grid grid-cols-3 gap-3">
                                                {product.sizes.map((size) => (
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        key={size.id}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`py-2 px-3 border rounded-md text-center ${selectedSize?.id === size.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-900 border-gray-300'} ${!size.in_stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={!size.in_stock}
                                                    >
                                                        <span className="font-medium">{size.name}</span>
                                                        {size.price && (
                                                            <span className="block text-xs mt-1">${size.price}</span>
                                                        )}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={decrementQuantity}
                                            className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 text-lg font-medium">{quantity}</span>
                                        <button
                                            onClick={incrementQuantity}
                                            className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add to cart
                                </motion.button>

                                <button className="mt-4 w-full bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Save to wishlist
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Product Details Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-16 border-t border-gray-200 pt-10"
                >
                    <h2 className="text-2xl font-bold text-gray-900">Product details</h2>
                    <div className="mt-6 prose prose-lg text-gray-500">
                        <p>
                            {product.description}
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li>High-quality materials</li>
                            <li>Designed for comfort and style</li>
                            <li>Easy to care for and maintain</li>
                        </ul>
                    </div>
                </motion.section>

                {/* Reviews Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-16 border-t border-gray-200 pt-10"
                >
                    <h2 className="text-2xl font-bold text-gray-900">Customer reviews</h2>
                    <div className="mt-6 space-y-10">
                        {[1, 2, 3].map((review) => (
                            <div key={review} className="flex">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={`https://i.pravatar.cc/150?img=${review + 10}`}
                                        alt=""
                                    />
                                </div>
                                <div className="ml-4">
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <h3 className="ml-3 text-sm font-medium text-gray-900">
                                            Review {review}
                                        </h3>
                                    </div>
                                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                        <p className="text-gray-400">Posted on January 1, 2023</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
}