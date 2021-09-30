import React from 'react';

import { connect } from 'react-redux';

import { clearItemFromCart, addItem, removeItem  } from '../../redux/cart/cart.actions';

import './checkout-item.styles.scss';


const CheckoutItem = ({ cartItem, clearItemProp, addItemProp, removeItemProp}) => {
    const { name, imageUrl, price, size, quantity } = cartItem;    

    return (
        <div className="checkout-item">
            <div className="image-container">
                <img src={imageUrl} alt="item" />
            </div>
            <span className="name">{name}</span>
            <span className="size">{size}</span>
            <span className="quantity">
                <div className="arrow" onClick={() => removeItemProp(cartItem)}>&#10094;</div>
                <span className="value">{quantity}</span>
                <div className="arrow" onClick={() => addItemProp(cartItem)}>&#10095;</div>
            </span>
            <span className="price">£{price}</span>
            <div className="remove-button" onClick={() => clearItemProp(cartItem)}>&#10005;</div>
        </div>
    )
};

const mapDispatchToProps = dispatch => ({
    clearItemProp: item => dispatch(clearItemFromCart(item)),
    addItemProp: item =>  dispatch(addItem(item)),
    removeItemProp: item => dispatch(removeItem(item))
});

export default connect(null, mapDispatchToProps)(CheckoutItem);