import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

// Import service category images
import plumbing from "../assets/images/plumbing.png";
import electrical from "../assets/images/Electrician.png";
import cleaning from "../assets/images/cleaning.png";
import landscaping from "../assets/images/landscaping.png";
import driver from "../assets/images/driver.png";
import repair from "../assets/images/homedecor.png";
import appliance from "../assets/images/appliance.png";
import hvac from "../assets/images/hvac.png";
import all from "../assets/images/all.jpg";

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000";
    const [service_list, setServiceList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [cartItemDetails, setCartItemDetails] = useState({}); // For form details
    const [token, setToken] = useState("");
    const currency = "$";
    const deliveryCharge = 5;

    // Define service categories with imported images
    const service_categories = [
        { category_name: "All", category_image: all },
        { category_name: "Plumbing", category_image: plumbing },
        { category_name: "Electrical", category_image: electrical },
        { category_name: "Cleaning", category_image: cleaning },
        { category_name: "HVAC", category_image: hvac },
        { category_name: "Driver", category_image: driver },
        { category_name: "Home Repair", category_image: repair },
        { category_name: "Appliance Repair", category_image: appliance },
        { category_name: "Landscaping", category_image: landscaping }
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