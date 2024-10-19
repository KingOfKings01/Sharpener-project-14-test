import { FaCartShopping } from "react-icons/fa6";
import styles from './navbar.module.css'
import CartModal from "../Cart/CartModal";
import { useState, useContext } from "react";
import CartContext from "../../store/cart-context";

export default function Navbar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const context = useContext(CartContext)

  return (
    <div>
      
      <nav className={styles.nav}>
        <h2>Medicine Shop</h2>
        <button className={styles.cartBtn} onClick={() => setModalIsOpen(true)}>

          {/*//* Cart Icon */}
          <FaCartShopping />
          
          <span>Your Cart</span>
          <span className={styles.cartCount}>{context.itemCount}</span>
        </button>

      </nav>
      {modalIsOpen && <CartModal setModalIsOpen={setModalIsOpen} />}
    </div>
  )
}
