import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard.js";
import Cart, { generateCartItemsFrom } from "./Cart.js";


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

    const { enqueueSnackbar } = useSnackbar("");
    const token = localStorage.getItem("token");

    const [debounceTimeout, setDebounceTimeout] = useState(0);
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [filterProduct, setFilterProduct] = useState([]);
    const [productNotFound, setProductNotFound] = useState(false);

    
    const [item, setItem] = useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${config["endpoint"]}/products`);
      // console.log(res.data);
      if (res.status === 200) {
        setProductData(res.data);
        setFilterProduct(res.data);
        setProductNotFound(false);
        setIsLoading(false);
        return res.data;
      }
    } catch (error) {
      if (error.res && error.res.status === 500) {
        enqueueSnackbar(error.res.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details", { variant: "warning" }
        );
      }
      setIsLoading(false);
      // return [];
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {

      setProductNotFound(false);
    try {
      const res = await axios.get(`${config["endpoint"]}/products/search?value=${text}`);
      setFilterProduct(res.data);
      setProductNotFound(false);
      return res.data;
    } catch (error) {
      setProductNotFound(true);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {

    if (debounceTimeout > 0) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);

    setDebounceTimeout(timeout);
  };

 /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    // if (!token);
    const url = `${config["endpoint"]}/cart`;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });

      if(res.status === 200){
        return res.data;
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.find((itemId) => itemId["productId"] === productId);
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   * @param { Array.<{ productId: String, qty: Number }> } cartData 
   */
      useEffect(() => {
        const cartFetch = async () => {
          let productdata = await performAPICall();
          // console.log(productData);
          if (localStorage.getItem('token')) {
            let cartList = await fetchCart(localStorage.getItem('token'));
            // console.log(cartList);
            let cartData = generateCartItemsFrom(cartList, productdata);
            setItem(cartData);
          }
        };
      
        cartFetch();
      }, []);

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token){
      enqueueSnackbar("Login to add item to the cart", { variant:"warning" });
      return;
    }
    
      if (options.preventDuplicate && isItemInCart(items, productId)) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update qunatity or remove item.",
          { variant: "warning" }
        );
        return;
      }

      try {
        const res = await axios.post(
          `${config["endpoint"]}/cart`,
          { productId, qty },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let updateData = generateCartItemsFrom(res.data, products);
        setItem(updateData);
      } catch (error) {
        if (error.response) {
          enqueueSnackbar(error.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
        }
      }
    };

   
    
      
  return (
    <div>
      <Header hasHiddenAuthButtons={false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      <TextField
        className="search-desktop"
        size="small"
          InputProps={{
          className:"search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) =>
          debounceSearch(e, debounceTimeout)}
      />
      </Header>
      


      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e,debounceTimeout)}
      />
        <Grid container spacing={4}>
        <Grid
          item
          xs={12}
          md={token === null ? 12 : 9}
          className="product-grid"
          bgcolor="white"
        >
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
          </Box>
          
           {isLoading && (
            <div className="loading">
              <CircularProgress />
              <strong>Loading Products...</strong>
            </div>
          )}

          {productNotFound && (
            
             <Grid
              container
              direction="column"
              justifyContent="center"
              alginItems="center"
              
            >
            <div className="loading">
              <SentimentDissatisfied />
              <strong>No products found</strong>
              </div>
              
              </Grid>
          )}


            {!isLoading && !productNotFound && (
            <Grid container spacing={2} sx={{ p: 2 }}>
              {filterProduct.map((product) => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={async() => {
                        await addToCart(
                          token,
                          item,
                          productData,
                          product._id,
                          1,
                          {preventDuplicate: true}
                        )
                      }}
                     
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}

         </Grid>
         {
          // using ternary to render Cart section when user login
          token === null ? null : (
            <Grid item xs={12} md={3}>
              <Cart
                hasCheckedoutButton
                products={productData}
                items={item}
                handleQuantity={(token, items, products, productId, qty) =>
                  addToCart(token, items, products, productId, qty)
                }
              />
            </Grid>
          )
        }
      </Grid>
      <Footer />
    </div>
  );

};
export default Products;
