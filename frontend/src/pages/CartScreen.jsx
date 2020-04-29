import React from "react";
import { Row, Col, Typography, Button, Divider } from "antd";
const { Title } = Typography;

class CartScreen extends React.Component {
    state = {
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: window.sessionStorage.getItem("is_admin")
        },
        cart_id: undefined,
        cart_items: [],
        numItem: undefined,
        totalCost: undefined,
    }

    componentDidMount() {
        // verify login
        if (!this.state.currentUser.id) {
            window.alert('Access Denied, Please Login')
            window.location.pathname = `/`
        } else { // fetch cart info
            fetch(`http://localhost:3001/api/users/cart`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    this.setState({
                        cart_id: data.cart_id,
                        cart_items: data.data,
                    })

                    let cnt = 0
                    let total = 0

                    this.state.cart_items.forEach((item) => {
                        cnt++
                        total = total + (item.quantity * item.price);
                    })

                    this.setState({
                        numItem: cnt,
                        totalCost: total,
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    handleProductClick = (prod_id) => {
        window.location.pathname = `/product/${prod_id}`;
    }

    handleRemoveItem = (id) => {
        fetch(`http://localhost:3001/api/users/removeFromCart`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cart_items_id: id,
            }),
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                if(!data.success) {
                    window.alert(data.message)
                } else {
                    window.location.pathname = `/cart`;
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handlePlaceOrder = (event) => {
        event.preventDefault();
        fetch(`http://localhost:3001/api/users/makeOrder`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                if(!data.success) {
                    window.alert(data.message)
                } else {
                    window.alert('Place Order Successfully, Redireacting...')
                    window.location.pathname = `/`
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        return (
            <div style={{ marginTop: '65px' }}>
                <Row align='top'>
                    <Col span={3}></Col>
                    <Col span={18}>
                        {this.state.cart_items.map((item) => {
                            return (
                                <>
                                    <Row>
                                        <Col span={6}>
                                            <Title level={4}><a onClick={(event) => { this.handleProductClick(item.prod_id) }}>{item.prod_name}</a> </Title>
                                        </Col>
                                        <Col span={6}>
                                            <Title level={4}>{item.quantity}</Title>
                                        </Col>
                                        <Col span={6}>
                                            <Title level={4}>{item.price}</Title>
                                        </Col>
                                        <Col span={6}>
                                            <Button danger onClick={(event) => { this.handleRemoveItem(item.id) }}>Remove</Button>
                                        </Col>
                                    </Row>
                                    <Divider></Divider>
                                </>
                            )
                        })}
                        <Title level={3} style={{ align: 'right' }}>Total: ${this.state.totalCost}</Title>
                        <Button type='primary' onClick={this.handlePlaceOrder}>Place Order</Button>
                    </Col>
                    <Col span={3}></Col>
                </Row>
            </div>
        )
    }
}

export default CartScreen;