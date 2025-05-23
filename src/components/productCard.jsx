import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { HeartIcon, ShoppingCartIcon, InfoIcon, Loader2Icon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { addCartItem } from "../store/cart/cartActions";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ProductCard({
    product,
    isFavorite,
    toggleFavorite,
    onViewDetails
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const [selectedOption, setSelectedOptions] = useState({
        size_id: null,
        color_id: null,
        product_id: product?.id ?? null,
        quantity: 1
    });

    const dispatch = useDispatch();
    const carouselApi = useRef(null);

    const goToSlide = (index) => {
        setCurrentIndex(index);
        carouselApi.current?.scrollTo(index);
    };

    const handleSelect = (api) => {
        setCurrentIndex(api.selectedScrollSnap());
    };

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        const { size_id, color_id, product_id } = selectedOption;

        if (!size_id || !color_id || !product_id) {

            toast("Ajout au panier échoué");
            return;
        }

        try {
            await dispatch(addCartItem(selectedOption)).unwrap();
            toast("Produit ajouté au panier");
        } catch (error) {

            toast("Impossible d'ajouter le produit.");
        }
    };

    const handleViewDetails = (e) => {
        e.stopPropagation();
        onViewDetails?.(product);
    };

    return (
        <motion.div
            className="relative h-[500px] group rounded-xl overflow-hidden shadow-xs border border-gray-200 transition-all duration-300 bg-white"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleViewDetails}
            role="button"
            aria-label={`View details for ${product.title}`}
        >
            {/* Color selectors */}
            <div className="absolute z-10 top-3 left-3 grid grid-cols-5 gap-2">
                {product.colors.map((color) => (
                    <div
                        key={color.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOptions(prev => ({
                                ...prev,
                                color_id: color.id
                            }));
                        }}
                        className={`h-7 duration-300 w-7 ${selectedOption.color_id === color.id ? "border-3 border-indigo-500" : "border-2 border-gray-300"} rounded-full cursor-pointer`}
                        style={{ backgroundColor: color.hex_code }}
                    />
                ))}
            </div>

            {/* Image carousel */}
            <Carousel
                className="w-full h-full"
                setApi={(api) => {
                    carouselApi.current = api;
                    api?.on("select", handleSelect);
                }}
            >
                <CarouselContent className="w-full h-full">
                    {product?.images?.length > 0 ? (
                        product.images.map((image, idx) => (
                            <CarouselItem key={idx} className="w-full h-full p-0">
                                <div className="relative w-full h-full">
                                    {isImageLoading && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                                            <Loader2Icon className="h-8 w-8 text-gray-300 animate-spin" />
                                        </div>
                                    )}
                                    <img
                                        src={image.path}
                                        alt={`${product.title} - Image ${idx + 1}`}
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"
                                            }`}
                                        onLoad={handleImageLoad}
                                        loading="lazy"
                                    />
                                </div>
                            </CarouselItem>
                        ))
                    ) : (
                        <CarouselItem className="w-full h-full p-0">
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">No image available</span>
                            </div>
                        </CarouselItem>
                    )}
                </CarouselContent>
            </Carousel>

            {/* Favorite button */}
            <motion.button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite?.(product.id);
                }}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm border ${isFavorite
                    ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-300"
                    : "bg-white/80 text-gray-700 hover:bg-white border-gray-300"
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <motion.div animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
                    <HeartIcon className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                </motion.div>
            </motion.button>

            {/* Info & Add to Cart */}
            <div
                className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered
                    ? "bg-gradient-to-t from-black/100 via-black/80 to-transparent"
                    : "bg-gradient-to-t from-black/90 to-transparent"
                    }`}
            >
                <div className="flex justify-between items-start mb-1">
                    <div className="max-w-[70%]">
                        <h3 className="font-bold text-lg text-white truncate" title={product.title}>
                            {product.title}
                        </h3>
                        {product.category && (
                            <span className="text-xs font-medium text-gray-300">
                                {product.category.name}
                            </span>
                        )}
                    </div>
                </div>

                {/* Size selectors */}
                {product.sizes.length > 0 && (
                    <div className="flex gap-1 mb-2 flex-wrap">
                        {product.sizes.map((size) => (
                            <motion.button
                                key={size.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOptions(prev => ({
                                        ...prev,
                                        size_id: size.id
                                    }));
                                }}
                                className={`text-xs px-3 py-1 rounded-md cursor-pointer ${selectedOption.size_id === size.id
                                    ? "bg-white text-black font-bold"
                                    : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                            >
                                {size.name}
                            </motion.button>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {isHovered ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="flex items-center justify-between"
                        >
                            <Link
                                to={`/product/${product.id}`}
                                className="border uppercase border-white/30 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 hover:bg-white/10"
                                onClick={handleViewDetails}
                            >
                                <InfoIcon className="h-3 w-3" /> Details
                            </Link>

                            <button
                                className="bg-white uppercase text-black text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 hover:bg-gray-100 disabled:opacity-50"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCartIcon className="h-3 w-3" /> Add to cart
                            </button>
                        </motion.div>
                    ) : (
                        <div className="h-6" />
                    )}
                </AnimatePresence>
            </div>

            {/* Slide indicators */}
            {product.attachments.length > 1 && (
                <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {product.images.map((_, idx) => (
                        <motion.button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                goToSlide(idx);
                            }}
                            className={`h-2 rounded-full transition-all ${currentIndex === idx ? "bg-white w-5 shadow-sm" : "bg-white/50 hover:bg-white/70 w-2"
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}
