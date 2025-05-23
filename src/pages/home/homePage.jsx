import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRightIcon, ShoppingBagIcon, Phone, Computer, Shirt, Home, Book } from "lucide-react";
import ProductCard from "../../components/productCard";
import { useSelector } from "react-redux";

const Homepage = () => {
    const { products: productState } = useSelector(state => state.products);
    const products = productState?.products || [];

    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [favorites, setFavorites] = useState([]);

    const categories = ["All", "Home", "Fashion", "Decor", "Kitchen", "Stationery"];

    useEffect(() => {
        // Set loading to false once we have products
        if (products.length > 0) {
            setIsLoading(false);
        }
    }, [products]);

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(product =>
            product?.category?.name === activeCategory
        );

    const toggleFavorite = (productId) => {
        if (favorites.includes(productId)) {
            setFavorites(favorites.filter(id => id !== productId));
        } else {
            setFavorites([...favorites, productId]);
        }
    };

    return (
        <div className="bg-gray-50 uppercase">
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-800 to-fuchsia-800 text-white py-24 rounded-3xl mt-10 px-4 sm:px-6 lg:px-8">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-purple-500 mix-blend-overlay filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-fuchsia-600 mix-blend-overlay filter blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Handmade</span> Treasures
                        </h1>
                        <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Shop unique items from independent makers around the world
                        </p>

                        <div className="mt-12 flex justify-center space-x-4">
                            <span className="text-purple-200 font-medium">Trending:</span>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['Ceramics', 'Macrame', 'Wooden Toys', 'Handmade Soap', 'Embroidery'].map((tag) => (
                                    <button key={tag} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="backdrop-blur-lg py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="relative">
                        {/* Enhanced category pills */}
                        <div className="flex overflow-x-auto scroll-smooth pb-2 space-x-2 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    id={`category-${category}`}
                                    className={`relative whitespace-nowrap px-5 py-2 uppercase rounded-3xl text-sm font-bold transition-all duration-300 flex-shrink-0 ${activeCategory === category
                                        ? "text-white shadow-sm"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    {activeCategory === category && (
                                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 -z-10"></span>
                                    )}
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl uppercase md:text-4xl font-bold text-gray-900 mb-4">
                            best <span className="text-purple-600">sellers</span>
                        </h2>
                        <motion.div
                            className="h-1 bg-gradient-to-r from-purple-400 to-indigo-500 w-24 rounded-full"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                    </motion.div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isFavorite={favorites.includes(product.id)}
                                    toggleFavorite={toggleFavorite}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Popular Categories */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="mb-5"
                        >
                            <h2 className="text-3xl uppercase md:text-4xl font-bold text-gray-900 mb-4">
                                Popular <span className="text-purple-600">Categories</span>
                            </h2>
                        </motion.div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover our curated collections tailored to your needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.filter(c => c !== "All").map((category, index) => {
                            // Dynamic sizing for visual hierarchy
                            const colSpan = index % 7 === 0 ? "lg:col-span-2" : "";
                            const rowSpan = index % 5 === 0 ? "lg:row-span-2" : "";

                            // Icons for each category
                            const icons = [
                                <ShoppingBagIcon className="h-8 w-8" />,
                                <Phone className="h-8 w-8" />,
                                <Computer className="h-8 w-8" />,
                                <Shirt className="h-8 w-8" />,
                                <Home className="h-8 w-8" />,
                                <Book className="h-8 w-8" />
                            ];
                            const icon = icons[index % icons.length];

                            return (
                                <motion.div
                                    key={category}
                                    className={`${colSpan} ${rowSpan} rounded-2xl overflow-hidden shadow-xs border border-gray-300 transition-all duration-300 group`}
                                >
                                    <div className={`h-full bg-gradient-to-br p-6 flex flex-col`}>
                                        <div className="mb-4 p-3 bg-white/20 rounded-lg w-max backdrop-blur-sm">
                                            {icon}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-end">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{category}</h3>
                                            <p className="text-gray-800 mb-4 text-sm">
                                                {Math.floor(Math.random() * 100) + 50} products available
                                            </p>
                                            <motion.button
                                                whileHover={{ x: 3 }}
                                                className="flex items-center gap-1 text-xs bold text-gray-800 px-4 py-2 rounded-full bg-white/20 transition-colors border border-gray-300"
                                            >
                                                Shop now
                                                <ArrowRightIcon className="h-3 w-3" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-12 text-center">
                        <button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-full shadow-xs uppercase border border-gray-300 transition-colors">
                            View all categories
                        </button>
                    </div>
                </div>
            </div>

            {/* Recently Viewed Section */}
            <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Recently <span className="text-purple-600">Viewed</span>
                        </h2>
                        <motion.div
                            className="h-1 bg-gradient-to-r from-purple-400 to-indigo-500 w-24 rounded-full"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                    </motion.div>

                    {/* Product grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                        {products.slice(0, 6).map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                whileHover={{ y: -10 }}
                                className="relative group"
                            >
                                <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-sm overflow-hidden border border-white/20 transition-all duration-300 group-hover:shadow-lg group-hover:border-white/40">
                                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                        <motion.img
                                            src={product.attachments[0]?.url || '/placeholder-product.jpg'}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ duration: 0.6 }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 -rotate-45 scale-150 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{product.title}</h3>
                                        <motion.p
                                            className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: index * 0.1 + 0.3 }}
                                        >
                                            ${product.price?.toFixed(2) || '0.00'}
                                        </motion.p>
                                    </div>

                                    <motion.button
                                        className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <motion.button
                            className="relative px-6 py-3 bg-transparent border-2 border-purple-600 text-purple-600 rounded-full font-medium overflow-hidden group"
                            whileHover={{ backgroundColor: "#7C3AED", color: "#fff" }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="relative z-10">View All History</span>
                            <motion.span
                                className="absolute inset-0 bg-purple-600 rounded-full scale-0 group-hover:scale-100 origin-center transition-transform duration-300"
                            />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;