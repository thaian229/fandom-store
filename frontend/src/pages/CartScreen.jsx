import React from "react";
import { Row, Col, Typography, Button, Divider, Empty, Result, notification, Avatar, Statistic } from "antd";
import {
    DollarOutlined,
} from '@ant-design/icons';
const { Title } = Typography;


const openSuccessRemoveNotification = (type) => {
    notification[type]({
        message: 'Removed Item',
    });
};

class CartScreen extends React.Component {
    state = {
        currentUser: {
            email: window.localStorage.getItem("email"),
            id: window.localStorage.getItem("id"),
            is_admin: "false"
        },
        placedOrderSuccess: false,
        cart_id: undefined,
        cart_items: [],
        numItem: 0,
        totalCost: 0,
    }

    adminCheck = () => {
        if (this.state.currentUser.email) {
            fetch("http://localhost:3001/api/users/checkAdmin", {
                credentials: "include",
                method: "GET"
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    this.setState({
                        currentUser: {
                            ...this.state.currentUser,
                            is_admin: data.data.is_admin
                        }
                    })
                })
        }
    }

    componentWillMount() {
        this.adminCheck()
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
                    console.log(data.data);
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
                if (!data.success) {
                    window.alert(data.message)
                } else {
                    openSuccessRemoveNotification('success')
                    this.componentDidMount();
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handlePlaceOrder = (event) => {
        event.preventDefault();
        if (this.state.numItem == 0) {
            window.alert('Your cart is empty, cannot place empty order')
            window.location.pathname = `/`
        } else {
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
                    if (!data.success) {
                        window.alert(data.message)
                    } else {

                        fetch(`http://localhost:3001/api/users/clearCart`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then((resp) => {
                                return resp.json()
                            })
                            .then((data2) => {
                                if (!data2.success) {
                                    console.log(data2.message)
                                } else {
                                    this.componentDidMount()
                                    this.setState({
                                        placedOrderSuccess: true,
                                    })
                                }
                            })
                            .catch((e) => {
                                console.log(e)
                            })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    render() {
        return (
            <div style={{
                backgroundImage: "linear-gradient(to bottom, #001529, #f5dba5)",
                minHeight: '100vh'
            }}>
                {this.state.placedOrderSuccess ? (
                    <Result
                        style={{ color: "white" }}
                        status="success"
                        title="Successfully Purchased!"
                        subTitle="Thank you for your patronage"
                        extra={[
                            <Button type="primary" key="console" onClick={() => window.location.pathname = `/`}>
                                Back Home
                            </Button>,
                            <Button key="buy" onClick={() => window.location.pathname = `/history`}>Order History</Button>,
                        ]}
                    />
                ) : (
                        <Row align='top'>
                            <Col span={5}></Col>
                            <Col span={19}>
                                <Title level={2} style={{ color: '#f5f5f7', marginTop: '50px', marginBottom: '30px', paddingLeft: '30px' }} >Here is your cart:</Title>
                            </Col>
                            <Col span={5}></Col>
                            <Col span={14}>
                                {this.state.cart_items[0] ? (
                                    <Row
                                        align="middle"
                                        style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2", lineHeight: '0', borderBottom: 'none', backgroundColor: '#fdfdfd', height: "70px", padding: '15px 30px 5px 30px', borderRadius: "10px 10px 0 0" }}>
                                        <Col span={5}>
                                            <Title level={4} style={{ textAlign: 'center' }} > </Title>
                                        </Col>
                                        <Col span={8}>
                                            <Title level={4} style={{ textAlign: 'center' }} > Product Name </Title>
                                        </Col>
                                        <Col span={3}>
                                            <Title level={4} style={{ textAlign: 'center' }} > Quantity </Title>
                                        </Col>
                                        <Col span={4}>
                                            <Title level={4} style={{ textAlign: 'center' }} > Price </Title>
                                        </Col>
                                        <Col span={4} style={{}}>
                                            <Title level={4} style={{ textAlign: 'center' }} > </Title>
                                        </Col>
                                    </Row>
                                ) : null}

                                {(this.state.numItem === 0) ? (
                                    (
                                        <div style={{ backgroundColor: '#fdfdfd', padding: '50px' }}>
                                            <Empty description='Your Cart Is Empty'>
                                                <Button type="primary" onClick={() => window.location.pathname = `/`}>Browse Products</Button>
                                            </Empty>
                                        </div>
                                    )
                                ) : null}
                                {this.state.cart_items.map((item) => {
                                    return (

                                        <Row align="middle" style={{ borderWidth: "2px", borderStyle: "solid", borderColor: '#f2f2f2', backgroundColor: '#fdfdfd', padding: '30px' }}>
                                            <Col span={5} align="center">
                                                <Avatar shape="square" style={{ width: "100%", paddingLeft: "5px" }} src={item.image_url[0]} size={100} />
                                            </Col>
                                            <Col span={8}>
                                                <Title level={4} style={{ textAlign: 'center' }} ><a onClick={(event) => { this.handleProductClick(item.prod_id) }}>{item.prod_name}</a> </Title>
                                            </Col>
                                            <Col span={3}>
                                                <Title level={4} style={{ textAlign: 'center' }} >{item.quantity}</Title>
                                            </Col>
                                            <Col span={4}>
                                                <Title level={4} style={{ textAlign: 'center', color: '#22946b' }} >${item.price}</Title>
                                            </Col>
                                            <Col span={4} align="center">
                                                <Button danger ghost onClick={(event) => { this.handleRemoveItem(item.id) }}>Remove</Button>
                                            </Col>
                                        </Row>
                                    )
                                })}
                                {(this.state.numItem === 0) ? null : (
                                    <Row
                                        align="middle"
                                        style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2", lineHeight: '0', borderBottom: 'none', backgroundColor: '#fdfdfd', padding: '25px', borderRadius: "0 0 10px 10px" }}>

                                        <Col span={17} align="middle">
                                            <Button type='primary' onClick={this.handlePlaceOrder} style={{ width: "100%", maxWidth: "1000px", height: "80px", fontSize: "40px", backgroundColor: "#0b1b2b", borderRadius: "5px 5px 5px 10px", border: "none" }}>Place Order</Button>
                                        </Col>
                                        <Col span={7} align="middle" style={{ padding: 0 }}>
                                            <Statistic style={{ padding: "20px", height: "80px", margin: "0px", paddingTop: "0" }} value={this.state.totalCost} prefix='$' valueStyle={{ color: '#22946b', fontSize: '50px' }} />
                                        </Col>
                                    </Row>
                                )}

                            </Col>
                            <Col span={5}></Col>
                        </Row>
                    )
                }
            </div>
        )
    }
}

export default CartScreen;