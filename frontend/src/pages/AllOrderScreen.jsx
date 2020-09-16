import React from "react";
import { Col, Row, Typography, Button, Checkbox, Modal, Avatar } from "antd";
import { Link } from "react-router-dom";
const { Title, Text } = Typography;


class AllOrderScreen extends React.Component {
    state = {
        currentUser: {
            email: window.localStorage.getItem("email"),
            id: window.localStorage.getItem("id"),
            is_admin: false
        },
        orderList: [],
        orderItems: [],
        visible_order: false,
        visible_acc: false,
        curOderId: '',
        curAccId: '',
        email: '',
        fullname: '',
        address: '',
        dob: null,
        ava_url: '',
        tel_num: '',
    }

    adminCheck = () => {
        if (this.state.currentUser.email) {
            fetch("http://192.168.68.120:3001/api/users/checkAdmin", {
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
            fetch(`http://192.168.68.120:3001/api/users/allOders`, {
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
        this.state.orderList.map((element) => {
            if (element.order_id == order_id) {
                this.setState({
                    visible_order: true,
                    curOderId: order_id,
                    orderItems: element.order_detail,
                });
            }
        })
    };

    showModalAccount = (acc_id) => {
        this.state.orderList.map((element) => {
            console.log(element)
            if (element.acc_id == acc_id) {
                console.log(element);
                this.setState({
                    visible_acc: true,
                    curAccId: acc_id,
                    email: element.email,
                    fullname: element.fullname,
                    address: element.address,
                    dob: element.dob,
                    ava_url: element.ava_url,
                    tel_num: element.tel_num,
                });
            }
        })
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
            <div style={{
                backgroundImage: "linear-gradient(to bottom, #001529, #f5dba5)", minHeight: '100vh', paddingTop: "50px"
            }}>
                {this.state.currentUser.is_admin ? (
                    <Row align='center'>

                        <Col span={20}>
                            <Title level={2} style={{ textAlign: 'center', color: 'white', marginBottom: "30px" }} >Customer's orders</Title>
                        </Col>


                        <Col span={20}>
                            <Row style={{ backgroundColor: '#fdfdfd', paddingTop: "9px", borderRadius: "25px 25px 0 0" }}>
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
                                            <Row key={item.order_id} style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2", backgroundColor: '#fdfdfd', height: "50px" }}>
                                                <Col span={8} style={{ paddingTop: "7px" }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <Button type='link'
                                                            onClick={event => this.showModalOrder(item.order_id)}
                                                        >
                                                            <Text>{item.order_id}</Text>
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col span={8} style={{ paddingTop: "7px" }}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Button type='link'
                                                            onClick={event => this.showModalAccount(item.acc_id)}
                                                        >
                                                            <Text>{item.acc_id}</Text>
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col span={4} style={{ paddingTop: "14px" }}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Text>{item.created_at.split('T')[0] + " " + item.created_at.split('T')[1].split('.')[0]}</Text>
                                                    </div>
                                                </Col>
                                                <Col span={4} style={{ paddingTop: "7px" }}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Button ghost style={{ width: '100px' }} onClick={(event) => {
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
                                                            fetch(`http://192.168.68.120:3001/api/users/updateProcess`, {
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
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                )
                            })}
                            <Modal
                                title="Order Info"
                                visible={this.state.visible_order}
                                onOk={this.handleOk}
                                onCancel={this.handleOk}
                                footer={[
                                    <Button key="submit" type="primary" onClick={this.handleOk}>
                                        Ok
                                    </Button>
                                ]}
                            >
                                {this.state.orderItems.map((element, index) => {
                                    return (
                                        <Row align="center" style={{ marginBottom: "25px", marginTop: "25px" }}>
                                            <Col span={6}>
                                                <Avatar shape="square" src={element.image_url[0]} size={100} />
                                            </Col>
                                            <Col span={18}>
                                                <Row style={{ paddingTop: "25px" }}>
                                                    <Col span={16}>
                                                        <div style={{ textAlign: 'center' }} >
                                                            <Text> Product Name </Text>
                                                        </div>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div style={{ textAlign: 'center' }} >
                                                            <Text> Quantity </Text>
                                                        </div>
                                                    </Col>
                                                    <Col span={16} align="middle">
                                                        <div style={{ textAlign: 'center' }} >
                                                            <a onClick={() => window.location.pathname = `/product/${element.prod_id}`}>
                                                                <Text style={{ color: 'blue' }}>{element.prod_name}</Text>
                                                            </a>
                                                        </div>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div style={{ textAlign: 'center' }} >
                                                            <Text>{element.quantity}</Text>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Modal>

                            <Modal
                                title="User Info"
                                visible={this.state.visible_acc}
                                onOk={this.handleOk}
                                onCancel={this.handleOk}
                                footer={[
                                    <Button key="submit" type="primary" onClick={this.handleOk}>
                                        Ok
                                    </Button>
                                ]}
                            >
                                <Row>
                                    <Col span={6} style={{ align: 'center' }}>
                                        <Avatar shape="circle" size={100} src={this.state.ava_url} />
                                    </Col>
                                    <Col span={18}>
                                        <div>
                                            <Text>Full Name: {this.state.fullname}</Text>
                                        </div>
                                        <div>
                                            <Text>Email: {this.state.email}</Text>
                                        </div>
                                        <div>
                                            <Text>Address: {this.state.address}</Text>
                                        </div>
                                        <div>
                                            <Text>Phone Number: {this.state.tel_num}</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </Modal>
                        </Col>

                        <Col span={20}>
                            {this.state.orderList.map((item, index) => {
                                return (
                                    <div>
                                        {item.processed ? (
                                            <Row key={item.order_id} style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2", backgroundColor: '#fdfdfd', height: '50px' }}>
                                                <Col span={8} style={{ paddingTop: "9px" }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <Button type='link'
                                                            onClick={event => this.showModalOrder(item.order_id)}
                                                        >
                                                            <Text>{item.order_id}</Text>
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col span={8} style={{ paddingTop: "9px" }}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Button type='link'
                                                            onClick={event => this.showModalAccount(item.acc_id)}
                                                        >
                                                            <Text>{item.acc_id}</Text>
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col span={4} style={{ paddingTop: "14px" }}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Text>{item.created_at.split('T')[0] + " " + item.created_at.split('T')[1].split('.')[0]}</Text>
                                                    </div>
                                                </Col>
                                                <Col span={4} style={{ paddingTop: "9px" }}>
                                                    <div style={{ textAlign: 'center' }} >
                                                        <Button ghost style={{ width: '100px' }} onClick={(event) => {
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
                                                            fetch(`http://192.168.68.120:3001/api/users/updateProcess`, {
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
                                                        </Button>
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
                <Row align="center">
                    <Col span={20} style={{ backgroundColor: '#fdfdfd', paddingTop: "9px", borderRadius: "0 0 25px 25px ", height: '30px' }}>

                    </Col>
                </Row>
            </div>
        )
    }
}

export default AllOrderScreen;