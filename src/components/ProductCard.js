import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({ product, handleAddToCart }) => {


  
 
  return (
    <Card className="card">

      <Card
        className="card"
        style={{
        maxWidth: 345,
        boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#fafafa",
      }}
      >
        <CardMedia
          component="img"
          src={product.image}
          alt={product.name}
        />

        <CardContent>
          <Typography color="textPrimary" gutterBottom variant="h6">
            {product.name}
          </Typography>
          <Typography color="textPrimary" gutterBottom >
            <strong>${product.cost}</strong>
          </Typography>
          <Rating
            name="read-only"
            defaultValue={product.rating}
            precision={0.5}
            readOnly
          />
          
        </CardContent>
        
        <CardActions className="card-actions">
          <Button
            className="card-button"
            startIcon={<AddShoppingCartOutlined />}
            variant="contained"
            fullWidth
            onClick={handleAddToCart}
          > 
            ADD TO CART
        </Button>
      </CardActions>
      </Card>
      
    </Card>
  );
};

export default ProductCard;
