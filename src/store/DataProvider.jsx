import { useEffect } from "react";
import { useState } from "react";
import dataContext from "./dataContext"
//// import medicineList from "./medicineList";
import PropTypes from "prop-types";

export default function DataProvider({ children }) {
    const [items, setItems] = useState([]);
    const [itemCount, setItemCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [medicine, setMedicine] = useState([]);

    
    //! ----------- DATABASE Functions -----------
    //// const url = import.meta.env.VITE_CURD_CURD_URL + "/medicines"

    const urlMedicines = import.meta.env.VITE_FIREBASE_DB_PATH + "/medicines"
    const urlCart = import.meta.env.VITE_FIREBASE_DB_PATH + "/cart"

    //Todo: Fetch Medicines from the backend
    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await fetch(urlMedicines + ".json");
                if (!response.ok) {
                    throw new Error("Failed to fetch medicines");
                }
                const data = await response.json();

                const combinedData = Object.entries(data).map(([id, details]) => ({
                    id,
                    ...details
                }));

                setMedicine(combinedData || []);
            } catch (error) {
                console.error("There was an error fetching the medicines!", error);
            }
        };

        fetchMedicines();
    }, []);

    // Todo: Fetch Cart items from the backend
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch(urlCart + ".json");
                if (!response.ok) throw new Error("Failed to fetch cart");
                const data = await response.json();

                const loadedCart = Object.entries(data || {}).map(([id, details]) => ({
                    id,
                    ...details
                }));

                // Calculate the total count and total amount of items in the cart
                const totals = loadedCart.reduce((acc, item) => {
                    acc.itemCount += item.quantity;
                    acc.totalAmount += item.price * item.quantity;
                    return acc;
                  }, { itemCount: 0, totalAmount: 0 });
                  
                  setItemCount(totals.itemCount);
                  setTotalAmount(totals.totalAmount);
                  
                setItems(loadedCart);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };

        fetchCart();
    }, []);

    // Function to add or update an item in the cart on Firebase
    const updateCartItem = async (product) => {
        try {
            const response = await fetch(`${urlCart}/${product.id}.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error("Failed to update cart item");
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    };

    // Function to remove an item from the cart on Firebase
    const removeCartItem = async (id) => {
        try {
            const response = await fetch(`${urlCart}/${id}.json`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Failed to delete cart item");
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
    };

    //Todo: Function to add a new medicine
    const addMedicine = async (newMedicine) => {
        try {
            const response = await fetch(urlMedicines + ".json", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMedicine)  // Correctly stringify the newMedicine object
            });
            if (!response.ok) {
                throw new Error("Failed to add new medicine");
            }

            const addedMedicine = await response.json();

            newMedicine.id = addedMedicine.name

            setMedicine((prevItems) => [...prevItems, newMedicine]);
        } catch (error) {
            console.error("There was an error adding the new medicine!", error);
        }
    };

    //Todo: Function to update a medicine quantity
    const updateMedicineStock = async (id, updatedQuantity) => {
        try {
            const response = await fetch(`${urlMedicines}/${id}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: updatedQuantity })
            });

            if (!response.ok) {
                throw new Error("Failed to update medicine stock");
            }

        } catch (error) {
            console.error("There was an error updating the medicine stock!", error);
        }
    }

    //!  --------------------- UI Functions ------------------------

    const addItemToCartHandler = (product) => {
        setItems((prevItems) => {
            const existingProductIndex = prevItems.findIndex((item) => item.id === product.id);

            if (existingProductIndex !== -1) {
                const updatedItems = [...prevItems];

                updatedItems[existingProductIndex].quantity += product.quantity;
                setTotalAmount((prev) => prev + product.price * product.quantity);

                setItemCount(prev => prev + product.quantity || 1)

                // Update the medicine stock
                setMedicine(prev => {
                    const updatedMedicine = prev.map(item => {
                        if (item.id === product.id) {
                            return { ...item, quantity: item.quantity - product.quantity };
                        }
                        return item;
                    });


                    return updatedMedicine;
                });

                //Todo: Updated cart item with Firebase
                updateCartItem(updatedItems[existingProductIndex]);

                return updatedItems;
            }

            const newProduct = {
                id: product.id,
                name: product.name,
                quantity: product.quantity,
                price: product.price,
            };

            // Update the medicine stock
            setMedicine(prev => {
                const updatedMedicine = prev.map(item => {
                    if (item.id === newProduct.id) {
                        return { ...item, quantity: item.quantity - newProduct.quantity };
                    }
                    return item;
                });
                return updatedMedicine;
            });


            setItemCount((prev) => prev + (product.quantity || 1));
            setTotalAmount((prev) => prev + product.price * product.quantity);

            // Todo: New cart item with Firebase
            updateCartItem(newProduct);

            return [...prevItems, newProduct];
        }
        )

        //Todo : Update database
        const findProductById = medicine.find(prod => product.id === prod.id)
        updateMedicineStock(product.id, findProductById.quantity - product.quantity);
    };

    const increaseQuantity = (prodId) => {
        const existingProduct = medicine.find((item) => item.id === prodId);

        if (existingProduct.quantity <= 0) {
            return alert("Medicine out of stock!");
        }

        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            const productIndex = updatedItems.findIndex((item) => item.id === prodId);

            if (productIndex !== -1) {
                updatedItems[productIndex].quantity++;
                setTotalAmount((prev) => prev + updatedItems[productIndex].price);
                setItemCount(prev => prev + 1);

                //Todo: Update Firebase cart item
                updateCartItem(updatedItems[productIndex]);
            }

            return updatedItems;
        });

        // Update the medicine stock
        setMedicine((prev) => {
            const updatedMedicine = prev.map((item) => {
                if (item.id === prodId) {
                    const newQuantity = item.quantity - 1;
                    updateMedicineStock(prodId, newQuantity);  // Sync with Firebase
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            return updatedMedicine;
        });
    };

    const decreaseQuantity = (prodId) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            const productIndex = updatedItems.findIndex((item) => item.id === prodId);

            if (productIndex !== -1) {
                const origPrice = updatedItems[productIndex].price;
                updatedItems[productIndex].quantity--;
                setTotalAmount((prev) => prev - origPrice);

                // Remove item if quantity reaches 0
                if (updatedItems[productIndex].quantity <= 0) {
                    //Todo: Remove from cart if quantity is zero and sync with Firebase
                    removeCartItem(prodId);
                    updatedItems.splice(productIndex, 1);
                } else {
                    //Todo Update Firebase cart item
                    updateCartItem(updatedItems[productIndex]);
                }

                setItemCount((prev) => prev - 1);
            }
            return updatedItems;
        });

        // Update the medicine stock
        setMedicine((prev) => {
            const updatedMedicine = prev.map((item) => {
                if (item.id === prodId) {
                    const newQuantity = item.quantity + 1;
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            return updatedMedicine;
        });

        // Todo: Update medicine stock if quantity is reduced
        const medicineProduct = medicine.find((item) => item.id === prodId);
        updateMedicineStock(prodId, medicineProduct.quantity + 1);
    };


    const initialState = {
        items,
        totalAmount,
        addItem: addItemToCartHandler,
        increaseQuantity,
        decreaseQuantity,
        itemCount,
        medicine,
        setMedicine,
        addMedicine
    };

    return (
        <dataContext.Provider value={initialState}>
            {children}
        </dataContext.Provider>
    )
}

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
}