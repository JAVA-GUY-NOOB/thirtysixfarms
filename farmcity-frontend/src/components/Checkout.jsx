import React from 'react';
import { useCart } from '../context/CartContext';
import { formatKES } from '../utils/currency';

const Checkout = () => {
  const { total } = useCart();
  return (
    <div>
      <h3>Checkout</h3>
      <p>Total: {formatKES(total)}</p>
    </div>
  );
};

export default Checkout;
