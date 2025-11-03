import React, { useState } from 'react'

const BannerCounter = () => {
    const [quantity, setQuantity] = useState<number>(0); // Default state is 0

  const handleIncrement = () => {
    if (quantity < 99) { // Optional: Maximum limit
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) { // Prevent going below 0
      setQuantity(quantity - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseInt(value, 10);

    // Allow empty input temporarily for manual edits
    if (value === "") {
      setQuantity(0); // Reset to 0 if input is empty
    } else if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 99) {
      setQuantity(numericValue); // Update state with valid numbers
    }
  };

  return (
   

      <div className="custom-increment">
        <div className="input-group">
          <span className="input-group-btn float-start">
            <button
              type="button"
              className="quantity-left-minus btn btn-light btn-number"
              data-type="minus"
              onClick={handleDecrement}
            >
              <span>
                <i className="isax isax-minus" />
              </span>
            </button>
          </span>
          <input
            type="text"
            name="quantity"
            className="input-number text-center"
            value={quantity.toString()} // Convert number to string for input
            onChange={handleChange} // Allow manual edits
          />
          <span className="input-group-btn float-end">
            <button
              type="button"
              className="quantity-right-plus btn btn-light btn-number"
              data-type="plus"
              onClick={handleIncrement}
            >
              <span>
                <i className="isax isax-add" />
              </span>
            </button>
          </span>
        </div>
      </div>

  
  )
}

export default BannerCounter