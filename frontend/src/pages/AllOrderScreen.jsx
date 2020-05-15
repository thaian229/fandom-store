import React from "react";
import { Col, Row, Typography, Button, Checkbox, Modal } from "antd";
import { Link } from "react-router-dom";
const { Title, Text } = Typography;


class AllOrderScreen extends React.Component {
    state = {
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: false
        },
        orderList: [],
        orderItems: [],
        visible_order: false,
        visible_acc: false,
        curOderId: "",
        curAccId: "",
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
                    if (!data.data.is_admin) {
                        window.location.pathname = "/"
                    }
                })
        } else {
            window.location.pathname = "/login"
        }
    }

    componentWillMount() {
        this.adminCheck()
    }

    componentDidMount() {
        // verify login
        if (!this.state.currentUser.id) {
            window.alert('Access Denied, Please Login')
            window.location.pathname = `/login`
        }
        else { // fetch orders info
            fetch(`http://localhost:3001/api/users/allOders`, {
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
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    showModalOrder = (order_id) => {
        this.setState({
            visible_order: true,
            curOderId: order_id,
        });
    };

    showModalAccount = (acc_id) => {
        this.setState({
            visible_acc: true,
            curAccId: acc_id,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible_order: false,
            visible_acc: false,
        });
    };

    render() {
        return (
            <div style={{ margin: '5vw' }}>
                {this.state.currentUser.is_admin ? (
                    <Row align='center'>

                        <Col span={20}>
                            <Title level={2} style={{ textAlign: 'center' }} >Pending orders</Title>
                        </Col>


                        <Col span={20}>
                            <Row style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2", lineHeight: '0', borderBottom: 'none', backgroundColor: '#E6EFFF' }}>
                                <Col span={8}>
                                    <Title level={4} style={{ textAlign: 'center' }} > Order ID </Title>
                                </Col>
                                <Col span={8}>
                                    <Title level={4} style={{ textAlign: 'center' }}> User ID</Title>
                                </Col>
                                <Col span={4}>
                                    <Title level={4} style={{ textAlign: 'center' }} > Created At </Title>
                                </Col>
                                <Col span={4}>
                                    <Title level={4} style={{ textAlign: 'center' }} > Status </Title>
                                </Col>
                            </Row>
                            {this.state.orderList.map((item, index) => {
                                return (
                                    <div>
                                        {item.processed ? null : (
                                            <Row key={item.order_id} style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2" }}>
                                                <Col span={8}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <Button type='link' onClick={this.showModalOrder(item.order_id)}>
                                                            <Text>{item.order_id}</Text>
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col span={8}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Button type='link' onClick={this.showModalAccount(item.acc_id)}>
                                                            <Text>{item.acc_id}</Text>
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col span={4}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Text>{item.created_at}</Text>
                                                    </div>
                                                </Col>
                                                <Col span={4}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Checkbox defaultChecked={false} onChange={(event) => {
                                                            const newOrderList = this.state.orderList.map((item, i) => {
                                                                if (index === i) {
                                                                    return {
                                                                        order_id: item.order_id,
                                                                        acc_id: item.acc_id,
                                                                        created_at: item.created_at,
                                                                        order_detail: item.order_detail,
                                                                        processed: true,
                                                                    };
                                                                }
                                                                else {
                                                                    return item;
                                                                }
                                                            });
                                                            console.log(newOrderList)
                                                            this.setState({
                                                                orderList: newOrderList,
                                                            });
                                                            console.log(item.order_id)
                                                            fetch(`http://localhost:3001/api/users/updateProcess`, {
                                                                method: "POST",
                                                                credentials: 'include',
                                                                headers: {
                                                                    "Content-Type": "application/json",
                                                                },
                                                                body: JSON.stringify({
                                                                    id: item.order_id,
                                                                    processed: true
                                                                }),
                                                            })
                                                                .then((res) => {
                                                                    return res.json();
                                                                })
                                                                .then((data) => {
                                                                    console.log("Update done");
                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                });
                                                            ;
                                                        }}
                                                        >
                                                            <Text style={{ color: "#ff0000" }} >Pending</Text>
                                                        </Checkbox>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                )
                            })}
                            <Modal
                                title="Basic Modal"
                                visible={this.state.visible_order}
                                onOk={this.handleOk}
                            >
                                <p>{this.state.curOderId}</p>
                                <p>Some contents...</p>
                                <p>Some contents...</p>
                            </Modal>
                            <Modal
                                title="Basic Modal"
                                visible={this.state.visible_acc}
                                onOk={this.handleOk}
                            >
                                <p>{this.state.curAccId}</p>
                                <p>Some contents...</p>
                                <p>Some contents...</p>
                            </Modal>
                        </Col>

                        <Col span={20}>
                            <Title level={2} style={{ textAlign: 'center' }} >Finish orders</Title>
                        </Col>

                        <Col span={20}>
                            <Row style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2", lineHeight: '0', borderBottom: 'none', backgroundColor: '#E6EFFF' }}>
                                <Col span={8}>
                                    <Title level={4} style={{ textAlign: 'center' }} > Order ID </Title>
                                </Col>
                                <Col span={8}>
                                    <Title level={4} style={{ textAlign: 'center' }}> User ID</Title>
                                </Col>
                                <Col span={4}>
                                    <Title level={4} style={{ textAlign: 'center' }} > Created At </Title>
                                </Col>
                                <Col span={4}>
                                    <Title level={4} style={{ textAlign: 'center' }} >  </Title>
                                </Col>
                            </Row>
                            {this.state.orderList.map((item, index) => {
                                return (
                                    <div>
                                        {item.processed ? (
                                            <Row key={item.order_id} style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2" }}>
                                                <Col span={8}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <Text>{item.order_id}</Text>
                                                    </div>
                                                </Col>
                                                <Col span={8}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Text>{item.acc_id}</Text>
                                                    </div>
                                                </Col>
                                                <Col span={4}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Text>{item.created_at}</Text>
                                                    </div>
                                                </Col>
                                                <Col span={4}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Checkbox defaultChecked onChange={(event) => {
                                                            const newOrderList = this.state.orderList.map((item, i) => {
                                                                if (index === i) {
                                                                    return {
                                                                        order_id: item.order_id,
                                                                        acc_id: item.acc_id,
                                                                        created_at: item.created_at,
                                                                        order_detail: item.order_detail,
                                                                        processed: false,
                                                                    };
                                                                }
                                                                else {
                                                                    return item;
                                                                }
                                                            });
                                                            console.log(newOrderList)
                                                            this.setState({
                                                                orderList: newOrderList,
                                                            });
                                                            console.log(item.order_id)
                                                            fetch(`http://localhost:3001/api/users/updateProcess`, {
                                                                method: "POST",
                                                                credentials: 'include',
                                                                headers: {
                                                                    "Content-Type": "application/json",
                                                                },
                                                                body: JSON.stringify({
                                                                    id: item.order_id,
                                                                    processed: false
                                                                }),
                                                            })
                                                                .then((res) => {
                                                                    return res.json();
                                                                })
                                                                .then((data) => {
                                                                    console.log("Update done");
                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                });
                                                            ;
                                                        }}
                                                        >
                                                            <Text style={{ color: "#00ba10" }} >Complete</Text>
                                                        </Checkbox>
                                                    </div>
                                                </Col>
                                            </Row>
                                        ) : null}
                                    </div>
                                )
                            })}
                        </Col>
                    </Row>

                ) : null}
            </div>
        )
    }
}

export default AllOrderScreen;