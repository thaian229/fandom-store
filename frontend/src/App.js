import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';

import HomeScreen from './pages/HomeScreen';
import CartScreen from './pages/CartScreen';
import EditItemScreen from './pages/EditItemScreen';
import AddItemScreen from './pages/AddItemScreen';
import ProfileScreen from './pages/ProfileScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProductScreen from './pages/ProductScreen';
import OrderHistoryScreen from './pages/OrderHistoryScreen';

import './App.css';

const { Header } = Layout;

class App extends React.Component {
    render() {
        return (
            <div>
                <Layout style={{ marginBottom: `65px` }}>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                        <div className="logo" />
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">nav 1</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3">nav 3</Menu.Item>
                        </Menu>
                    </Header>
                </Layout>
                <Router>
                    <Route path='/' exact={true} component={HomeScreen} />
                    <Route path='/product/:prod_id' component={ProductScreen} />
                    <Route path='/cart' component={CartScreen} />
                    <Route path='/login' component={LoginScreen} />
                    <Route path='/register' component={RegisterScreen} />
                    <Route path='/profile' component={ProfileScreen} />
                    <Route path='/addItem' component={AddItemScreen} />
                    <Route path='/editItem/:prod_id' component={EditItemScreen} />
                    <Route path='/history' component={OrderHistoryScreen} />
                </Router>
            </div >
        );
    };
}

export default App;