import React from "react";
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Row, Col, Menu, Layout, Button, Input, Badge, Dropdown, Avatar } from "antd";
import '../styles/NavBar.css';
import ShoppingCart from "../styles/cart2.png"
import { withRouter } from "react-router-dom";

const { Search } = Input;

const { Header } = Layout;
const { SubMenu } = Menu;


class NavBar extends React.Component {

    state = {
        loading: false,
        searchValue: "",
        itemsInCart: false,
    }

    state = {
        loading: false,
        searchValue: "",
        currentUser: {
            email: window.localStorage.getItem("email"),
            id: window.localStorage.getItem("id"),
            is_admin: false,
            ava_url: window.localStorage.getItem("ava_url"),
            full_name: window.localStorage.getItem("full_name")
        },
        itemsInCart: false,
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
                })
        }
    }

    componentWillMount() {
        this.adminCheck()
    }

    componentDidMount() {
        console.log(this.state)
        const searchBox = document.querySelector(".ant-layout-header .ant-input");
        searchBox.style.backgroundColor = "#001529";
        searchBox.style.color = "#d9d9d9";
        searchBox.style.borderRadius = "0px";
        console.log(searchBox.style);
        console.log(this.state.currentUser)
        if (this.state.currentUser.id) {
            // fetch cart info
            fetch(`http://192.168.68.120:3001/api/users/cart`, {
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
                    if (data.data.length) {
                        this.setState({
                            itemsInCart: true,
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    handleLogout = () => {
        fetch(`http://192.168.68.120:3001/api/users/logout`, {
            credentials: "include",
            method: "GET"
        })
            .then(data => {
                return data.json();
            })
            .then(data => {
                console.log(data.message)
                window.localStorage.clear();
                window.localStorage.clear();
                window.location.pathname = '/'
            })
            .catch(e => {
                console.log(e)
            })
    }

    handleCartClick = () => {
        window.location.pathname = "/cart"
    }

    handleLogin = () => {
        window.location.pathname = "/login"
    }

    handleHistory = () => {
        window.location.pathname = "/history"
    }

    handleRegister = () => {
        window.location.pathname = "/register"
    }

    handleSearch = (value) => {
        window.location.pathname = `/search/${value}`
    }

    render() {
        return (
            <Header style={{ zIndex: 1, width: '100%', paddingLeft: "2vw", paddingRight: "2vw", height: "70px" }}>
                <Row align="middle">
                    <Col span={4}>
                        <a className="logo" href="http://192.168.68.120:3000" />
                    </Col>
                    <Col span={14}
                        style={{
                            paddingTop: "2px"
                        }}>
                        <Input
                            prefix={
                                <SearchOutlined
                                    style={{
                                        color: "white",
                                        marginRight: "10px"
                                    }}
                                />
                            }
                            placeholder="Search for products"
                            onPressEnter={event => this.handleSearch(event.target.value)}
                            style={{ width: "100%", maxWidth: "400px", backgroundColor: "#001529", border: "none" }}
                        />
                    </Col>
                    {this.state.currentUser.id ? (
                        <Col span={6} align="right">
                            {!this.state.currentUser.is_admin ? (
                                <Badge dot={this.state.itemsInCart} style={{ marginTop: "4px" }}>
                                    <Button
                                        onClick={event => {
                                            this.handleCartClick()
                                        }}
                                        ghost={true}
                                        type="link"
                                        icon={
                                            <img src={ShoppingCart} style={{ width: "80%", opacity: 0.9, marginBottom: "2px" }} />
                                        }
                                        size={'medium'}
                                    />
                                </Badge>
                            ) : null}
                            <Dropdown
                                style={{ marginLeft: "2vw", position: 'fixed' }}
                                overlay={


                                    this.state.currentUser.is_admin ? (
                                        <Menu style={{
                                            marginTop: "5px",
                                            padding: "10px",
                                            borderRadius: "10px"
                                        }}>
                                            <Menu.Item
                                                align="right"
                                                style={{
                                                    borderRadius: "10px"
                                                }}>
                                                <a rel="noopener noreferrer" href="http://192.168.68.120:3000/allorders">
                                                    All Orders
                                                    </a>
                                            </Menu.Item>
                                            <Menu.Item
                                                align="right"
                                                style={{
                                                    borderRadius: "10px"
                                                }}>
                                                <a rel="noopener noreferrer" href="http://192.168.68.120:3000/statistic">
                                                    Summary
                                                    </a>
                                            </Menu.Item>
                                            <Menu.Item
                                                align="right"
                                                style={{
                                                    borderRadius: "10px"
                                                }}>
                                                <a target="_blank" rel="noopener noreferrer" href="http://192.168.68.120:3000/profile">
                                                    Profile
                                            </a>
                                            </Menu.Item>
                                            <Menu.Item
                                                align="right"
                                                style={{
                                                    borderRadius: "10px"
                                                }}>
                                                <a target="_blank" rel="noopener noreferrer" onClick={event => this.handleLogout()}>
                                                    Logout
                                            </a>
                                            </Menu.Item>
                                        </Menu>
                                    ) : (
                                            <Menu style={{
                                                marginTop: "5px",
                                                padding: "10px",
                                                borderRadius: "10px"
                                            }}>
                                                <Menu.Item
                                                    align="right"
                                                    style={{
                                                        borderRadius: "10px"
                                                    }}>
                                                    <a target="_blank" rel="noopener noreferrer" onClick={event => this.handleHistory()}>
                                                        Order History
                                                    </a>
                                                </Menu.Item>
                                                <Menu.Item
                                                    align="right"
                                                    style={{
                                                        borderRadius: "10px"
                                                    }}>
                                                    <a target="_blank" rel="noopener noreferrer" href="http://192.168.68.120:3000/profile">
                                                        Profile
                                            </a>
                                                </Menu.Item>
                                                <Menu.Item
                                                    align="right"
                                                    style={{
                                                        borderRadius: "10px"
                                                    }}>
                                                    <a target="_blank" rel="noopener noreferrer" onClick={event => this.handleLogout()}>
                                                        Logout
                                            </a>
                                                </Menu.Item>
                                            </Menu>
                                        )


                                } placement="bottomRight">
                                <Avatar shape="circle" src={this.state.currentUser.ava_url} style={{ marginLeft: "30px", marginBottom: "0px", width: "41px", height: "41px" }} />
                            </Dropdown>
                        </Col>

                    ) : (
                            <Col span={6} align="right">
                                <Button type="dashed" ghost style={{ marginRight: "1vw" }} onClick={event => {
                                    this.handleRegister()
                                }}>Register</Button>
                                <Button type="dashed" ghost onClick={event => {
                                    this.handleLogin()
                                }}>Login</Button>
                            </Col>
                        )}

                </Row>
            </Header>
        )
    }
}

export default NavBar;