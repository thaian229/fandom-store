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
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: false,
            ava_url: window.sessionStorage.getItem("ava_url"),
            full_name: window.sessionStorage.getItem("full_name")
        },
        itemsInCart: false,
    }

    componentWillMount() {

    }

    componentDidMount() {
        const searchBox = document.querySelector(".ant-layout-header .ant-input");
        searchBox.style.backgroundColor = "#001529";
        searchBox.style.color = "#d9d9d9";
        searchBox.style.borderRadius = "0px";
        console.log(searchBox.style);
        console.log(this.state.currentUser)
        if (this.state.currentUser.id) {
            // fetch cart info
            fetch(`http://localhost:3001/api/users/cart`, {
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
        fetch(`http://localhost:3001/api/users/logout`, {
            credentials: "include",
            method: "GET"
        })
            .then(data => {
                return data.json();
            })
            .then(data => {
                console.log(data.message)
                window.sessionStorage.clear();
                window.localStorage.clear();
                window.location.pathname = '/login'
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

    handleRegister = () => {
        window.location.pathname = "/register"
    }

    handleSearch = (value) => {
        window.location.pathname = `/search/${value}`
    }

    render() {
        return (
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%', paddingLeft: "20px", paddingRight: "2vw" }}>
                <Row align="middle">
                    <Col span={4}>
                        <a className="logo" href="http://localhost:3000" />
                    </Col>
                    <Col span={14}>
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
                            <Badge dot={this.state.itemsInCart} style={{ marginTop: "4px" }}>
                                <Button
                                    onClick={event => {
                                        this.handleCartClick()
                                    }}
                                    ghost={true}
                                    type="link"
                                    icon={
                                        <img src={ShoppingCart} style={{ width: "80%", opacity: 0.9 }} />
                                    }
                                    size={'medium'}
                                />
                            </Badge>
                            <Dropdown
                                style={{ marginLeft: "2vw", position: 'fixed' }}
                                overlay={
                                    <Menu style={{
                                        marginTop: "20px",
                                        padding: "10px",
                                        borderRadius: "10px"
                                    }}>
                                        <Menu.Item style={{
                                            borderRadius: "10px"
                                        }}>
                                            <a target="_blank" rel="noopener noreferrer" href="http://localhost:3000/profile">
                                                Profile
                                    </a>
                                        </Menu.Item>
                                        <Menu.Item style={{
                                            borderRadius: "10px"
                                        }}>
                                            <a target="_blank" rel="noopener noreferrer" onClick={event => this.handleLogout()}>
                                                Logout
                                    </a>
                                        </Menu.Item>
                                    </Menu>
                                } placement="bottomRight">
                                <Avatar shape="square" src={this.state.currentUser.ava_url} style={{ marginLeft: "2vw" }} />
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