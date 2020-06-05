import React from "react";
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Row, Col, Menu, Layout, Button, Input, Badge, Dropdown, Avatar } from "antd";
import '../styles/NavBar.css';
import { withRouter } from "react-router-dom";

class NotFound extends React.Component {
    render() {
        return (
            <div>
                404 NOT FOUND
            </div>
        )
    }
}

export default NotFound;