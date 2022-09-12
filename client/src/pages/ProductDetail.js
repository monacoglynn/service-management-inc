import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import {
    Row,
    Col,
    Image,
    ListGroup,
    Card,
    Button,
    Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
// import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { productDetails } from "../actions/productAction";
import Spiner from "../components/Spiner";
import AlertMessage from "../components/AlertMessage";

function ProductDetail({ history }) {
    // working with mock json
    // const productID = useParams();
    // const product = products.find((p) => p._id === productID.id);
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);

    // working with simple express
    // const [product,setProduct] = useState({})
    const productID = useParams().id;
    const productData = useSelector((state) => state.productDetails);
    const { loading, error, product } = productData;
    const dispatch = useDispatch();
    useEffect(() => {
        // const fetchData = async () =>{
        //     const {data} = await axios.get(`/api/products/${productID}`)

        //     setProduct(data)
        // }
        // fetchData()
        dispatch(productDetails(productID));
    }, [dispatch,productID]);

    const addToCartHandler = () => {
        navigate(`/cart/${productID}?qty=${qty}`);
    };

    return (
        <>
            <Link className="btn btn-outline-light my-3" to="/">
                Back
            </Link>
            {loading ? (
                <Spiner />
            ) : error ? (
                <AlertMessage variant="danger"> {error}</AlertMessage>
            ) : (
                <Row>
                    <Col lg={5}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>
                    <Col lg={4}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3> {product.name} </h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating
                                    value={product.rating}
                                    text={`${product.numReviews} reviews`}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: $ {product.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col lg={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>
                                            <strong>${product.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0
                                                ? "In Stock"
                                                : "Out Of Stock"}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    onChange={(e) =>
                                                        setQty(e.target.value)
                                                    }
                                                >
                                                    {[
                                                        ...Array(
                                                            product.countInStock
                                                        ).keys(),
                                                    ].map((x) => (
                                                        <option
                                                            key={x + 1}
                                                            value={x + 1}
                                                        >
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Button
                                        onClick={addToCartHandler}
                                        className="btn-block"
                                        type="button"
                                        disabled={product.countInStock === 0}
                                    >
                                        Add To Cart
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
}

export default ProductDetail;
