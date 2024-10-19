import Navbar from './components/Layout/Navbar'
import Medicine from './components/Medicine/Medicine'
import MedicineForm from './components/Medicine/MedicineForm'
// import CartProvider from './store/CartProvider'
import DataProvider from './store/dataProvider'

function App() {
  return (
    // <CartProvider>
      <DataProvider>
        <Navbar />
        <div className='container'>
          <MedicineForm />
          <Medicine />
        </div>
      </DataProvider>
    // </CartProvider>
  )
}

export default App
