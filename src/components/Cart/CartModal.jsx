import styles from "./cartModal.module.css";
import { useContext } from "react";
import CartContext from "../../store/cart-context";

export default function CartModal({ setModalIsOpen }) {
  const { items, totalAmount,increaseQuantity, decreaseQuantity } = useContext(CartContext);

  return (
    <div>
      <div className={styles.background}>
        <div className={styles.modal}>
          <table>
            <thead>
              <tr className={styles.bold}>
                <td>Name</td>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ id, name, price, quantity }) => (
                <tr className={styles.row} key={id}>
                  <td className={styles.cursive}>{name}</td>
                  <td className={styles.center}>{price}</td>
                  <td className={styles.center}>{quantity}</td>
                  <td className={styles.actions}>
                    <button onClick={()=>decreaseQuantity(id)}>-</button>
                    <button onClick={()=>increaseQuantity(id)}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.totalAmount}>
            <h3>Total Amount</h3>
            <h3>$ {totalAmount.toFixed(2)}</h3>
          </div>
          <div className={styles.btns}>
            <button className={styles.close} onClick={() => setModalIsOpen(false)}>Close</button>
            <button className={styles.order}>Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
