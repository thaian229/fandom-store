import React from "react";
import { EditOutlined, DeleteOutlined, ShoppingCartOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Skeleton, Card, Row, Col, Avatar, Modal, Button, Statistic, Layout, AutoComplete } from "antd";

const { Meta } = Card;
const { confirm } = Modal;


class HomeScreen extends React.Component {

    state = {
        currentUser: {},
        data: [],
        loading: true
    }

    componentWillMount() {
        const email = window.sessionStorage.getItem("email");
        const id = window.sessionStorage.getItem("id");
        const is_admin = window.sessionStorage.getItem("is_admin");

        this.setState({
            currentUser: {
                email: email,
                id: id,
                is_admin: is_admin
            }
        })
    }

    componentDidMount() {
        fetch(`http://localhost:3001/api/posts/getPagination?pageSize=9&pageNumber=1`, {
            credentials: "include",
            method: "GET"
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                this.setState({
                    data: data.data
                })
                console.log(this.state)
                if (data) this.setState({ loading: false })

            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    window.alert(err.message);
                }
            });
    }

    handleClickItem = (id) => {
        window.location.pathname = `/product/${id}`;
    }


    handleEdit = (id) => {
        window.location.pathname = `/edit/${id}`;
    }


    handleDelete = (id) => {

        let success = false;

        confirm({
            title: 'Do you want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action will not be able to reverse',
            onOk() {
                fetch(`http://localhost:3001/api/posts/removeItem`, {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: id,
                    })
                })
                    .then(res => {
                        console.log(res);
                        return res.json();
                    })
                    .then(data => {
                        console.log(data.success);
                        success = data.success;
                    })
                    .catch(err => {
                        if (err) {
                            console.log(err);
                            window.alert(err.message);
                        }
                    });
                return new Promise((resolve, reject) => {
                    setTimeout(success ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });


    }


    render() {
        return (
            <div style={{ marginTop: `65px` }}>

                <Row align="middle">
                    {
                        this.state.data.map((item, index) => {
                            return (
                                <Col span={8} key={index} style={{ padding: '20px' }}>
                                    <Card
                                        hoverable={true}
                                        loading={this.state.loading}
                                        style={{ width: '100%' }}
                                        cover={
                                            <img
                                                onClick={event => this.handleClickItem(item.id)}
                                                style={{}}
                                                alt="example"
                                                src={item.image_url}
                                            />
                                        }

                                        actions={
                                            this.state.currentUser.is_admin ? (
                                                [<EditOutlined key="edit" onClick={event => this.handleEdit(item.id)} />,
                                                <DeleteOutlined key="delete" onClick={event => this.handleDelete(item.id)} />]
                                            ) : []
                                        }
                                    >
                                        <Meta
                                            onClick={event => this.handleClickItem(item.id)}
                                            // title={item.prod_name}
                                            description={
                                                <Row style={{ padding: "5%" }}>
                                                    <Col span={14}>
                                                        <Row>
                                                            <Col span={24}>
                                                                <h3>{item.prod_name}</h3>
                                                            </Col>
                                                            <Col span={8} style={{ marginTop: "4%" }}><EyeOutlined /> {item.views}</Col>
                                                            <Col span={16} style={{ marginTop: "4%" }}><ShoppingCartOutlined /> {item.sold}</Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={10}>
                                                        <Statistic style={{ marginTop: "0%" }} prefix="$" valueStyle={{ color: '#32CD32', fontSize: "25px" }} title="Price:" value={item.price} precision={2} />
                                                    </Col>
                                                </Row>
                                            }
                                        />
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
        )
    }
}

export default HomeScreen;