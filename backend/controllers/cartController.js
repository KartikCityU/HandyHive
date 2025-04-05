import userModel from "../models/userModel.js"

// add to user cart  
const addToCart = async (req, res) => {
   try {
      let userData = await userModel.findOne({_id:req.body.userId});
      let cartData = await userData.cartData;
      
      // Add item to cart or increment count
      if (!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
      }
      else {
         cartData[req.body.itemId] += 1;
      }
      
      // Handle form data if provided
      if (req.body.formData) {
         // Initialize cartItemDetails if it doesn't exist
         if (!userData.cartItemDetails) {
            userData.cartItemDetails = {};
         }
         
         // Store form data for this item
         userData.cartItemDetails[req.body.itemId] = req.body.formData;
         
         // Update both cartData and cartItemDetails
         await userModel.findByIdAndUpdate(req.body.userId, {
            cartData,
            cartItemDetails: userData.cartItemDetails
         });
      } else {
         // Just update cartData if no form data
         await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      }
      
      res.json({ success: true, message: "Added To Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      
      if (cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;
         
         // Remove item details if count becomes zero
         if (cartData[req.body.itemId] === 0) {
            delete cartData[req.body.itemId];
            
            // Remove form data if it exists
            if (userData.cartItemDetails && userData.cartItemDetails[req.body.itemId]) {
               delete userData.cartItemDetails[req.body.itemId];
               
               // Update both cartData and cartItemDetails
               await userModel.findByIdAndUpdate(req.body.userId, {
                  cartData,
                  cartItemDetails: userData.cartItemDetails
               });
               
               res.json({ success: true, message: "Removed From Cart" });
               return;
            }
         }
      }
      
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Removed From Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// get user cart
const getCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      
      // Include cart item details if they exist
      let cartItemDetails = userData.cartItemDetails || {};
      
      res.json({ 
         success: true, 
         cartData: cartData,
         cartItemDetails: cartItemDetails
      });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

export { addToCart, removeFromCart, getCart }