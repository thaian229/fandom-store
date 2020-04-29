import React from "react";
import { ShoppingCartOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Collapse, Carousel, Typography, Divider, Row, Col, Form, InputNumber, Button, List, Comment, Input, Card, Statistic } from "antd";
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Meta } = Card;


const CommentList = ({ cmt_data }) => (
    <List
        dataSource={cmt_data}
        header={`${cmt_data.length} ${cmt_data.length > 1 ? "replies" : "reply"}`}
        itemLayout="horizontal"
        renderItem={props => <Comment style={{ width: "100%" }} {...props} />}
    />
);

const Editor = ({ onChange, onSubmit, submitingComment, commentValue }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={commentValue} />
        </Form.Item>
        <Form.Item>
            <Button
                htmlType="submit"
                loading={submitingComment}
                onClick={onSubmit}
                type="primary"
            >
                Add Comment
        </Button>
        </Form.Item>
    </div>
);


class ProductScreen extends React.Component {
    state = {
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: window.sessionStorage.getItem("is_admin")
        },
        prod_id: undefined,
        prod_data: {
            image_url: [],
        },
        cmt_data: [],
        submitingComment: false,
        commentValue: '',
        recommend_data: [],
        quantity: 1,
        errMessage: '',
        currentUser: {
            is_admin: false,
        },
    };

    componentDidMount() {
        // take params
        const { prod_id } = this.props.match.params;
        this.setState({
            prod_id: prod_id,
        });
        // Update views
        fetch(`http://localhost:3001/api/posts/updateViews`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prod_id: prod_id,
            })
        })
            .catch((err) => {
                console.log(err)
            });
        // fetch product details
        fetch(`http://localhost:3001/api/posts/getItem/${prod_id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                console.log(res)
                return res.json();
            })
            .then((data) => {
                this.setState({
                    prod_data: data.data,
                });
                // fetch comment of product
                fetch(`http://localhost:3001/api/posts/getAllComment/${prod_id}`, {
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
                            cmt_data: data.data,
                        });
                        // fetch related products
                        fetch(`http://localhost:3001/api/posts/getRecommended?tag=${this.state.prod_data.tags}`, {
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
                                    recommend_data: data.data,
                                });
                                console.log(this.state);
                            })
                            .catch((error) => {
                                console.log(error)
                            });
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            })
            .catch((error) => {
                console.log(error)
            });
    }

    handleQuantityChange = (event) => {
        this.setState({
            quantity: event,
        })
    }

    handleAddToCart = () => {
        fetch(`http://localhost:3001/api/users/addToCart`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prod_id: this.state.prod_id,
                quantity: this.state.quantity
            })
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                if (!data.success) {
                    this.setState({
                        errMessage: data.message,
                    })
                } else {
                    console.log("add successfully")
                }
            })
            .catch((error) => {
                this.setState({
                    errMessage: error.message,
                })
            });
    }

    handleCommentSubmit = () => {
        if (!this.state.commentValue) {
            return;
        }

        this.setState({
            submittingComment: true
        });

        fetch(
            `http://localhost:3001/api/posts/makeComment`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prod_id: this.state.prod_id,
                    content: this.state.commentValue
                })
            }
        )
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                this.setState({
                    submitingComment: false,
                })
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    window.alert(err.message);
                }
            });
    }

    handleCommentChange = e => {
        this.setState({
            commentValue: e.target.value,
        });
    };

    handleEdit = (event) => {
        window.location.pathname = `/editItem/${this.state.prod_id}`
    }

    handleDelete = (event) => {
        fetch(`http://localhost:3001/api/posts/removeItem`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.prod_id,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if(!data.success) {
                    this.setState({
                        errMessage: data.message,
                    })
                } else {
                    window.location.pathname = `/`;
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    handleClickItem = (id) => {
        window.location.pathname = `/product/${id}`;
    }

    render() {
        return (
            <>
                <Row align='top'>
                    <Col span={24}>
                        <Title style={{ paddingLeft: '4vw' }}>{this.state.prod_data.prod_name}</Title>
                        <Divider orientation="center" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                    </Col>
                    <Col lg={1} span={0}></Col>
                    <Col lg={12} span={14} style={{ padding: "4vw", marginBottom: "1vw", paddingTop: "3px", paddingLeft: "2vw", paddingRight: "1vw" }}>
                        <Carousel
                            autoplay={true}
                            dotPosition={'bottom'}
                            style={{ width: "100%" }}
                        >
                            {this.state.prod_data.image_url.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <img
                                            src={item}
                                            alt='cannot load'
                                            style={{
                                                width: '100%',
                                            }}>
                                        </img>
                                    </div>
                                );
                            })}
                        </Carousel>
                    </Col>
                    <Col lg={1} span={0}></Col>
                    <Col lg={8} span={10} style={{ padding: "4vw", marginBottom: "1vw", paddingTop: "3px", paddingRight: "2vw", paddingLeft: "1vw" }}>
                        <Title level={3} style={{ color: 'green' }} >Price: ${this.state.prod_data.price}</Title>
                        <Title level={4}><EyeOutlined /> Views: {this.state.prod_data.views}</Title>
                        <Title level={4}><ShoppingCartOutlined /> Sold: {this.state.prod_data.sold}</Title>
                        <Title level={4}>Stock: {this.state.prod_data.stock}</Title>
                        {this.state.errMessage ? (
                            <Text type='danger'> {this.state.errMessage}</Text>
                        ) : null}
                        {this.state.currentUser.is_admin ? (
                            <div>
                                <Row>
                                    <Col span={6}>
                                        <Button type='primary' onClick={this.handleEdit}><EditOutlined /> Edit</Button>
                                    </Col>
                                    <Col span={18}>
                                        <Button danger onClick={this.handleDelete}><DeleteOutlined /> Delete</Button>
                                    </Col>
                                </Row>
                            </div>
                        ) : (
                                <div>
                                    <Form
                                        layout={'inline'}
                                        onFinish={this.handleAddToCart}
                                    >
                                        <Form.Item label="Qty">
                                            <InputNumber
                                                placeholder='1'
                                                min={1}
                                                max={this.state.prod_data.stock}
                                                onChange={this.handleQuantityChange}
                                                value={this.state.quantity}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Add To Cart <ShoppingCartOutlined />
                                            </Button>

                                        </Form.Item>
                                    </Form>
                                </div>
                            )}
                    </Col>
                    <Col lg={2} span={0}></Col>
                    <Col span={24} style={{ padding: "4vw", marginBottom: "1vw", paddingTop: "3px", paddingLeft: "2vw", paddingRight: "1vw" }}>
                        <Divider orientation="center" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                        <div>
                            <Collapse defaultActiveKey={['1']} >
                                <Panel header="See Full Desciption" key="1">
                                    <p>{this.state.prod_data.description}</p>
                                </Panel>
                            </Collapse>
                        </div>

                        <Divider orientation="center" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                    </Col>
                    <Col lg={4} span={0}></Col>
                    <Col lg={16} span={24} style={{ padding: "30px" }}>
                        {this.state.cmt_data.length > 0 && <CommentList cmt_data={this.state.cmt_data} />}
                        <Comment
                            avatar={
                                <Avatar
                                    src={this.state.currentUser.avaUrl}
                                    alt={this.state.currentUser.fullName}
                                />
                            }
                            content={
                                <Editor
                                    onChange={this.handleCommentChange}
                                    onSubmit={this.handleCommentSubmit}
                                    submitingComment={this.state.submitingComment}
                                    commentValue={this.state.commentValue}
                                />
                            }
                        />
                    </Col>
                    <Col lg={4} span={0}></Col>
                    <Col span={24}>
                        <Divider orientation="center" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                        <Title style={{ marginLeft: '4vw' }}>Related Products</Title>
                    </Col>
                    {this.state.recommend_data.map((item, index) => {
                        return (
                            <Col span={6} key={index} style={{ paddingLeft: '2vw', paddingRight: "2vw", paddingBottom: "3vw" }}>
                                <Card
                                    hoverable={true}
                                    style={{ width: '100%' }}
                                    cover={
                                        <img
                                            onClick={event => {
                                                event.preventDefault();
                                                this.handleClickItem(item.id);
                                            }}
                                            style={{ width: "100%", height: "auto" }}
                                            alt="example"
                                            src={item.image_url[0]}
                                        />
                                    }
                                >
                                    <Meta
                                        onClick={event => this.handleClickItem(item.id)}
                                        title={item.prod_name}
                                        description={
                                            <Row style={{}}>
                                                <Col span={10}>
                                                    <Row>
                                                        <Col span={24}>
                                                            {/* <h3>{item.prod_name}</h3> */}
                                                        </Col>
                                                        <Col span={24} style={{ marginTop: "4%", fontSize: "13px" }}><EyeOutlined /> Views: {item.views}</Col>
                                                        <Col span={24} style={{ marginTop: "4%", fontSize: "13px" }}><ShoppingCartOutlined /> Sold: {item.sold}</Col>
                                                    </Row>
                                                </Col>
                                                <Col span={14} align="right">
                                                    <Statistic style={{ marginTop: "2px" }} prefix="$" valueStyle={{ color: '#32CD32', fontSize: "30px", marginTop: "8px" }} title="Price" value={item.price} precision={2} />
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
            </>
        )
    }
}

export default ProductScreen;