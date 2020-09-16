import React from "react";
import { ShoppingCartOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import { Avatar, Collapse, Carousel, Typography, Divider, Row, Col, Form, InputNumber, Button, List, Comment, Input, Card, Statistic, notification, Tabs, Breadcrumb, PageHeader } from "antd";
import '../styles/ProductScreen.css';
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Meta } = Card;
const { TabPane } = Tabs;


const CommentList = ({ cmt_data }) => (
    <List
        dataSource={cmt_data}
        header={cmt_data.length > 1 ? <Text style={{ fontSize: "15px" }}>{cmt_data.length} comments</Text> : <Text>{cmt_data.length} comment</Text>}
        itemLayout="horizontal"
        // renderItem={props => <Comment style={{ width: "100%" }} {...props} />}
        renderItem={(items) => (
            <li style={{ paddingTop: "10px", marginLeft: "30px" }}>
                <Comment
                    avatar={<Avatar src={items.ava_url} />}
                    author={<Text> {items.full_name}</Text>}
                    content={items.content}
                />
            </li>
        )}
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

const openFailAddToCartNotification = (type, error) => {
    notification[type]({
        message: 'Fail To Add',
        description: error,
    });
};

const openSuccessAddToCartNotification = type => {
    notification[type]({
        message: 'Add To Cart Successfully',
        description:
            'Go check your cart to place order',
    });
};


class ProductScreen extends React.Component {
    state = {
        currentUser: {
            email: window.localStorage.getItem("email"),
            id: window.localStorage.getItem("id"),
            is_admin: false,
            ava_url: window.localStorage.getItem("ava_url"),
            full_name: window.localStorage.getItem("full_name")
        },
        prod_id: undefined,
        prod_data: {
            image_url: [],
        },
        currentMarket: "",
        currentCategory: "",
        cmt_data: [],
        submitingComment: false,
        commentValue: '',
        recommend_data: [],
        quantity: 1,
        errMessage: '',
    };

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
                })
        }
    }

    componentWillMount() {
        this.adminCheck()
    }

    componentDidMount() {
        const divs = document.querySelectorAll(".ant-carousel .slick-slide")
        for (let i = 0; i < divs.length; i++) {
            divs[i].style.height = "464px"
        }

        const divs2 = document.querySelectorAll(".ant-carousel .slick-list")
        for (let i = 0; i < divs2.length; i++) {
            divs2[i].style.height = "464px"
        }

        const divs3 = document.querySelectorAll(".ant-carousel .slick-track")
        for (let i = 0; i < divs3.length; i++) {
            divs3[i].style.height = "464px"
        }

        const divs4 = document.querySelectorAll(".ant-layout-header")
        for (let i = 0; i < divs4.length; i++) {
            divs4[i].style.position = "static";
            divs4[i].style.boxShadow = "none";
        }

        const divs5 = document.querySelectorAll(".ant-layout")
        for (let i = 0; i < divs5.length; i++) {
            divs5[i].style.margin = 0;
            divs5[i].style.paddingBottom = 0;
        }

        // take params
        const { prod_id } = this.props.match.params;
        this.setState({
            prod_id: prod_id,
        });
        // Update views
        fetch(`http://192.168.68.120:3001/api/posts/updateViews`, {
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
        fetch(`http://192.168.68.120:3001/api/posts/getItem/${prod_id}`, {
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
                    currentMarket: data.data.tags.split('-')[0] + "-Market",
                    currentCategory: data.data.tags.split('-')[1],
                });
                // fetch comment of product
                fetch(`http://192.168.68.120:3001/api/posts/getAllComment/${prod_id}`, {
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
                        fetch(`http://192.168.68.120:3001/api/posts/getRecommended?tag=${this.state.prod_data.tags}`, {
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
        fetch(`http://192.168.68.120:3001/api/users/addToCart`, {
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
                console.log(data)
                if (!data.success) {
                    this.setState({
                        errMessage: data.message,
                    })
                    openFailAddToCartNotification('error', this.state.errMessage)
                } else {
                    console.log("add successfully")
                    openSuccessAddToCartNotification('success')
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
            `http://192.168.68.120:3001/api/posts/makeComment`,
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
                    commentValue: '',
                })
                this.componentDidMount();
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
        window.location.pathname = `/edit/${this.state.prod_id}`
    }

    handleDelete = (event) => {
        fetch(`http://192.168.68.120:3001/api/posts/removeItem`, {
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
                if (!data.success) {
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
            <div style={{
                backgroundImage: "linear-gradient(to bottom, #001529, #FCAE58)",
                paddingBottom: "70px",
                minHeight: "100vh"
            }}>
                <Row style={{ height: "30px" }}></Row>
                <Row align='top' justify="space-around" style={{ margin: "0 9vw", backgroundColor: "white", boxShadow: "12px 12px 3px #e0e0e0, 24px 24px 5px #bcbcbc" }}>
                    <Col span={24} style={{ height: "10px" }}></Col>
                    <Col span={23} >
                        <PageHeader
                            className="site-page-header"
                            // onBack={() => null}
                            title={
                                <Breadcrumb>
                                    <Breadcrumb.Item href="http://192.168.68.120:3000">
                                        <HomeOutlined style={{ marginBottom: "1px" }} />
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <span>Categories</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <span>{this.state.currentMarket}</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item href={"http://192.168.68.120:3000/category/" + this.state.prod_data.tags}>
                                        <span>{this.state.currentCategory}</span>
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            }
                            extra={
                                this.state.currentUser.is_admin ? (
                                    <div>
                                        <Row>
                                            <Col span={12}>
                                                <Button type='primary' onClick={this.handleEdit}><EditOutlined /> Edit</Button>
                                            </Col>
                                            <Col span={12}>
                                                <Button danger onClick={this.handleDelete}><DeleteOutlined /> Delete</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ) : null
                            }
                        >
                        </PageHeader>
                        <Col span={24} style={{ height: "10px" }}></Col>

                    </Col>
                    <Col lg={14} md={22} style={{}}>
                        <Carousel
                            autoplay={true}
                            dotPosition={'bottom'}
                            style={{ width: "100%", height: "468px", border: "solid 2px black" }}
                        >
                            {this.state.prod_data.image_url.map((item, index) => {
                                if (index !== 0) {
                                    return (
                                        <div key={index} >
                                            <img
                                                src={item}
                                                alt='cannot load'
                                                style={{
                                                    height: '464px',
                                                    marginTop: "auto",
                                                    marginBottom: "auto",
                                                    marginLeft: "auto",
                                                    marginRight: "auto",
                                                    verticalAlign: "middle",
                                                }}>
                                            </img>
                                        </div>
                                    );
                                }
                            })}
                        </Carousel>
                    </Col>
                    <Col lg={0} md={24} style={{ height: "30px" }}></Col>
                    <Col lg={8} md={23} style={{ boxShadow: "0 5px 15px rgba(0,0,0,0.3)", borderRadius: "25px" }}>
                        <Card
                            title={
                                <div style={{ paddingTop: "10px", marginBottom: "10px", border: "none" }}>
                                    <Text style={{ fontSize: "22px" }}>{this.state.prod_data.prod_name}</Text>
                                    <br />
                                    <Text level={3} style={{}} >$ {this.state.prod_data.price}</Text>
                                </div>
                            }
                            style={{ width: "100%", borderRadius: "25px 25px 0 0", backgroundColor: "#fcfcfc" }}>
                            <Text level={4}><EyeOutlined /> Views: {this.state.prod_data.views} <ShoppingCartOutlined /> Sold: {this.state.prod_data.sold}</Text>
                        </Card>
                        <Card
                            style={{
                                width: "100%", backgroundColor: "#001529", opacity: 0.9, borderRadius: "0 0 25px 25px", border: "none"
                            }}
                        >
                            {this.state.currentUser.is_admin ? (
                                <Row style={{ width: "100%" }}>
                                    <Col span={24} align="middle" style={{ paddingTop: "41px" }}>
                                        {
                                            this.state.prod_data.stock ? (
                                                <Text style={{ color: 'white', fontWeight: "bold", fontSize: "30px" }}>TOTAL EARNED</Text>
                                            ) : (
                                                    <Text style={{ color: 'white', fontWeight: "bold", fontSize: "30px", color: "orange" }}>OUT OF STOCK</Text>
                                                )
                                        }

                                    </Col>
                                    <Col span={24} align="middle" style={{ paddingBottom: "42px" }}>
                                        <Text style={{ color: '#3ac943', fontSize: "70px" }}>$ {this.state.prod_data.total_earned}</Text>
                                    </Col>
                                </Row>
                            ) : (

                                    this.state.prod_data.stock ? (
                                        <Form
                                            layout={'inline'}
                                            onFinish={this.handleAddToCart}
                                        >
                                            <Row style={{ width: "100%" }}>
                                                <Col span={8}>
                                                    <Form.Item >
                                                        <InputNumber
                                                            style={{
                                                                marginBottom: "10px"
                                                            }}
                                                            placeholder='1'
                                                            min={1}
                                                            max={this.state.prod_data.stock}
                                                            onChange={this.handleQuantityChange}
                                                            value={this.state.quantity}
                                                        />
                                                        <br />
                                                        <Text level={4} style={{ color: 'white', marginTop: "10px", fontSize: "17px" }}>Stock: {this.state.prod_data.stock}</Text>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={16} align="right" style={{ paddingTop: "40px" }}>
                                                    <Text style={{ color: 'white', fontWeight: "bold", fontSize: "17px" }}>TOTAL</Text>
                                                    <br />
                                                    <Text style={{ color: '#3ac943', fontSize: "40px" }}>$ {this.state.prod_data.price * this.state.quantity}</Text>
                                                </Col>
                                                <Divider orientation="center" style={{ color: 'white', fontWeight: 'normal', width: "100%" }}></Divider>
                                                <Col span={24} align="middle">
                                                    <Form.Item style={{ width: "100%" }}>
                                                        <Button
                                                            htmlType="submit"
                                                            style={{ color: '#fcfcfc', fontWeight: 'bold', fontSize: "27px", width: "100%", height: "60px", backgroundColor: "#fca541", border: "none", borderRadius: "13px" }}
                                                        >
                                                            <ShoppingCartOutlined />Add To Cart
                                                            </Button>

                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Form>
                                    ) : (<Text style={{ color: "white" }}>OUT OF STOCK</Text>)

                                )}


                        </Card>
                        {this.state.errMessage ? (
                            <Text type='danger'> {this.state.errMessage}</Text>
                        ) : null}
                    </Col>
                    <Col span={23} style={{ marginTop: "30px" }}>
                        <Tabs defaultActiveKey="1" style={{ width: "100%" }}>
                            <TabPane tab="Product Details" key="1">
                                <Row style={{ paddingLeft: "2vw", paddingRight: "2vw" }}>
                                    <p style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>{this.state.prod_data.description}</p>

                                    <Col align="middle" span={24}>
                                        {this.state.prod_data.image_url.map((item, index) => {
                                            if (index !== 0) {
                                                return (
                                                    <div key={"des" + index} >
                                                        <img
                                                            src={item}
                                                            alt='cannot load'
                                                            style={{
                                                                width: "60%",
                                                                marginTop: "20px",
                                                                marginBottom: "20px",
                                                                marginLeft: "auto",
                                                                marginRight: "auto",
                                                                verticalAlign: "middle",
                                                                maxWidth: "100%"
                                                            }}>
                                                        </img>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Shipping" key="2">
                                <Row style={{ paddingLeft: "2vw", paddingRight: "2vw" }}>
                                    <p style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                                        [Shipping] <br />
                                    Shipping Method : EMS <br />
                                    Shipping Area : Worldwide (EMS destinations excluding Japan, China, Macao, and Hong Kong) <br />
                                    Shipping Cost : International Shipping Fee <br />
                                    Shipping Time : 5 - 10 days <br />
                                    - All other orders will be dispatched on the following day. <br />
                                        <br />
                                    Additional shipping surcharges may apply for rural addresses. <br />
                                        <br />
                                    - Shipment delays may occur due to internal warehouse issues. <br />
                                    - We will contact you separately in the case of foreseeable shipping delays and/or sold-out items.<br />
                                        <br />
                                    - For items with designated sales period, cancellation is available only during the said period.<br />
                                        <br />
                                        <br />
                                    Customs and Duties<br />
                                        <br />
                                    - International shipments may be subject to customs duties and taxes, which are levied once
                                    the shipment reaches the recipient’s country. Additional charges for customs clearance must be
                                    fulfilled by the recipient.<br />
                                        <br />
                                    - Fansfere has no control over customs charges. Customs policies vary widely by country.
                                    Please contact your local customs office for more information.<br />
                                        <br />
                                    Orders that are returned due to the recipient’s refusal to pay customs duties will not be shipped again.
                                    All charges that occur during the process are the customer’s responsibility.<br />
                                    </p>
                                </Row>
                            </TabPane>
                            <TabPane tab={"Returns " + "&" + " Exchanges"} key="3">
                                <Row style={{ paddingLeft: "2vw", paddingRight: "2vw" }}>
                                    <p style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                                        [Returns & Exchanges]<br />
                                        <br />
                                        [Note Before Exchange/Return]<br />
                                        <br />
                                        ・The color of the actual product may vary from image depending on your monitor’s
                                        resolution settings. The color and placement of the product label may also vary from image.<br />
                                        <br />
                                        ・Order Cancellation<br />
                                        <br />
                                        - You can only cancel orders that are in [Payment Confirmed] or [Pending Shipment] status.<br />
                                        <br />
                                        - Please contact our CS center via cscenter_en@fansfere.com in order to request for cancellation.<br />
                                        <br />
                                        ・Exchanges and Returns<br />
                                        <br />
                                        1. Change of Mind<br />
                                        We unfortunately do not accept exchanges and returns due to change of mind.<br />
                                        <br />
                                        2. Wrong, Damaged, or Defective Items<br />
                                        If you received a wrong, damaged, or defective item, attach photo evidence (photos of the
                                        whole item as well as damaged part) and submit a Private Inquiry or email us at
                                        cscenter_en@fansfere.comwithin 7 days of delivery.<br />
                                        <br />
                                        <br />
                                        [Items Eligible for Exchange/Return]<br />
                                        <br />
                                        - Wrong, damaged, or defective item(s)<br />
                                        <br />
                                        <br />
                                        [Not Eligible for Exchange/Return]<br />
                                        <br />
                                        - Simple change of mind<br />
                                        - Wrong, damaged, or defective items that show signs of post-delivery usage or mishandling<br />
                                        - Made-to-order items, promotional items, and music albums for which a No Return/Exchange
                                        policy is stated on the product page<br />
                                        - Differences in color due to the customer’s monitor resolution and/or photo shoot settings<br />
                                        - Product prints/patterns that differ from product image<br />
                                        - Return packages that do not include the promotional gifts in initial shipment<br />
                                        - Items purchased online from Fansfere may not be
                                        exchanged or returned at our offline stores.<br />
                                        - Items purchased from our offline stores may not be exchanged
                                        or returned at Fansfere (online).<br />
                                        <br />
                                        - Included gift(s) must be returned along with the purchased item(s).<br />
                                        - Exchange/Return policies may vary by item. Please refer to the product pages for details.<br />
                                        <br />
                                        <br />
                                        [How to Return Items]<br />
                                        <br />
                                        If you wish to return/exchange your item, please submit a Private Inquiry or email us at
                                        cscenter_en@fansfere.com first. You can refer to the return process below.<br />
                                        <br />
                                        <br />
                                        <br />
                                        1. Within 7 days of delivery, attach photo evidence of your defective product
                                        (containing both the whole item as well as damaged part) and include your order number,
                                        product number of wrong/defective item, and reasons for return in your
                                        Private Inquiry or email to cscenter_en@fansfere.com<br />
                                        <br />
                                        2. We will contact you once we process your return request.<br />
                                        <br />
                                        3. Please include your order number, name, and ID on a slip of paper in your return package.<br />
                                        <br />
                                        * Items returned without prior request and confirmation are not eligible for refund.<br />
                                        * Return Shipping Fees<br />
                                        - Refunds/exchanges are not offered for change of mind.<br />
                                        - For wrong or defective items, the store is responsible for return shipping fees.<br />
                                        * Cash on delivery is not available for EMS shipments. If you send us a copy of your return
                                        shipment receipt, we will refund the shipping fee after confirmation.<br />
                                        <br />
                                        ・Exchange/Return Shipping Fees<br />
                                        <br />
                                        - Change of Mind: Returns are not accepted.<br />
                                        - Wrong, Damaged, or Defective Items: The store is responsible for return shipping fees.<br />
                                    </p>
                                </Row>
                            </TabPane>
                        </Tabs>

                    </Col>
                    <Col span={23} align="left" style={{ marginTop: "50px" }}>
                        {this.state.cmt_data.length > 0 && <CommentList cmt_data={this.state.cmt_data} />}
                        {(this.state.currentUser.id) ? (
                            <Comment
                                avatar={
                                    <Avatar
                                        src={this.state.currentUser.ava_url}
                                        alt={this.state.currentUser.full_name}
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
                        ) : null}
                    </Col>
                    <Col span={23} style={{ marginBottom: "30px" }}>
                        <Divider orientation="center" style={{ color: '#333', fontWeight: 'normal' }}></Divider>
                        <Text style={{ fontSize: "20px" }}>Related Products</Text>
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
            </div >
        )
    }
}

export default ProductScreen;