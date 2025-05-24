import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRightIcon, ShoppingBagIcon, Star, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";

export default function ProductDetails() {
    const { id } = useParams();
    const { products: productState } = useSelector(state => state.products);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const products = productState?.products || [];

    const product = products.find(p => p.id === parseInt(id));

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
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-white">
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




    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen py-20 bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">

                    <div className="lg:w-1/2">
                        <div className="sticky top-25">


                            <Carousel className="w-full">
                                <CarouselContent>
                                    {product?.attachments.length !== 0 ? (
                                        product.attachments.map((attachment, index) => (
                                            <CarouselItem key={index}>
                                                <div className="aspect-w-1 h-[350px] sm:h-[500px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                                                    <img
                                                        src={attachment.file}
                                                        alt={`${product.title} - ${index + 1}`}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))
                                    ) : (
                                        <CarouselItem>
                                            <div className="aspect-w-1 h-[350px] sm:h-[500px] rounded-xl w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg flex items-center justify-center">
                                                <div className="text-center p-8">
                                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-gray-200 mb-4">
                                                       <Image/>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900">No attachments provided</h3>
                                                    <p className="mt-1 text-sm text-gray-500">This product doesn't have any images yet.</p>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    )}
                                </CarouselContent>
                                {product?.attachments.length === 0 && product.attachments.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-gray-200 hover:bg-white transition-colors" />
                                        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-gray-200 hover:bg-white transition-colors" />
                                    </>
                                )}
                            </Carousel>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xs border border-gray-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl uppercase">
                                        {product.title}
                                    </h1>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r border-2 border-purple-500 from-purple-100 to-indigo-100 text-purple-800">
                                            {product.category.name}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                        ${selectedSize?.price || product.sizes[0]?.price || '0.00'}
                                    </p>
                                    <div className="flex items-center justify-end mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                        <span className="ml-1 text-sm text-gray-500">(24)</span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-6 text-gray-700 leading-relaxed">
                                {product.description}
                            </p>

                            {hasVariants && (
                                <div className="mt-8 space-y-8">

                                    {product.colors.length > 0 && (
                                        <div>
                                            <h3 className="text-sm text-gray-900 uppercase tracking-wider mb-3">Color</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {product.colors.map((color) => (
                                                    <button
                                                        key={color.id}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${selectedColor?.id === color.id ? 'border-indigo-500 shadow-sm' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color.hex_code }}
                                                        title={color.name}
                                                    >
                                                        {selectedColor?.id === color.id && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-5 h-5 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center"
                                                            >
                                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex_code }} />
                                                            </motion.div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}


                                    {product.sizes.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm text-gray-900 uppercase tracking-wider">Size</h3>
                                                <a
                                                    href="#"
                                                    className="text-xs text-indigo-600 hover:text-indigo-500"
                                                >
                                                    Size guide
                                                </a>
                                            </div>
                                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                                {product.sizes.map((size) => (
                                                    <button
                                                        key={size.id}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`p-2 border rounded-xl text-center transition-all ${selectedSize?.id === size.id ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent' : 'bg-white text-gray-900 border-gray-200'} ${!size.in_stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={!size.in_stock}
                                                    >
                                                        <span className=" block">{size.name}</span>
                                                        {size.price && (
                                                            <span className="text-xs mt-1 block">${size.price}</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm text-gray-900 uppercase tracking-wider">Quantity</h3>
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                                        <button
                                            onClick={decrementQuantity}
                                            className="px-4 py-2 text-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 text-lg border-x border-gray-200">{quantity}</span>
                                        <button
                                            onClick={incrementQuantity}
                                            className="px-4 py-2 text-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center">
                                    <button
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 border border-transparent rounded-xl py-3 px-6 flex items-center justify-center text-sm font-bold uppercase tracking-wider text-white hover:shadow-sm transition-all"
                                    >
                                        Add to cart
                                    </button>


                                </div>
                            </div>
                        </motion.div>

                        <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="mt-12 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xs border border-gray-200"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 uppercase mb-6">
                                Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Details</span>
                            </h2>
                            <div className="prose text-gray-700">
                                <p className="mb-4">
                                    {product.description}
                                </p>
                                <ul className="space-y-2">
                                    {[
                                        "Premium quality materials",
                                        "Handcrafted with attention to detail",
                                        "Ethically sourced components",
                                        "Designed for durability and style",
                                        "Easy to maintain and care for"
                                    ].map((item, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ x: -20, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex items-start"
                                        >
                                            <span className="mr-2 mt-1 flex-shrink-0">
                                                <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.section>


                        <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            className="mt-12 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xs border border-gray-200"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 uppercase">
                                    Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Reviews</span>
                                </h2>
                                <button className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    View All
                                </button>
                            </div>


                            {/* static reviews  */}
                            <div className="space-y-8">
                                {[1, 2, 3].map((review) => (
                                    <motion.div
                                        key={review}
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ delay: review * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex gap-4"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={`https://i.pravatar.cc/150?img=${review + 10}`}
                                                alt=""
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900">
                                                    Customer {review}
                                                </h3>
                                                <span className="text-xs text-gray-400">• 1 week ago</span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-700">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}