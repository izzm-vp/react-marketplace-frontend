import { useState, useRef } from 'react';
import { ShoppingCart, Search, User, Menu, X, ChevronDown, Mail, Lock, LogOut, Loader2, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '../hooks/handleClickOutside';
import { Dialog, DialogContent } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import NavbarItem from './navbarDropdown';
import { useSelector, useDispatch } from "react-redux";
import { loginUser, registerUser, logoutUser } from "../store/auth/authActions"
import { toast } from "sonner"
import { addMultipleCartItems, fetchUserCart } from '../store/cart/cartActions';
import { Link } from 'react-router-dom';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isHoveringCart, setIsHoveringCart] = useState(false);
    const [isHoveringUser, setIsHoveringUser] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const mobileMenuRef = useRef(null);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const customTransition = {
        type: 'spring',
        bounce: 0,
        duration: 0.25,
    };

    // REDUX
    const { isAuthenticated, user } = useSelector(state => state.auth)
    const { items } = useSelector(state => state.cart)
    const { products: productState } = useSelector(state => state.products);
    const dispatch = useDispatch()


    // Fermer le menu mobile quand on clique à l'extérieur
    useClickOutside(mobileMenuRef, () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
            document.body.style.overflow = '';
        }
    });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = isMenuOpen ? '' : 'hidden';
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const toggleDropdown = (item) => {
        setActiveDropdown(activeDropdown === item ? null : item);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (
            !loginData.email ||
            !loginData.password ||
            !loginData.password
        ) {
            toast("Tous les champs son requis");

            return;
        }

        try {
            setIsLoading(true)
            const data = await dispatch(loginUser(loginData)).unwrap();

            // migrate guest card to user card
            await dispatch(addMultipleCartItems(data.user.user.id)).unwrap();

            // fetch user cart with new items included
            await dispatch(fetchUserCart()).unwrap();

            toast("Connexion avec success");

            setIsAuthDialogOpen(false);

        } catch (error) {

            toast("Une erreur est survenue");

        } finally {
            setIsLoading(false)
        }

        setLoginData({
            email: '',
            password: ''
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (
            !registerData.email ||
            !registerData.password ||
            !registerData.confirmPassword ||
            registerData.password !== registerData.confirmPassword
        ) {
            toast("Tous les champs son requis");

            return;
        }

        try {

            setIsLoading(true)
            await dispatch(registerUser(registerData)).unwrap();
            setIsAuthDialogOpen(false);
            toast("Veuillez vérifier votre email pour activer votre compte.");




        } catch (error) {
            toast("Une erreur est survenue");


        } finally {
            setIsLoading(false)
        }
    };

    const handleLogout = async () => {
        try {

            await dispatch(logoutUser()).unwrap();
            dispatch(resetCart());


            toast("Déconnexion avec success");


        } catch (error) {
            toast("Une erreur est survenue");


        }
        setIsHoveringUser(false);
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const navItems = [
        { name: 'Accueil', href: '#', dropdown: false },
        {
            name: 'Catégories',
            href: '#',
            dropdown: true,
            items: ['Électronique', 'Mode', 'Maison & Jardin', 'Beauté']
        },
        { name: 'Promotions', href: '#', dropdown: false },
        {
            name: 'Vendeurs',
            href: '#',
            dropdown: true,
            items: ['Top Vendeurs', 'Nouveaux Vendeurs', 'Vendeurs Locaux']
        },
    ];

    const menuVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "100%" }
    };

    return (
        <motion.nav
            className={`fixed w-full uppercase top-0 z-50 bg-white/95 backdrop-blur-3xl shadow-sm`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to={"/"} className="flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            MarketPlace
                        </span>
                    </Link>

                    {/* Navigation desktop */}
                    <div className="hidden md:flex md:items-center md:space-x-1 flex-1 justify-center">
                        {navItems.map((item, index) => (
                            <div key={item.name} className="relative">
                                <NavbarItem index={index} item={item} customTransition={customTransition} />
                            </div>
                        ))}
                    </div>

                    {/* Recherche et actions */}
                    <div className="flex items-center space-x-4">
                        {/* Bouton recherche mobile */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={customTransition}
                            className="md:hidden p-2 rounded-full focus:ring-2 focus:ring-indigo-500 transition-all text-gray-600 hover:bg-gray-100"
                            onClick={toggleMenu}
                        >
                            <Search size={20} />
                        </motion.button>

                        {/* Recherche desktop */}
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 240 }}
                            transition={{ ...customTransition, delay: 0.25 }}
                            className="hidden md:block relative"
                        >
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    className="w-full border border-gray-300 shadow-xs pl-4 pr-10 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Rechercher..."
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                                >
                                    <Search size={18} />
                                </button>
                            </form>
                        </motion.div>

                        {/* Actions utilisateur */}
                        <div className="hidden md:flex items-center space-x-3">
                            {isAuthenticated ? (
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsHoveringUser(true)}
                                    onMouseLeave={() => setIsHoveringUser(false)}
                                >
                                    <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
                                        <User size={20} />
                                    </button>

                                    <AnimatePresence>
                                        {isHoveringUser && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={customTransition}
                                                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-sm border border-gray-300 z-50 border border-gray-300 overflow-hidden"
                                            >
                                                <div className="p-4 border-b border-gray-300 bg-gradient-to-r from-indigo-50 to-purple-50">

                                                    <p className="text-sm font-semibold text-gray-600 mt-1">{user?.email}</p>
                                                </div>

                                                <div className="p-2">
                                                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 duration-300 rounded-xl text-sm font-medium">
                                                        Profil
                                                    </a>
                                                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 duration-300 rounded-xl text-sm font-medium">
                                                        Commandes
                                                    </a>
                                                    <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 duration-300 rounded-xl text-sm font-medium">
                                                        Paramètres
                                                    </a>
                                                </div>

                                                <div className="p-2 border-t border-gray-200">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full uppercase flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium"
                                                    >
                                                        <LogOut size={16} className="mr-2" />
                                                        Déconnexion
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsAuthDialogOpen(true);
                                        setActiveTab('login');
                                    }}
                                    className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                                >
                                    <User size={20} />
                                </button>
                            )}

                            <div
                                className="relative"
                                onMouseEnter={() => setIsHoveringCart(true)}
                                onMouseLeave={() => setIsHoveringCart(false)}
                            >
                                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
                                    <ShoppingCart size={20} />
                                    {items.length > 0 && (
                                        <span className="absolute -top-1 -right-1 p-2 bg-indigo-600 text-white text-xs border-3 border-gray-300 rounded-full h-5 w-5 flex items-center justify-center">
                                            {items.length}
                                        </span>
                                    )}
                                </button>

                                {/* Panier */}
                                {isHoveringCart && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={customTransition}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-sm border border-gray-300 z-50 border border-gray-300 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-gray-300 bg-gradient-to-r from-indigo-50 to-purple-50">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-800">Votre Panier</h3>
                                                <span className="text-xs font-medium border border-gray-300 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                                                    {items.length} {items.length === 1 ? 'article' : 'articles'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="max-h-80 overflow-y-auto">
                                            {items.length > 0 ? (
                                                items.map((item) => {

                                                    const product = isAuthenticated
                                                        ? item.product
                                                        : productState?.products?.find(p => p.id === item.product_id);

                                                    const size = isAuthenticated
                                                        ? item.size
                                                        : product?.sizes?.find(s => s.id === item.size_id);

                                                    const color = isAuthenticated
                                                        ? item.color
                                                        : product?.colors?.find(c => c.id === item.color_id);

                                                    if (!isAuthenticated && !product) return null;

                                                    return (
                                                        <div
                                                            key={isAuthenticated ? item.id : `${item.product_id}-${item.size_id}-${item.color_id}`}
                                                            className="flex items-center p-4 hover:bg-gray-100 duration-300/50"
                                                        >
                                                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mr-4 overflow-hidden">
                                                                {product?.attachments?.length > 0 ? (
                                                                    <img
                                                                        src={product.attachments[0].path}
                                                                        alt={product.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full border-2 border-indigo-600 h-full rounded-full flex items-center justify-center">
                                                                        <span className="text-xs font-bold text-indigo-600">IMG</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-medium text-gray-800 truncate">
                                                                    {product?.title}
                                                                </h4>
                                                                <div className="flex items-center text-xs text-gray-500">
                                                                    Taille: {size?.name || 'N/A'} | Couleur: <span
                                                                        className='h-4 w-4 mx-0.5 rounded-full border-2 border-gray-300'
                                                                        style={{ background: color?.hex_code || "#FFFFFF" }}
                                                                    ></span>
                                                                </div>
                                                                <div className="flex items-center mt-1">
                                                                    <span className="text-sm font-semibold text-indigo-600">
                                                                        ${size?.price || '0.00'}
                                                                    </span>
                                                                    <span className="mx-2 text-gray-300">•</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        Qté: {item.quantity || 1}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <button
                                                                className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                                            >
                                                                <X size={16} className="stroke-[2.5px]" />
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="p-6 text-center">
                                                    <p className="text-gray-500">Votre panier est vide</p>
                                                </div>
                                            )}
                                        </div>

                                        {items.length > 0 && (
                                            <div className="p-4 border-t border-gray-300 bg-gradient-to-r from-gray-50 to-white">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Sous-total</span>
                                                        <span className="text-sm font-semibold">
                                                            ${items.reduce((total, item) => {
                                                                const product = isAuthenticated
                                                                    ? item.product
                                                                    : productState.products.find(p => p.id === item.product_id);
                                                                const size = isAuthenticated
                                                                    ? item.size
                                                                    : product?.sizes?.find(s => s.id === item.size_id);
                                                                return total + (parseFloat(size?.price || 0) * (item.quantity || 1));
                                                            }, 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Livraison</span>
                                                        <span className="text-sm font-semibold text-green-600">Gratuite</span>
                                                    </div>
                                                    <div className="flex justify-between pt-2">
                                                        <span className="text-base font-medium text-gray-800">Total</span>
                                                        <span className="text-base font-bold text-indigo-600">
                                                            ${items.reduce((total, item) => {
                                                                const product = isAuthenticated
                                                                    ? item.product
                                                                    : productState.products.find(p => p.id === item.product_id);
                                                                const size = isAuthenticated
                                                                    ? item.size
                                                                    : product?.sizes?.find(s => s.id === item.size_id);
                                                                return total + (parseFloat(size?.price || 0) * (item.quantity || 1));
                                                            }, 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button className="w-full mt-4 py-3 uppercase bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium">
                                                    Commander
                                                </Button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Bouton menu mobile */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={customTransition}
                            onClick={toggleMenu}
                            className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        <motion.div
                            ref={mobileMenuRef}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            transition={{ duration: 0.3 }}
                            className="md:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 pt-24 overflow-y-auto shadow-2xl"
                        >
                            <div className="container mx-auto px-6 py-6">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    aria-label="Fermer le menu"
                                >
                                    <X size={24} strokeWidth={2} />
                                </motion.button>

                                {isAuthenticated && (
                                    <div className="mb-6 px-5 py-4 bg-indigo-50 rounded-full">
                                        <p className="text-sm text-gray-600">Connecté en tant que</p>
                                        <p className="font-medium text-gray-900">{user?.email}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSearch} className="relative mb-10">
                                    <div className="relative">
                                        <input
                                            className="w-full pl-5 pr-12 py-4 border border-gray-300 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-800 placeholder-gray-400"
                                            placeholder="Rechercher..."
                                            type="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                                        >
                                            <Search size={22} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-2 mb-10">
                                    {navItems.map((item) => (
                                        <div key={item.name} className="overflow-hidden">
                                            <button
                                                onClick={() => item.dropdown ? toggleDropdown(item.name) : null}
                                                className={`flex items-center justify-between w-full px-5 py-4 rounded-full ${activeDropdown === item.name ? 'bg-indigo-50 text-indigo-600' : 'text-gray-800'
                                                    }`}
                                            >
                                                <span className="font-medium text-lg">{item.name}</span>
                                                {item.dropdown && (
                                                    <ChevronDown
                                                        size={20}
                                                        strokeWidth={2.5}
                                                        className={`transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                )}
                                            </button>

                                            <AnimatePresence>
                                                {item.dropdown && activeDropdown === item.name && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="pl-6 overflow-hidden"
                                                    >
                                                        {item.items.map((subItem) => (
                                                            <a
                                                                key={subItem}
                                                                href="#"
                                                                className="block px-5 py-3 text-gray-600 hover:bg-indigo-50 rounded-full font-medium"
                                                            >
                                                                {subItem}
                                                            </a>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-gray-100">
                                    <div className="flex space-x-4 mb-6">
                                        {isAuthenticated ? (
                                            <>
                                                <button
                                                    className="flex-1 flex flex-col items-center justify-center p-4 rounded-full bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                                                >
                                                    <User size={22} strokeWidth={2} />
                                                    <span className="mt-2 text-sm font-medium">Profil</span>
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex-1 flex flex-col items-center border border-red-300 justify-center p-4 rounded-full text-gray-700 bg-red-100"
                                                >
                                                    <LogOut size={22} strokeWidth={2} />
                                                    <span className="mt-2 text-sm font-medium">Déconnexion</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        setIsAuthDialogOpen(true);
                                                        setActiveTab('login');
                                                    }}
                                                    className="flex-1 flex flex-col items-center justify-center p-4 rounded-full bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                                                >
                                                    <User size={22} strokeWidth={2} />
                                                    <span className="mt-2 text-sm font-medium">Connexion</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        setIsAuthDialogOpen(true);
                                                        setActiveTab('register');
                                                    }}
                                                    className="flex-1 flex border border-gray-300 flex-col items-center justify-center p-4 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                >
                                                    <User size={22} strokeWidth={2} />
                                                    <span className="mt-2 text-sm font-medium">Inscription</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        className="w-full flex border border-gray-300 items-center justify-center p-4 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 relative"
                                    >
                                        <ShoppingCart size={22} strokeWidth={2} />
                                        <span className="mt-0 ml-2 text-sm font-medium">Panier</span>
                                        <span className="absolute border-3 border-gray-300 top-3 right-6 bg-indigo-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                            3
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modal d'authentification */}
            <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
                <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="relative"
                    >
                        <div className="absolute inset-0 overflow-hidden opacity-20">
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl opacity-70 animate-float"></div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl opacity-70 animate-float-delay"></div>
                        </div>

                        <div className="relative px-10 pt-10 z-10">
                            <TabsList className="grid w-full grid-cols-2 bg-gray-100 border border-gray-300 h-14 rounded-2xl p-1">
                                <TabsTrigger
                                    value="login"
                                    className="relative z-10 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-400 text-sm font-medium transition-all duration-300 rounded-3xl h-full"
                                >
                                    {activeTab === 'login' && (
                                        <motion.span
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 bg-white rounded-3xl z-0"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">Connexion</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="register"
                                    className="relative z-10 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-400 text-sm font-medium transition-all duration-300 rounded-3xl h-full"
                                >
                                    {activeTab === 'register' && (
                                        <motion.span
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 bg-white rounded-3xl z-0"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">Créer un compte</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="relative px-10 pb-10 z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TabsContent value="login" className="mt-8">
                                        <form onSubmit={handleLogin}>
                                            <div className="space-y-6">
                                                <div className="relative">
                                                    <Label htmlFor="email" className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Email</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="email"
                                                            name="email"
                                                            placeholder="votre@email.com"
                                                            type="email"
                                                            value={loginData.email}
                                                            onChange={handleLoginChange}
                                                            className="mt-1 h-14 rounded-full border-gray-300 focus:border-indigo-500 pl-14 bg-gray-100 border border-gray-300 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50"
                                                        />
                                                        <div className="absolute left-2 top-1/2 border border-gray-300 -translate-y-1/2 p-2 bg-indigo-100 rounded-full">
                                                            <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label htmlFor="password" className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mot de passe</Label>
                                                        <button type="button" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors duration-200 uppercase ">Mot de passe oublié?</button>
                                                    </div>
                                                    <div className="relative">
                                                        <Input
                                                            id="password"
                                                            name="password"
                                                            placeholder="••••••••"
                                                            type="password"
                                                            value={loginData.password}
                                                            onChange={handleLoginChange}
                                                            className="mt-1 h-14 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pl-14 bg-gray-100 border border-gray-300 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50"
                                                        />
                                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-100 border border-gray-300 rounded-full">
                                                            <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full h-14 rounded-full uppercase bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-sm border border-gray-300 hover:shadow-indigo-500/20 transition-all duration-300 relative overflow-hidden group"
                                                    size="lg"
                                                >
                                                    {isLoading ? (
                                                        <div className="flex items-center justify-center">
                                                            <Loader className="size-7 animate-spin text-white" />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="relative z-10">se connecter</span>
                                                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
                                                        </>
                                                    )}
                                                </Button>

                                                <div className="text-center uppercase text-sm text-gray-500 dark:text-gray-400 mt-6">
                                                    Pas de compte?{' '}
                                                    <button
                                                        type="button"
                                                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition-colors duration-200"
                                                        onClick={() => setActiveTab('register')}
                                                    >
                                                        S'inscrire
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </TabsContent>

                                    <TabsContent value="register" className="mt-8">
                                        <form onSubmit={handleRegister}>
                                            <div className="space-y-6">
                                                <div className="relative">
                                                    <Label htmlFor="reg-email" className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Email</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="reg-email"
                                                            name="email"
                                                            placeholder="votre@email.com"
                                                            type="email"
                                                            value={registerData.email}
                                                            onChange={handleRegisterChange}
                                                            className="mt-1 h-14 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pl-14 bg-gray-100 border border-gray-300 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50"
                                                        />
                                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-100 border border-gray-300 rounded-full">
                                                            <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <Label htmlFor="reg-password" className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Mot de passe</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="reg-password"
                                                            name="password"
                                                            placeholder="••••••••"
                                                            type="password"
                                                            value={registerData.password}
                                                            onChange={handleRegisterChange}
                                                            className="mt-1 h-14 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pl-14 bg-gray-100 border border-gray-300 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50"
                                                        />
                                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-100 border border-gray-300 rounded-full">
                                                            <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <Label htmlFor="confirm-password" className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Confirmer le mot de passe</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="confirm-password"
                                                            name="confirmPassword"
                                                            placeholder="••••••••"
                                                            type="password"
                                                            value={registerData.confirmPassword}
                                                            onChange={handleRegisterChange}
                                                            className="mt-1 h-14 rounded-full border-gray-300 focus:border-indigo-500 pl-14 bg-gray-100 border border-gray-300 backdrop-blur-sm transition-all duration-300 focus:shadow-md focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50"
                                                        />
                                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-100 border border-gray-300 rounded-full">
                                                            <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full h-14 rounded-full uppercase bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-sm border border-gray-300 hover:shadow-indigo-500/20 transition-all duration-300 relative overflow-hidden group"
                                                    size="lg"
                                                >
                                                    {isLoading ? (
                                                        <div className="flex items-center justify-center">
                                                            <Loader className="size-7 animate-spin text-white" />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="relative z-10">Créer un compte</span>
                                                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
                                                        </>
                                                    )}
                                                </Button>

                                                <div className="text-center uppercase  text-sm text-gray-500 dark:text-gray-400 mt-6">
                                                    Déjà un compte?{' '}
                                                    <button
                                                        type="button"
                                                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition-colors duration-200"
                                                        onClick={() => setActiveTab('login')}
                                                    >
                                                        Se connecter
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </motion.nav>
    );
};

export default Navbar;