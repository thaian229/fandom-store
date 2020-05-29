import React from "react";
import { EditOutlined, DeleteOutlined, ShoppingCartOutlined, EyeOutlined, ExclamationCircleOutlined, InfoCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { Card, Row, Col, Modal, Button, Statistic, Menu, PageHeader, Carousel, Breadcrumb, Empty } from "antd";

const { Meta } = Card;
const { confirm } = Modal;
const { SubMenu } = Menu;


class SearchScreen extends React.Component {

    state = {
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: false,
        },
        data: [],
        loading: true,
        pageSize: 16,
        pageNumber: 0,
        searchValue: window.location.href.split("/")[window.location.href.split("/").length - 1]
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
        this.dataFetch(this.state.pageSize, this.state.pageNumber);
        document.addEventListener('DOMContentLoaded', function () {
            window.addEventListener('scroll', this.handleScroll);
        }, false);
        const divs = document.querySelectorAll(".ant-carousel .slick-slide")
        for (let i = 0; i < divs.length; i++) {
            divs[i].style.height = "18vw"
        }

        const divs2 = document.querySelectorAll(".ant-carousel .slick-list")
        for (let i = 0; i < divs2.length; i++) {
            divs2[i].style.height = "18vw"
        }

        const divs3 = document.querySelectorAll(".ant-carousel .slick-track")
        for (let i = 0; i < divs3.length; i++) {
            divs3[i].style.height = "18vw"
        }
    }

    handleClick = e => {
        console.log('click ', e);
    };

    dataFetch = (pageSize, pageNumber) => {
        fetch(`http://localhost:3001/api/posts/searchPagination?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber + 1}&searchValue=${this.state.searchValue}`, {
            credentials: "include",
            method: "GET"
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                let newData = this.state.data;
                data.data.map(item => {
                    newData.push(item);
                })

                this.setState({
                    data: newData,
                    pageNumber: this.state.pageNumber + 1
                })

                if (data.data) this.setState({ loading: false })
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    window.alert(err.message);
                }
            });
    }

    handleClickTag = (tag) => {
        window.location.pathname = `/category/${tag}`;
    }

    handleClickItem = (id) => {
        window.location.pathname = `/product/${id}`;
    }

    addItem = () => {

        window.location.pathname = `/addItem`;
    }

    handleEdit = (id) => {
        window.location.pathname = `/edit/${id}`;
    }

    handleDelete = async (id, index, outer) => {


        confirm({
            title: 'Do you want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action will not be able to reverse',
            onOk() {
                var successDelete = false;

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
                        successDelete = data.success;

                        if (successDelete) {
                            let newData = outer.state.data;
                            newData.splice(index, 1);
                            outer.setState({
                                data: newData
                            })
                        }
                    })
                    .catch(err => {
                        if (err) {
                            console.log(err);
                            window.alert(err.message);
                        }
                    });
                try {
                    return new Promise((resolve, reject) => {
                        setTimeout(resolve, 1000);
                    });
                }
                catch (e) {
                    return console.log('Oops errors!');
                }
            },
            onCancel() { },
        });


    }

    handleScroll = (event) => {
        console.log(document.body.scrollHeight)
        if (document.body.clientHeight + Math.floor(window.scrollY) === (document.body.scrollHeight) || document.body.clientHeight + Math.ceil(window.scrollY) === (document.body.scrollHeight)) {
            if (this.state.data.length === this.state.pageSize * (this.state.pageNumber))
                this.dataFetch(this.state.pageSize, this.state.pageNumber)
        }
    }

    componentWillUnmount() {
        this.setState({
            data: []
        })
    }

    render() {
        return (
            <div
                style={{
                    backgroundImage: "linear-gradient(to bottom, #001529, #FCAE58)",
                    padding: "0 4vw 70px 4vw",
                    minHeight: "100vh"
                }}>
                <Row align="top"
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px"
                    }}>
                    <Col span={4}
                        style={{
                            borderRadius: "10px"
                        }}
                    >
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: "100%", borderRight: "none", marginTop: "10px" }}
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                        >
                            <SubMenu
                                key="sub1"
                                title={
                                    <span >
                                        K-Market
                                    </span>
                                }
                            >
                                <Menu.ItemGroup key="g1" title="Official Releases">
                                    <Menu.Item key="2" onClick={(event) => { this.handleClickTag("K-Album") }}>Albums</Menu.Item>
                                    <Menu.Item key="3" onClick={(event) => { this.handleClickTag("K-Merchandise") }}>Merchandises</Menu.Item>
                                    <Menu.Item key="4" onClick={(event) => { this.handleClickTag("K-Concert") }}>Concerts</Menu.Item>
                                </Menu.ItemGroup>
                                <Menu.ItemGroup key="g2" title="Fansite Goods">
                                    <Menu.Item key="5" onClick={(event) => { this.handleClickTag("K-Keyring") }}>Keyrings</Menu.Item>
                                    <Menu.Item key="6" onClick={(event) => { this.handleClickTag("K-Artbook") }}>Artbooks</Menu.Item>
                                    <Menu.Item key="7" onClick={(event) => { this.handleClickTag("K-Photocard") }}>Photocards</Menu.Item>
                                    <Menu.Item key="8" onClick={(event) => { this.handleClickTag("K-Postcard") }}>Postcards</Menu.Item>
                                    <Menu.Item key="9" onClick={(event) => { this.handleClickTag("K-Slogan") }}>Slogans</Menu.Item>
                                    <Menu.Item key="10" onClick={(event) => { this.handleClickTag("K-Other") }}>Others</Menu.Item>
                                </Menu.ItemGroup>
                            </SubMenu>
                            <SubMenu
                                key="sub2"
                                title={
                                    <span>
                                        <span>J-Market</span>
                                    </span>
                                }
                            >
                                <Menu.ItemGroup key="g1" title="Physicals">
                                    <Menu.Item key="22" onClick={(event) => { this.handleClickTag("J-Photobook") }}>Photobooks</Menu.Item>
                                    <Menu.Item key="23" onClick={(event) => { this.handleClickTag("J-Illustration") }}>Illustrations</Menu.Item>
                                    <Menu.Item key="24" onClick={(event) => { this.handleClickTag("J-NovelAndManga") }}>J-Novels {"&"} Mangas</Menu.Item>
                                    <Menu.Item key="25" onClick={(event) => { this.handleClickTag("J-Fashion") }}>Fashions</Menu.Item>
                                    <Menu.Item key="26" onClick={(event) => { this.handleClickTag("J-Figure") }}>Figures</Menu.Item>
                                    <Menu.Item key="27" onClick={(event) => { this.handleClickTag("J-Other") }}>Others</Menu.Item>
                                </Menu.ItemGroup>
                                <Menu.ItemGroup key="g2" title="Digitals">
                                    <Menu.Item key="28" onClick={(event) => { this.handleClickTag("J-Audio") }}>Audios</Menu.Item>
                                    <Menu.Item key="29" onClick={(event) => { this.handleClickTag("J-Game") }}>Games</Menu.Item>
                                    <Menu.Item key="30" onClick={(event) => { this.handleClickTag("J-Video") }}>Videos</Menu.Item>
                                </Menu.ItemGroup>
                            </SubMenu>
                            <SubMenu
                                key="sub4"
                                title={
                                    <span>
                                        <InfoCircleOutlined />
                                        <span>About Us</span>
                                    </span>
                                }
                            >
                                <Menu.Item key="16">Introduction</Menu.Item>
                                <Menu.Item key="17">Policies</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Col>
                    <Col span={20} style={{ borderLeftWidth: "2px", borderLeftStyle: "solid", borderColor: "#f2f2f2" }}>
                        <Row>
                            <Col span={24} style={{ height: "10px" }}></Col>
                            <Col span={24} >
                                <PageHeader
                                    className="site-page-header"
                                    // onBack={() => null}
                                    title={
                                        <Breadcrumb>
                                            <Breadcrumb.Item href="http://localhost:3000">
                                                <HomeOutlined style={{ marginBottom: "1px" }} />
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <span>Search</span>
                                            </Breadcrumb.Item>
                                        </Breadcrumb>
                                    }
                                    style={{ paddingLeft: "2vw" }}
                                    extra={
                                        this.state.currentUser.is_admin ? (
                                            <Button
                                                style={{
                                                    margin: "10px"
                                                }}
                                                onClick={event => {
                                                    event.preventDefault();
                                                    this.addItem()
                                                }
                                                }>New Item</Button>

                                        ) : null
                                    }
                                >
                                </PageHeader>
                                <Col span={24} style={{ height: "8px" }}></Col>

                            </Col>
                            <Col span={12} style={{ padding: "4vw", marginBottom: "1vw", paddingTop: "3px", paddingLeft: "2vw", paddingRight: "1vw" }}>
                                <Carousel
                                    autoplay={true}
                                    dotPosition={"bottom"}
                                    style={{ width: "100%" }}
                                >
                                    <div>
                                        <img
                                            src='https://i.ytimg.com/vi/Y95FpmfF2nM/maxresdefault.jpg'
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div>
                                        <img
                                            src='https://cdn.hijabista.com.my/2020/03/kpop-11_52_598104.jpg'
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div>
                                        <img
                                            src='https://i.ytimg.com/vi/UmvTi2_8wGk/maxresdefault.jpg'
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                </Carousel>
                            </Col>
                            <Col span={12} style={{ padding: "4vw", marginBottom: "1vw", paddingTop: "3px", paddingRight: "2vw", paddingLeft: "1vw" }}>
                                <Carousel
                                    autoplay={true}
                                    dotPosition={"bottom"}
                                    style={{ width: "100%" }}
                                >
                                    <div>
                                        <img
                                            src='https://lh3.googleusercontent.com/4zh3h4w4ZNFNvXqFnL5mYwjmfPQkKoz2aRXd9QybY2lAVbunSeYKZWuh1JP4uzGRYmFNjUoKcCsNpMziFv9WFKHYNUUcEZz2=w1200-h630-rj-pp'
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div>
                                        <img
                                            src='https://i.ytimg.com/vi/tRiW2TKGG60/maxresdefault.jpg'
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div>
                                        <img
                                            src='https://i.ytimg.com/vi/29YL4gEdutY/maxresdefault.jpg'
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                </Carousel>
                            </Col>

                            {(this.state.data.length > 0) ? (
                                this.state.data.map((item, index) => {
                                    let key = `product${index}`
                                    return (
                                        <Col key={key} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }} xs={{ span: 24 }} key={index} style={{ paddingLeft: '2vw', paddingRight: "2vw", paddingBottom: "3vw" }}>
                                            <Card
                                                hoverable={true}
                                                loading={this.state.loading}
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

                                                actions={
                                                    this.state.currentUser.is_admin ? (
                                                        [<EditOutlined key="edit" onClick={event => this.handleEdit(item.id)} />,
                                                        <DeleteOutlined key="delete" onClick={event => this.handleDelete(item.id, index, this)} />]
                                                    ) : []
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
                            ) : (
                                    <Col span={24} align="middle" style={{ paddingTop: "50px", paddingBottom: "150px" }}>
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </Col>
                                )
                            }
                        </Row>
                    </Col>
                </Row>
            </div >
        )
    }
}

export default SearchScreen;