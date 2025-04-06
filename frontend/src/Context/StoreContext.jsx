import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000";
    const [service_list, setServiceList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [cartItemDetails, setCartItemDetails] = useState({}); // For form details
    const [token, setToken] = useState("");
    const currency = "$";
    const deliveryCharge = 5;

    // Define service categories
    const service_categories = [
        {
            category_name: "Plumbing",
            category_image: "/images/categories/plumbing.jpg"
        },
        {
            category_name: "Electrical",
            category_image: "/images/categories/electrical.jpg"
        },
        {
            category_name: "Cleaning",
            category_image: "/images/categories/cleaning.jpg"
        },
        {
            category_name: "Painting",
            category_image: "/images/categories/painting.jpg"
        },
        {
            category_name: "Carpentry",
            category_image: "/images/categories/carpentry.jpg"
        },
        {
            category_name: "Home Repair",
            category_image: "/images/categories/repair.jpg"
        },
        {
            category_name: "Appliance Repair",
            category_image: "/images/categories/appliance.jpg"
        },
        {
            category_name: "Gardening",
            category_image: "/images/categories/gardening.jpg"
        }
    ];

    const addToCart = async (itemId, formData = null) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
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
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        
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
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
                if (cartItems[item] > 0) {
                    let itemInfo = service_list.find((service) => service._id === item);
                    if (itemInfo) {
                        totalAmount += itemInfo.price * cartItems[item];
                    }
                }
            } catch (error) {
                console.error("Error calculating cart amount:", error);
            }
        }
        return totalAmount;
    };

    const fetchServiceList = async () => {
        try {
            // First try to fetch from services API
            const response = await axios.get(url + "/api/services/list");
            if (response.data.success) {
                setServiceList(response.data.data);
            }
        } catch (serviceError) {
            console.error("Error fetching service list:", serviceError);
            try {
                // Fallback to food API during transition
                const foodResponse = await axios.get(url + "/api/food/list");
                if (foodResponse.data.success) {
                    setServiceList(foodResponse.data.data);
                }
            } catch (foodError) {
                console.error("Error fetching food list fallback:", foodError);
                setServiceList([]);
            }
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
            setCartItems(response.data.cartData || {});
            
            // Load cart item details if available in the response
            if (response.data.cartItemDetails) {
                setCartItemDetails(response.data.cartItemDetails);
            }
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    };

    // Function to place order with all details
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
                            serviceDate: cartItemDetails[itemId].serviceDate || cartItemDetails[itemId].deliveryDate,
                            serviceTime: cartItemDetails[itemId].serviceTime || cartItemDetails[itemId].deliveryTime,
                            address: cartItemDetails[itemId].address || "",
                            specialRequests: cartItemDetails[itemId].specialRequests
                        } : {})
                    })),
                    amount: getTotalCartAmount() + deliveryCharge,
                    address,
                    // Add overall customer info if needed
                    customerName: Object.values(cartItemDetails)[0]?.customerName || "",
                    serviceDate: Object.values(cartItemDetails)[0]?.serviceDate || 
                               Object.values(cartItemDetails)[0]?.deliveryDate || "",
                    serviceTime: Object.values(cartItemDetails)[0]?.serviceTime || 
                               Object.values(cartItemDetails)[0]?.deliveryTime || "",
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
    };

    useEffect(() => {
        async function loadData() {
            await fetchServiceList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData({ token: localStorage.getItem("token") });
            }
        }
        loadData();
    }, []);

    const contextValue = {
        url,
        food_list: service_list, // For backward compatibility
        service_list,
        menu_list: service_categories, // For backward compatibility
        service_categories,
        cartItems,
        cartItemDetails,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        placeOrder,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;