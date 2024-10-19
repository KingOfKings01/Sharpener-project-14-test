import styles from './card.module.css'

export default function Card() {
    return (
        <div className={styles.center}>
            <div className={styles.card}>
                <h3>Delicious Food, Delivered To You</h3>
                <p>Choose your favorite meal from our broad selection of available meals and enjoy a delicious lunch or dinner at home.</p>
                <p>All our meals are cooked with high-quality ingredients, just-in-time and of course by experienced chefs!</p>
            </div>
        </div>
    )
}
