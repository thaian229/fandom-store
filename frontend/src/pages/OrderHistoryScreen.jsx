import React from "react";
import { Row, Col, Typography, Button, Divider, Empty, Result, notification, Collapse, Avatar } from "antd";
const { Title, Text } = Typography;
const { Panel } = Collapse;

class OrderHistoryScreen extends React.Component {
    state = {
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: false
        },
        orderList: [],
        orderItems: [],
        emptyHistory: false,
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
                            <Col span={10}>
                                <Title level={4} style={{ textAlign: 'center' }} > Created At </Title>
                            </Col>
                            <Col span={4}>
                                <Title level={4} style={{ textAlign: 'center' }} > Status </Title>
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
                                        <Col span={10}>
                                            <div style={{ textAlign: 'center' }} >
                                                <Text>{item.created_at}</Text>
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div style={{ textAlign: 'center' }} >
                                                <Text>{(item.processed) ? <Text style={{ color: "#00ba10" }} >Done</Text> : <Text style={{ color: "#ff0000" }} >Pending</Text>}</Text>
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <Collapse>
                                                <Panel header="See Order Detail" key="1">
                                                    <Row>
                                                        <Col span={2}></Col>
                                                        <Col span={8}>
                                                            <div style={{ textAlign: 'center' }} >
                                                                <Text> Product Name </Text>
                                                            </div>
                                                        </Col>
                                                        <Col span={10}>
                                                            <div style={{ textAlign: 'center' }} >
                                                                <Text> Product ID </Text>
                                                            </div>
                                                        </Col>
                                                        <Col span={4}>
                                                            <div style={{ textAlign: 'center' }} >
                                                                <Text> Quantity </Text>
                                                            </div>
                                                        </Col>
                                                        {item.order_detail.map((element) => {
                                                            return (
                                                                <>
                                                                    <Col span={2}>
                                                                        <Avatar shape="square" src={element.image_url[0]} size={"100%"} />
                                                                    </Col>
                                                                    <Col span={8}>
                                                                        <div style={{ textAlign: 'center' }} >
                                                                            <a onClick={() => window.location.pathname = `/product/${element.prod_id}`}>
                                                                                <Text style={{ color: 'blue' }}>{element.prod_name}</Text>
                                                                            </a>
                                                                        </div>
                                                                    </Col>
                                                                    <Col span={10}>
                                                                        <div style={{ textAlign: 'center' }} >
                                                                            <Text>{element.prod_id}</Text>
                                                                        </div>
                                                                    </Col>
                                                                    <Col span={4}>
                                                                        <div style={{ textAlign: 'center' }} >
                                                                            <Text>{element.quantity}</Text>
                                                                        </div>
                                                                    </Col>
                                                                </>
                                                            )
                                                        })}
                                                    </Row>
                                                </Panel>
                                            </Collapse>
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