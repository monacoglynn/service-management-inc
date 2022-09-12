import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../components/AlertMessage";
import Spiner from "../components/Spiner";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";

const Login = () => {
    // default value for the form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // register redux payload
    const dispatch = useDispatch();

    // redux state for login user userInfo
    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error, userInfo } = userLogin;

    // routeing and redirect handling
    const location = useLocation();
    const navigate = useNavigate();
    const redirect = location.search ? '/' + location.search.split("=")[1] : "/";

    useEffect(() => {
        // if use loggedIn redirect to homepage
        if (userInfo) {
            // console.log(location)
            navigate(redirect);
        }
    }, [navigate,userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        // submit the payload
        dispatch(login(email, password));
    };
    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <AlertMessage variant="danger">{error}</AlertMessage>}
            {loading && <Spiner />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="my-2">
                    Sign In
                </Button>
            </Form>
            <Row className="py-3">
                <Col>
                    New Customer?{" "}
                    <Link
                        to={
                            redirect
                                ? `/signup?redirect=${redirect}`
                                : "/signup"
                        }
                    >
                        Register
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default Login;
