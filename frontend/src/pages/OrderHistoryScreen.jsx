import React from "react";
import { Row, Col, Typography, Button, Divider, Empty, Result, notification } from "antd";
const { Title, Text } = Typography;

class OrderHistoryScreen extends React.Component {
    state = {
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: window.sessionStorage.getItem("is_admin") === 'true'
        },
        orderList: [],
        orderItems: [],
        emptyHistory: false,
    }

    componentDidMount() {
        // verify login
        if (!this.state.currentUser.id) {
            window.alert('Access Denied, Please Login')
            window.location.pathname = `/`
        } else { // fetch orders info
            fetch(`http://localhost:3001/api/users/orderHistory`, {
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
                    if (!data.success) {
                        window.alert(data.message)
                        window.location.pathname = `/`
                    } else {
                        this.setState({
                            orderList: data.data,
                        })
                        console.log(this.state.orderList)
                        if (!this.state.orderList) {
                            this.setState({
                                emptyHistory: true,
                            })
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    handleOrderDetail = (order_id) => {
        
    }

    render() {
        return (
            <div style={{ marginTop: '100px' }}>
                <Row align='top'>
                    <Col span={4}></Col>
                    <Col span={20}>
                        <Title level={2} style={{}} >Here your orders:</Title>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={16}>
                        <Row style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2", lineHeight: '0', borderBottom: 'none', backgroundColor: '#E6EFFF' }}>
                            <Col span={10}>
                                <Title level={4} style={{ textAlign: 'center' }} > OrderID </Title>
                            </Col>
                            <Col span={7}>
                                <Title level={4} style={{ textAlign: 'center' }} > Created At </Title>
                            </Col>
                            <Col span={7} style={{ paddingRight: '15px' }}>
                                <Title level={4} style={{ textAlign: 'right' }} > Option </Title>
                            </Col>
                        </Row>
                        {(this.state.emptyHistory) ? (
                            (
                                <div style={{ marginTop: '25px' }}>
                                    <Empty description='Your Cart Is Empty'>
                                        <Button type="primary" onClick={() => window.location.pathname = `/`}>Browse Products</Button>
                                    </Empty>
                                </div>
                            )
                        ) : null}
                        {this.state.orderList.map((item, index) => {
                            return (
                                <>
                                    <Row key={item.order_id} style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2" }}>
                                        <Col span={10}>
                                            <div style={{ textAlign: 'center' }}>
                                                <Text>{item.order_id}</Text>
                                            </div>
                                        </Col>
                                        <Col span={7}>
                                            <div style={{ textAlign: 'center' }} >
                                                <Text>{item.created_at}</Text>
                                            </div>
                                        </Col>
                                        <Col span={7}>
                                            <Button type='primary' onClick={(event) => { this.handleOrderDetail(item.order_id) }} style={{ float: 'right' }}>Detail</Button>
                                        </Col>
                                    </Row>
                                </>
                            )
                        })}
                    </Col>
                    <Col span={4}></Col>
                </Row>
            </div>
        )
    }
}

export default OrderHistoryScreen;