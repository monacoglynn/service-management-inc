import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../components/AlertMessage";
import ProceedBar from "../components/ProceedBar";
import { createOrder } from "../actions/orderActions";
import { USER_DETAILS_RESET } from "../constants/userConstants";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

const SubmitOrder = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    // reRoute
    const navigate = useNavigate();
    if (!cart.shippingAddress.address) {
        navigate("/shipping");
    } else if (!cart.paymentMethod) {
        navigate("/payment");
    }

    // decimal cal
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };
    // ORDER SUMMERY LOGIC
    cart.subTotalItems = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    // freeshipping if order more than $100
    cart.shippingPrice = addDecimals(cart.subTotalItems > 100 ? 0 : 100);
    cart.taxPrice = addDecimals(Number((0.15 * cart.subTotalItems).toFixed(2)));
    cart.totalPrice = (
        Number(cart.subTotalItems) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);

    // create state for orderItems
    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate;

    // once success Create,then redirect
    useEffect(() => {
        if (success) {
            navigate(`/orders/${order._id}`);
            dispatch({ type: USER_DETAILS_RESET });
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [dispatch, navigate, success]);

    const placeOrderHandler = () => {
        // push order from the cart to server
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.subTotalItems,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            })
        );
    };
    return (
        <>
            <ProceedBar step1 step2 step3 step4></ProceedBar>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Location/Shipping</h2>
                            <p>
                                {cart.shippingAddress.address},{" "}
                                {cart.shippingAddress.city}{" "}
                                {cart.shippingAddress.postalCode},{" "}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? (
                                <AlertMessage>Your cart is empty</AlertMessage>
                            ) : (
                                <ListGroup variant="flush">
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link
                                                        to={`/product/${item.product}`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} =
                                                    ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${cart.subTotalItems}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && (
                                    <AlertMessage variant="danger">
                                        {error}
                                    </AlertMessage>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default SubmitOrder;
