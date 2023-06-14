import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import CheckoutForm from "../components/CheckoutForm";
import { useIncreaseCartProductMutation, useDecreaseCartProductMutation, useRemoveFromCartMutation } from "../services/appApi";
import "./CartPage.css";

const stripePromise = loadStripe("your_stripe_publishable_key");

function CartPage() {
    const user = useSelector((state) => state.user);
    const products = useSelector((state) => state.products);
    const userCartObj = user.cart;
    let cart = products.filter((product) => userCartObj[product._id] != null);
    const [increaseCart] = useIncreaseCartProductMutation();
    const [decreaseCart, { isLoading: isDecreaseLoading }] = useDecreaseCartProductMutation();
    const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();

    function handleDecrease(product) {
        const quantity = user.cart.count;
        if (quantity <= 0) return alert("Can't proceed");
        decreaseCart(product);
    }

    return (
        <Container style={{ minHeight: "95vh" }} className="cart-container">
            <Row>
                <Col>
                    <h1 className="pt-2 h3">Корзина</h1>
                    {cart.length === 0 ? (
                        <Alert variant="info">Корзина пуста. Додайте продукти до корзини</Alert>
                    ) : (
                        <Elements stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    )}
                </Col>
                {cart.length > 0 && (
                    <Col md={5}>
                        <>
                            <Table responsive="sm" className="cart-table">
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Назва</th>
                                        <th>Ціна</th>
                                        <th>Кількість</th>
                                        <th>Сума</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* loop through cart products */}
                                    {cart.map((item) => (
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td>
                                                {!isLoading && <i className="fa fa-times" style={{ marginRight: 10, cursor: "pointer" }} onClick={() => removeFromCart({ productId: item._id, price: item.price, userId: user._id })}></i>}
                                                <img src={item.pictures[0].url} alt="" style={{ width: 100, height: 100, objectFit: "cover" }} />
                                            </td>
                                            <td>₴{item.price}</td>
                                            <td>
                                                <span className="quantity-indicator">
                                                    <i 
                                                        className="fa fa-minus-circle" 
                                                        onClick={() => {
                                                            if (!isDecreaseLoading) {
                                                                const data = { productId: item._id, price: item.price, userId: user._id }
                                                                if (user.cart[item._id] > 1) {
                                                                    handleDecrease(data)
                                                                } else if (user.cart[item._id] === 1) {
                                                                    removeFromCart(data)
                                                                }
                                                            }
                                                        }}
                                                    ></i>
                                                    <span>{user.cart[item._id]}</span>
                                                    <i className="fa fa-plus-circle" onClick={() => increaseCart({ productId: item._id, price: item.price, userId: user._id })}></i>
                                                </span>
                                            </td>
                                            <td>₴{item.price * user.cart[item._id]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div>
                                <h3 className="h4 pt-4">Сума: ₴{user.cart.total}</h3>
                            </div>
                        </>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default CartPage;
