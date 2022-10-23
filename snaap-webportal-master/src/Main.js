import axios from 'axios'
import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Login from '../src/pages/login/Login'
import Register from '../src/pages/register/Register'
import Welcome from '../src/pages/welcome/Welcome'
import Thankyou from '../src/pages/Thankyou'

class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    // Do something before request is sent
    axios.interceptors.request.use(function (config) {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.token = token
      }
      return config
    })

    // Do something with response data
    // axios.interceptors.response.use(
    //     function (res) {
    //         if (res.data.error) {
    //             if (res.data.error && res.data.status === 401) {
    //                 openNotification('danger', 'Error', res.data.msg);
    //                 setTimeout(() => window.location.href = '/', 1000);
    //                 return;
    //             } else {
    //                 return res;
    //             }
    //         } else {
    //             return res;
    //         }
    //     },
    //     function (error) {
    //         // Do something with response error
    //         console.error(error);
    //         return Promise.reject(error);
    //     }
    // );
  }

  render () {
    return (
      <main>
        <Router>
          <Routes>
            <Route path='/' element={<Login {...this.props} />} />
            <Route path='/register' element={<Register {...this.props} />} />
            <Route path='/membership-profile' element={<Welcome {...this.props} />} />
            <Route path='/membership-completed' element={<Thankyou {...this.props} />} />
          </Routes>
        </Router>
      </main>
    )
  }
};

export default Main
