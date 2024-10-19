import { useContext } from 'react'
import dataContext from '../../store/dataContext'
import styles from './card.module.css'

export default function MedicineForm() {


    const { addMedicine } = useContext(dataContext)

    const handleForm = (e) => {
        e.preventDefault()
        const { name, description, price, qty } = e.target

        console.log(name.value, description.value, price.value, qty.value)

        const newMedicine = {
            name: name.value,
            description: description.value,
            price: parseFloat(price.value),
            quantity: parseInt(qty.value)
        }

        addMedicine(newMedicine)

        // reset
        name.value = ''
        description.value = ''
        price.value = ''
        qty.value = ''

    }
    return (
        <div className={styles.center}>
            <div className={styles.card}>

                <div>Add New Medicine</div>

                <form className={styles.form} onSubmit={handleForm}>
                    <input type="text" name='name' placeholder="Name" required />
                    <input type="text" name='description' placeholder="Description" required />
                    <input type="number" name="price" placeholder="Price" required />
                    <input type="number" name='qty' placeholder="Quantity Available" required />
                    <button type="submit">Add Medicine</button>
                </form>
            </div>

        </div>
    )
}
