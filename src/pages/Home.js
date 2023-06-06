import axios from "../axios";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import categories from "../categories";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { updateProducts } from "../features/productSlice";
import ProductPreview from "../components/ProductPreview";

function Home() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products);
    const lastProducts = products.slice(0, 8);
    useEffect(() => {
        axios.get("/products").then(({ data }) => dispatch(updateProducts(data)));
    }, [dispatch]);
    return (
        <div>
            <img src="https://res.cloudinary.com/lvmcloud/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1685985245/banner_mtpdad.jpg?_s=public-apps" alt="" className="home-banner" />
            <div className="recent-products-container container mt-4">
                <h2>КАТЕГОРІЇ</h2>
                <div>
                    <Link to="/category/all" style={{ textAlign: "right", display: "block", textDecoration: "none" }}>
                        {"Всі продукти >>"}
                    </Link>
                </div>
                <Row>
                    {categories.map((category, index) => (
                        <LinkContainer to={`/category/${category.name.toLocaleLowerCase()}`} key={index}>
                            <Col md={4}>
                                <div style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`, gap: "10px" }} className="category-tile">
                                    {category.label}
                                </div>
                            </Col>
                        </LinkContainer>
                    ))}
                </Row>
            </div>
            <div className="featured-products-container container mt-4">
                {lastProducts.length ? <h2>Нові продукти</h2> : null}
                <div className="d-flex justify-content-center flex-wrap">
                    {lastProducts.map((product, index) => (
                        <ProductPreview  {...product} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
