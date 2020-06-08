import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Layout, Statistic } from 'antd';
import HomeScreen from './pages/HomeScreen';
import CartScreen from './pages/CartScreen';
import EditItemScreen from './pages/EditItemScreen';
import AddItemScreen from './pages/AddItemScreen';
import ProfileScreen from './pages/ProfileScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProductScreen from './pages/ProductScreen';
import OrderHistoryScreen from './pages/OrderHistoryScreen';
import AllOrderScreen from './pages/AllOrderScreen';
import NavBar from './pages/NavBar';
import Statistics from './pages/Statistics'
import NotFound from './pages/NotFound';    
import './App.css';
import CategoryScreen from './pages/CategoryScreen';
import SearchScreen from './pages/SearchScreen';

const { Header, Content, Footer } = Layout;

class App extends React.Component {

    render() {
        return (
            <div>
                <Layout style={{ backgroundColor: "black" }}>
                    <Router>
                        <Route
                            path='/'
                            component={NavBar}
                        />
                    </Router>
                </Layout>
                <Router>
                    <Route
                        path='/'
                        exact={true}
                        component={HomeScreen}
                    />
                    <Route path='/category/:tag' component={CategoryScreen} />
                    <Route path='/product/:prod_id' component={ProductScreen} />
                    <Route path='/cart' component={CartScreen} />
                    <Route path='/login' component={LoginScreen} />
                    <Route path='/register' component={RegisterScreen} />
                    <Route path='/profile' component={ProfileScreen} />
                    <Route path='/addItem' component={AddItemScreen} />
                    <Route path='/edit/:prod_id' component={EditItemScreen} />
                    <Route path='/history' component={OrderHistoryScreen} />
                    <Route path='/allorders' component={AllOrderScreen} />
                    <Route path='/statistic' component={Statistics} />
                    <Route path='/search/:keyword' component={SearchScreen} />
                    {/* <Route path='/' exact component={NotFound} /> */}
                </Router>
            </div>
        );
    };
}

export default App;