import { useState, useContext } from 'react';
import styles from './card.module.css';
import dataContext from '../../store/dataContext';

export default function Medicine() {
  const [cartQuantities, setCartQuantities] = useState({});
  const [qtyValues, setQtyValues] = useState({});
  const { medicine, addItem } = useContext(dataContext);

  const handleQuantityChange = (e, id) => {
    const { value } = e.target;
    setQtyValues({ ...qtyValues, [id]: value });
  };

  const handleSubmit = (e, product) => {
    e.preventDefault();
    const { id, name, price } = product;

    // Get quantity or default to 1
    const quantity = parseInt(qtyValues[id]) || 1;
    
    // Ensure there is enough stock
    if (quantity > medicine.find(item => item.id === id).quantity) {
      alert('Not enough stock available');
      return;
    }

    setCartQuantities({ ...cartQuantities, [id]: quantity });
    setQtyValues({ ...qtyValues, [id]: 1 });

    // // Update the medicine stock
    // setMedicine(prev => {
    //   const updatedMedicine = prev.map(item => {
    //     if (item.id === id) {
    //       return { ...item, quantity: item.quantity - quantity };
    //     }
    //     return item;
    //   });
    //   return updatedMedicine;
    // });

    // Add item to cart
    const newProduct = { id, name, price, quantity };
    addItem(newProduct);
  };

  return (
    <div className={styles.center}>
      <div className={styles.card2}>
        {medicine.length === 0 && <div>No Medicine</div>}
        {medicine.map(({ id, name, description, price, quantity }) => (
          <div key={id} className={styles.list}>
            <div className={styles.product}>
              <div>
                <h3>{name}</h3>
                <p className={styles.cursive}>{description}</p>
                <p className={styles.amount}>${price}</p>
                <p className={styles.amount}>Available: {quantity}</p>
              </div>
              <form onSubmit={(e) => handleSubmit(e, { id, name, price })}>
                <label htmlFor={`qty-${id}`}>
                  Amount &nbsp;
                  <input
                    type="number"
                    name={`qty-${id}`}
                    min={1}
                    max={quantity || 1}
                    value={qtyValues[id] || 1}
                    onChange={(e) => handleQuantityChange(e, id)}
                  />
                </label>
                { quantity > 0 ? <button type="submit" className={styles.addToCart}>+ Add</button> :
                <button type="submit" disabled className={styles.addToCartDisabled}>+ Add</button>}
              </form>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
