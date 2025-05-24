import { X } from "lucide-react"
import { useEffect, useState } from "react"
import apiActions from "../api/apiActions"
import { useSelector, useDispatch } from "react-redux"
import { removeCartItem } from "../store/cart/cartActions"

export default function CartItem({ item }) {

    const { products: productState } = useSelector(state => state.products)
    const { isAuthenticated } = useSelector(state => state.auth)
    const [product, setProduct] = useState(isAuthenticated ? item.product : null)
    const [loading, setLoading] = useState(false)
    const [size, setSize] = useState(isAuthenticated ? item.size : null)
    const [color, setColor] = useState(isAuthenticated ? item.color : null)
    const dispatch = useDispatch()

    const handleDeleteItem = async () => {
        try {
            if (isAuthenticated) {

                await dispatch(removeCartItem({
                    itemId: item.id
                })).unwrap();
            } else {

                await dispatch(removeCartItem({
                    productId: item.product_id,
                    sizeId: item.size_id,
                    colorId: item.color_id
                })).unwrap();
            }
        } catch (error) {
            console.log("Failed to remove item");
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            const foundProduct = productState.products?.find(p => p.id === item.product_id)

            if (foundProduct) {
                setProduct(foundProduct)
                const foundSize = foundProduct.sizes?.find(s => s.id === item.size_id)
                const foundColor = foundProduct.colors?.find(c => c.id === item.color_id)
                setSize(foundSize)
                setColor(foundColor)
            } else {

                setLoading(true)
                apiActions.fetchProduct(item.product_id)
                    .then(fetchedProduct => {
                        setProduct(fetchedProduct)
                        const foundSize = fetchedProduct.sizes?.find(s => s.id === item.size_id)
                        const foundColor = fetchedProduct.colors?.find(c => c.id === item.color_id)
                        setSize(foundSize)
                        setColor(foundColor)
                    })
                    .catch(error => {
                        console.error("Error fetching product:", error)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        }
    }, [isAuthenticated, item.product_id, item.size_id, item.color_id, productState.products])

    if (loading) {
        return (
            <div className="flex items-center p-4 hover:bg-gray-100 duration-300/50">
                <div className="w-14 h-14 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
            </div>
        )
    }

    if (!product) {
        return null
    }

    return (
        <div
            key={isAuthenticated ? item.id : `${item.product_id}-${item.size_id}-${item.color_id}`}
            className="flex items-center p-4 hover:bg-gray-100 duration-300/50"
        >
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mr-4 overflow-hidden">
                {product.attachments?.length > 0 ? (
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
                    {product.title}
                </h4>
                <div className="flex items-center text-xs text-gray-500">
                    Taille: {size?.name || 'N/A'} | Couleur: <span
                        className='h-4 w-4 mx-0.5 rounded-full border-2 border-gray-300'
                        style={{ background: color?.hex_code || "#FFFFFF" }}
                    ></span>
                </div>
                <div className="flex items-center mt-1">
                    <span className="text-sm font-semibold text-indigo-600">
                        ${size?.price || product.price || '0.00'}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                        Qté: {item.quantity || 1}
                    </span>
                </div>
            </div>

            <button
                onClick={()=>handleDeleteItem()}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full"
            >
                <X size={16} className="stroke-[2.5px]" />
            </button>
        </div>
    )
}