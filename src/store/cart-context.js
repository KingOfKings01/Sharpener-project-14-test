import React from "react"

const CartContext = React.createContext({
    items: [],
    totalAmount: 0,
    addItem: (item, amount) => {},
    removeItem: (itemId) => {},
    clearCart: () => {},
    updateItemQuantity: (itemId, newQuantity) => {},
    itemCount: 0
})

export default CartContext