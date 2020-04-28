import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Layout, Icon, Menu, Button, Input, Drawer, message, Row, Col } from 'antd';

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

const { Header, Sider, Content } = Layout;

class App extends React.Component {

  render() {
    return (
      <div>
        <Layout>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Content>
            <Router>
              <Route path='/' component={HomeScreen} exact={true} />
              <Route path='/product' component={ProductScreen} />
              <Route path='/cart' component={CartScreen} />
              <Route path='/login' component={LoginScreen} />
              <Route path='/register' component={RegisterScreen} />
              <Route path='/profile' component={ProfileScreen} />
              <Route path='/addItem' component={AddItemScreen} />
              <Route path='/editItem' component={EditItemScreen} />
              <Route path='/history' component={OrderHistoryScreen} />
            </Router>
          </Content>

        </Layout>
      </div >
    );
  };
}

export default App;