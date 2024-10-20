import { useState } from "react";
import dataContext from "./dataContext"
import medicineList from "./medicineList";
import PropTypes from "prop-types";

export default function DataProvider({ children }) {
    const [items, setItems] = useState([]);
    const [itemCount, setItemCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [medicine, setMedicine] = useState(medicineList);

    const addItemToCartHandler = (product) => {
        setItems((prevItems) => {
            const existingProductIndex = prevItems.findIndex((item) => item.id === product.id);

            if (existingProductIndex !== -1) {
                const updatedItems = [...prevItems];

                updatedItems[existingProductIndex].quantity += product.quantity;
                setTotalAmount((prev) => prev + product.price * product.quantity);

                setItemCount(prev => prev + product.quantity || 1)

                return updatedItems;
            }

            const newProduct = {
                id: product.id,
                name: product.name,
                quantity: product.quantity,
                price: product.price,
            };


            setItemCount((prev) => prev + (product.quantity || 1));
            setTotalAmount((prev) => prev + product.price * product.quantity);

            // console.log([...prevItems, newProduct]);
            return [...prevItems, newProduct];
        }
        )
    };

    const increaseQuantity = (prodId) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            const productIndex = updatedItems.findIndex((item) => item.id === prodId);
            if (productIndex !== -1) {
                updatedItems[productIndex].quantity++;
                setTotalAmount((prev) => prev + updatedItems[productIndex].price);
                setItemCount(prev => prev + 1)
            }
            return updatedItems;
        });
    };

    const decreaseQuantity = (prodId) => {

        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            const productIndex = updatedItems.findIndex((item) => item.id === prodId);
            if (productIndex !== -1) {

                const origPrice = updatedItems[productIndex].price
                updatedItems[productIndex].quantity--;

                setTotalAmount((prev) => +(prev - origPrice));

                //Todo: Remove item if quantity reaches 0
                if (updatedItems[productIndex].quantity <= 0) {
                    updatedItems.splice(productIndex, 1);
                }

                setItemCount(prev => +(prev - 1))
            }
            return updatedItems;
        });
    };

    const addMedicine = (newMedicine) => {
        newMedicine.id = Date.now() + Math.floor(Math.random()),

            setMedicine((prevItems) => [...prevItems, newMedicine])

    }

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