import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000"
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [cartItemDetails, setCartItemDetails] = useState({}); // New state for form details
    const [token, setToken] = useState("")
    const currency = "$";
    const deliveryCharge = 5;

    const addToCart = async (itemId, formData = null) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        
        // Store form data if provided
        if (formData) {
            setCartItemDetails((prev) => ({
                ...prev,
                [itemId]: formData
            }));
        }
        
        if (token) {
            // Update the API call to include form data
            await axios.post(url + "/api/cart/add", { 
                itemId,
                formData
            }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        
        // Remove item details if count reaches 0
        if (cartItems[itemId] === 1) {
            setCartItemDetails((prev) => {
                const newDetails = { ...prev };
                delete newDetails[itemId];
                return newDetails;
            });
        }
        
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }  
            } catch (error) {
                
            }
            
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
        
        // Load cart item details if available in the response
        if (response.data.cartItemDetails) {
            setCartItemDetails(response.data.cartItemDetails);
        }
    }

    // New function to place order with all details
    const placeOrder = async (address) => {
        try {
            if (token) {
                const orderData = {
                    items: Object.keys(cartItems).map(itemId => ({
                        itemId,
                        quantity: cartItems[itemId],
                        // Include form data if available for this item
                        ...(cartItemDetails[itemId] ? {
                            customerName: cartItemDetails[itemId].customerName,
                            deliveryDate: cartItemDetails[itemId].deliveryDate,
                            deliveryTime: cartItemDetails[itemId].deliveryTime,
                            specialRequests: cartItemDetails[itemId].specialRequests
                        } : {})
                    })),
                    amount: getTotalCartAmount() + deliveryCharge,
                    address,
                    // Add overall customer info if needed
                    customerName: Object.values(cartItemDetails)[0]?.customerName || "",
                    deliveryDate: Object.values(cartItemDetails)[0]?.deliveryDate || "",
                    deliveryTime: Object.values(cartItemDetails)[0]?.deliveryTime || "",
                    specialRequests: Object.values(cartItemDetails)[0]?.specialRequests || ""
                };
                
                const response = await axios.post(url + "/api/order/create", orderData, { 
                    headers: { token } 
                });
                
                // Clear cart after successful order
                if (response.data.success) {
                    setCartItems({});
                    setCartItemDetails({});
                }
                
                return response.data;
            }
        } catch (error) {
            console.error("Error placing order:", error);
            throw error;
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        cartItemDetails, // Expose the form details
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        placeOrder, // Expose the new function
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;