import React from "react";
import { Avatar, Collapse, Carousel, Typography, Divider, Row, Col, Form, InputNumber, Button, List, Comment, Input } from "antd";
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;


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

    componentWillMount() {
        const is_admin = window.localStorage.getItem("is_admin");
        if (is_admin) {
            this.setState({
                currentUser: {
                    is_admin: is_admin,
                },
            });
        }
    }

    componentDidMount() {
        // fetch all
        const { prod_id } = this.props.match.params;
        this.setState({
            prod_id: prod_id,
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

    render() {
        return (
            <>
                <Row style={{ marginTop: '100px' }}>
                    <Title style={{ paddingLeft: '4%' }}>{this.state.prod_data.prod_name}</Title>
                </Row>
                <Row>
                    <Divider orientation="center" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                </Row>
                <Row gutter={[32, 16]} >
                    <Col span={2}>
                        <div></div>
                    </Col>
                    <Col span={12}>
                        <Carousel autoplay>
                            {this.state.prod_data.image_url.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <img 
                                            src={item} 
                                            alt='an img' 
                                            style={{ 
                                                display: 'block', 
                                                maxHeight: '100%', 
                                                objectFit: 'cover'
                                            }}>
                                        </img>
                                    </div>
                                );
                            })}
                        </Carousel>
                    </Col>
                    <Col span={2}>
                        <div></div>
                    </Col>
                    <Col span={8}>
                        <Title level={3} style={{ color: 'green' }} >Price: ${this.state.prod_data.price}</Title>
                        <Title level={4}>Views: {this.state.prod_data.views}</Title>
                        <Title level={4}>Sold: {this.state.prod_data.sold}</Title>
                        <Title level={4}>Stock: {this.state.prod_data.stock}</Title>
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
                                        Add To Cart
                                    </Button>
                                    {this.state.errMessage ? (
                                        <Text type='danger'> {this.state.errMessage}</Text>
                                    ) : null}
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="center" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                </Row>
                <div>
                    <Collapse defaultActiveKey={['1']} >
                        <Panel header="See Full Desciption" key="1">
                            <p>{this.state.prod_data.description}</p>
                        </Panel>
                    </Collapse>
                </div>
                <Row>
                    <Divider orientation="center" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                </Row>
                <div>
                    <Col xl={4} span={0}></Col>
                    <Col xl={20} span={24} style={{ padding: "30px" }}>
                        {this.state.cmt_data.length > 0 && <CommentList cmt_data={this.state.cmt_datacmt_data} />}
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
                </div>
            </>
        )
    }
}

export default ProductScreen;