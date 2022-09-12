import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const ProceedBar = ({ step1, step2, step3, step4 }) => {
    return (
        <Nav className="justify-content-center mb-4">
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to="/login">
                        <Nav.Link> <i className="fa-solid fa-right-to-bracket"></i> Sign-In</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled> <i className="fa-solid fa-right-to-bracket"></i> Sign In</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step2 ? (
                    <LinkContainer to="/shipping">
                        <Nav.Link> <i className="fa-solid fa-map-location-dot"></i> Location</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled> <i className="fa-solid fa-map-location-dot"></i> Location</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step3 ? (
                    <LinkContainer to="/payment">
                        <Nav.Link> <i className="fa-solid fa-money-check-dollar"></i> Payment</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled> <i className="fa-solid fa-money-check-dollar"></i> Payment</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step4 ? (
                    <LinkContainer to="/placeorder">
                        <Nav.Link> <i className="fa-solid fa-clipboard-check"></i> Place Order</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled> <i className="fa-solid fa-clipboard-check"></i> Place Order</Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    );
};

export default ProceedBar;
