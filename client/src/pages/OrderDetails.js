import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { Link, useNavigate } from "react-router-dom";
import {
    Row,
    Col,
    ListGroup,
    Image,
    Card,
   
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../components/AlertMessage";
import Spiner from "../components/Spiner";
import {
    getOrderDetails,
    payOrder,
    deliverOrder,
} from "../actions/orderActions";
import {
    ORDER_PAY_RESET,
    ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
    const orderId = useParams().id;

    const dispatch = useDispatch();
    // paypal SDK setup
    const [sdkReady, setSdkReady] = useState(false);
    // get order details form redux
    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    // get loggin from Redux
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    if (!loading) {
        //   Calculate prices
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        };

        order.itemsPrice = addDecimals(
            order.orderItems.reduce(
                (acc, item) => acc + item.price * item.qty,
                0
            )
        );
    }

    // Paid order
    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;
    const [clientId, setClientId] = useState();
    const navigate = useNavigate();
    // const PayPalID = { "client-id": clientId };
    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
        // inject Paypal scipt with Paypal client id to client side
        // add after HTML is render

        const injectPayPalScript = async () => {
            const { data: clientID } = await axios.get("/api/config/paypal");
            setClientId(clientID);
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };

        if (!order || successPay || order._id !== orderId) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                injectPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
        //
    }, [dispatch, navigate, orderId, order, successPay]);

    const orderPayload = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        });
    };

    const successPaymentHandler = async (data, actions) => {
        // Paypal

        let paypalreturn = await actions.order.capture().then((details) => {
           
            
            // const paymentResult = {
            //     id: details.id,
            //     status:details.status,
            //     update_time:details.update_time,
            //     payer: details.payer
            // }
            // dispatch(payOrder(orderId,paymentResult))

            dispatch(payOrder(orderId,details))
        });
     
        
    };

    const deliverHandler = () => {
        // Jobdone
    };

    return loading ? (
        <Spiner />
    ) : error ? (
        <AlertMessage variant="danger">{error}</AlertMessage>
    ) : (
        <>
            <h1>Order {order._id}</h1>
            
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>{" "}
                                <a href={`mailto:${order.user.email}`}>
                                    {order.user.email}
                                </a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address},{" "}
                                {order.shippingAddress.city}{" "}
                                {order.shippingAddress.postalCode},{" "}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <AlertMessage variant="success">
                                    Delivered on {order.deliveredAt}
                                </AlertMessage>
                            ) : (
                                <AlertMessage variant="danger">
                                    Not Delivered
                                </AlertMessage>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <AlertMessage variant="success">
                                    Paid on {order.paidAt}
                                </AlertMessage>
                            ) : (
                                <AlertMessage variant="danger">
                                    Not Paid
                                </AlertMessage>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? (
                                <AlertMessage>Order is empty</AlertMessage>
                            ) : (
                                <ListGroup variant="flush">
                                    {order.orderItems.map((item, index) => (
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
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item className="px-1">
                                    {loadingPay && <Spiner />}
                                    {!sdkReady ? (
                                        <Spiner />
                                    ) : (
                                        <PayPalScriptProvider
                                           
                                        >
                                           
                                            <PayPalButtons
                                                createOrder={orderPayload}
                                                onApprove={
                                                    successPaymentHandler
                                                }
                                            />
                                        </PayPalScriptProvider>
                                    )}
                                </ListGroup.Item>
                            )}
                            {/* {loadingDeliver && <Spiner />}
                            {userInfo &&
                                userInfo.isAdmin &&
                                order.isPaid &&
                                !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type="button"
                                            className="btn btn-block"
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )} */}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderDetails;
