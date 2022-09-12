import axios from "axios";
import { CART_CLEAR_ITEMS } from "../constants/cartConstants";
import {
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
} from "../constants/orderConstants";
import { logout } from "./userActions";

export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_MY_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/orders/myorders`, config);

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: message,
        });
    }
};

export const payOrder =
    (orderId, paymentResult) => async (dispatch, getState) => {
        try {
            dispatch({
                type: ORDER_PAY_REQUEST,
            });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.put(
                `/api/orders/${orderId}/pay`,
                paymentResult,
                config
            );

            dispatch({
                type: ORDER_PAY_SUCCESS,
                payload: data,
            });
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            if (message === "Not authorized, token failed") {
                dispatch(logout());
            }
            dispatch({
                type: ORDER_PAY_FAIL,
                payload: message,
            });
        }
    };

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        // initiate request state update
        dispatch({
            type: ORDER_DETAILS_REQUEST,
        });
        // token
        const {
            userLogin: { userInfo },
        } = getState();
        // header for axios
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        // fetch data
        const { data } = await axios.get(`/api/orders/${id}`, config);
        // update request status
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: message,
        });
    }
};

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST,
        });
        // get login token header
        const {
            userLogin: { userInfo },
        } = getState();
        // get header with token
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        // post the order to server
        const { data } = await axios.post(`/api/orders`, order, config);
        // sucess create order
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data,
        });
        // clear the cart states
        dispatch({
            type: CART_CLEAR_ITEMS,
            payload: data,
        });
        // remove the cart local
        localStorage.removeItem("cartItems");
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: message,
        });
    }
};
