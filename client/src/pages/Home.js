import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { listProducts } from "../actions/productAction";
import AlertMessage from "../components/AlertMessage";
import Spiner from "../components/Spiner";
// mock products - replace with backend
// import products from '../products-mock'
// temporary fetch with express
// direct fetch
// import axios from 'axios'

// use redux to fetch

function Home() {
    // set Global State for PRODUCTS
    // const [products, setProducts] = useState([])

    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;
    useEffect(() => {
        // direct fetch
        // const fetchProducts = async()=>{
        //     const {data} = await axios.get('/api/products')
        //     setProducts(data)
        // }
        // fetchProducts()

        dispatch(listProducts());
    }, [dispatch]);

    return (
        <>
            <h1>Lastest Product</h1>
            {loading ? (
                <Spiner></Spiner>
            ) : error ? (
                <AlertMessage variant='danger'>{error}</AlertMessage>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product}></Product>
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
}

export default Home;
