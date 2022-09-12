import axios from "axios";
// we install thunk so we can call async dispatch
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_DETAILS_RESET,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
} from "../constants/userConstants";
import { ORDER_LIST_MY_RESET } from "../constants/orderConstants";

// ADMIN update user info via id
export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST,
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
            `/api/users/${user._id}`,
            user,
            config
        );

        dispatch({ type: USER_UPDATE_SUCCESS });

        dispatch({ type: USER_DETAILS_SUCCESS, payload: data });

        dispatch({ type: USER_DETAILS_RESET });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: message,
        });
    }
};

// ADMIN delete user with user id
export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST,
        });
        //   verified user
        const {
            userLogin: { userInfo },
        } = getState();
        // set up header with token (must be isAdmin true)
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        //   fetch with admin token
        await axios.delete(`/api/users/${id}`, config);

        dispatch({ type: USER_DELETE_SUCCESS });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed, who are you?") {
            // log user out due to false admin
            dispatch(logout());
        }
        dispatch({
            type: USER_DELETE_FAIL,
            payload: message,
        });
    }
};

// Admin get user list
export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_REQUEST,
        });
        // header
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        // get fetch call with auth token
        const { data } = await axios.get(`/api/users`, config);

        dispatch({
            type: USER_LIST_SUCCESS,
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
            type: USER_LIST_FAIL,
            payload: message,
        });
    }
};

// LOGIN HANDLING
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            "/api/users/login",
            { email, password },
            config
        );
        // update redux states
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
        // add to local
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const logout = () => (dispatch) => {
    // erase user in local storate
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");

    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_DETAILS_RESET });
    dispatch({ type: ORDER_LIST_MY_RESET });
    document.location.href = "/login";
};

export const signup = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        });
        // set config for api call
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        // sumit payload to the POST api/users/ to add user to the database
        const { data } = await axios.post(
            "/api/users",
            { name, email, password },
            config
        );
        // change state of user to sign up
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        });
        // Change state of user to loggin
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
        //local storage: add userInfo
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST,
        });
        //   destructure the userLogin State to get userInfo
        const {
            userLogin: { userInfo },
        } = getState();

        //   axious header config with token
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        //   fetch
        const { data } = await axios.get(`/api/users/${id}`, config);

        dispatch({
            type: USER_DETAILS_SUCCESS,
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
            type: USER_DETAILS_FAIL,
            payload: message,
        });
    }
};

// update
export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
        });
        // get login info and token
        const {
            userLogin: { userInfo },
        } = getState();
        // setup fetch header with token
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        // fetch
        const { data } = await axios.put(`/api/users/profile`, user, config);
        // Update user info
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data,
        });
        // login user with new info
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
        // update local storage
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: message,
        });
    }
};
