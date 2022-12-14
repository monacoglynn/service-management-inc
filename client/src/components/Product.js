import React from 'react'
import {Card} from 'react-bootstrap'
import Rating from './Rating'
import {Link} from 'react-router-dom'
function Product({product}) {
  return (
    <Card className='my-3 p-3 rounded'>
        <Link to={`/product/${product._id}`}>
            <Card.Img variant="top" src={product.image}/>
        </Link>
        <Card.Body>
        <Link to={`/product/${product._id}`}>
            <Card.Title as='div'><strong>{product.name}</strong></Card.Title>
        </Link>

        <Card.Text as='div'>
            <Rating value={product.rating} text={` ${product.numReviews} reviews`} color='yellow'></Rating>
        </Card.Text>

        <Card.Text as='h3'>$ {product.price} per hour</Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Product