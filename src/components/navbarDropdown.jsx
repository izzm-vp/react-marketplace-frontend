import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useClickOutside } from '../hooks/handleClickOutside';

const NavbarItem = ({ item, index, customTransition }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useClickOutside(dropdownRef, () => {
        setIsOpen(false);
    });

    return (
        <div key={item.name} className="relative" ref={dropdownRef}>
            <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...customTransition, delay: 0.1 + index * 0.05 }}
                whileHover={{
                    color: '#4f46e5',
                    backgroundColor: 'rgba(238, 242, 255, 0.5)',
                    transition: customTransition
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => item.dropdown ? setIsOpen(!isOpen) : null}
                className={`flex items-center space-x-1 px-5 py-2.5 rounded-2xl transition-all ${isOpen
                    ? 'text-indigo-600 bg-indigo-50/70 text-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                    }`}
            >
                <span className="text-sm uppercase tracking-wide">{item.name}</span>
                {item.dropdown && (
                    isOpen ?
                        <ChevronUp size={16} className="stroke-[2.5px] text-indigo-500" /> :
                        <ChevronDown size={16} className="stroke-[2.5px] text-gray-500 group-hover:text-indigo-500" />
                )}
            </motion.button>

            <AnimatePresence>
                {item.dropdown && isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{
                            ...customTransition,
                            scale: { duration: 0.15 }
                        }}
                        className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-sm z-50 border border-gray-200 overflow-hidden backdrop-blur-sm bg-opacity-95"
                        style={{
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}
                    >
                        {item.items.map((subItem, idx) => (
                            <motion.a
                                key={subItem}
                                href="#"
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ ...customTransition, delay: idx * 0.03 }}
                                className={`block px-4 py-3 text-sm ${idx === 0 ? '' : 'border-t border-gray-200'
                                    } text-gray-700 hover:bg-indigo-50/50 hover:text-indigo-600 transition-colors group`}
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="flex items-center">
                                    <span className="flex-1">{subItem}</span>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NavbarItem;