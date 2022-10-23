
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import React, { Component } from 'react';
import { CreateUser } from './services';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstname: null,
            lastname: null,
            userame: null,
            email: null,
            password: null,
            confirm_password: null
        };
    }

    onChange = (key, value) => {
        this.setState({
            [key]: value
        });
    }

    register = async () => {
        const { firstname, lastname, email, password, confirm_password } = this.state;
        if (password != confirm_password && password == null && password == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please provide a valid password and confirm password',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            var createUser = await CreateUser({ 
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            })

            var response = createUser.data
            if(response.error == false) {
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome',
                    text: 'Your account has been created successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
                localStorage.setItem('isLogin', "true");
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('user_type', 'accessToken');
                window.location.href = '/membership-profile';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'OOPS',
                    text: response.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }
    render () {
        return (
            <div className="App">
                <div class="page-wraper account-body accountbg ">
                    <div class="container">
                        <div class="row vh-100 d-flex justify-content-center">
                            <div class="col-12 align-self-center">
                                <div class="row">
                                    <div class="col-lg-5 mx-auto">
                                        <div class="card">
                                            <div class="card-body p-0 auth-header-box">
                                            <h3   aria-label={"Register"} aria-required="true">Register</h3>
                                                {/* <div class="text-center">
                                                    <a href="index.html" class="logo logo-admin">
                                                    <img src={require('../../../src/assets/mainlogo.png')} height="50" alt="logo" class="auth-logo" /></a>
                                                </div> */}
                                            </div>
                                            <div class="card-body">
                                            <form class="form-horizontal auth-form my-4" action="index.html">
                                            <div class="form-group">
                                                <label for="firstname" className="required">Firstname</label>
                                                <div class="input-group mb-3">
                                                    <input type="text" class="form-control" name="firstname" id="firstname" placeholder="Enter firstname" autoComplete='off'  onChange={(e) => this.onChange("firstname", e.target.value)} required/>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="lastname" className="required">Lastname</label>
                                                <div class="input-group mb-3">
                                                    <input type="text" class="form-control" name="lastname" id="lastname" placeholder="Enter lastname"  autoComplete='off' onChange={(e) => this.onChange("lastname", e.target.value)} required/>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="email" className="required">Email</label>
                                                <div class="input-group mb-3">
                                                    <input type="email" class="form-control" name="email" id="email" placeholder="Enter Email"  autoComplete='off' onChange={(e) => this.onChange("email", e.target.value)} required/>
                                                </div>
                                            </div>
                                            
                                            <div class="form-group">
                                                <label for="userpassword" className="required">Password</label>
                                                <div class="input-group mb-3">
                                                    <input type="password" class="form-control" name="password" id="password" placeholder="Enter password"  autoComplete='off' onChange={(e) => this.onChange("password", e.target.value)} required/>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="userpassword" className="required">Confirm Password</label>
                                                <div class="input-group mb-3">
                                                    <input type="password" class="form-control" name="confirm_password" id="confirm_password" placeholder="Enter Confirm Password" autoComplete='off' onChange={(e) => this.onChange("confirm_password", e.target.value)} required/>
                                                </div>
                                            </div>
                                            <div class="form-group mb-0 row">
                                                <div class="col-md-12">
                                                    <button class="btn btn-primary loginbtn btn-block waves-effect waves-light" type="button" onClick={(e) => this.register()}>Register <i class="fa fa-sign-in" aria-hidden="true"></i> </button>
                                                </div>
                                            </div>
                                            </form>
                                                <div class="m-3 text-center text-muted">
                                                <p class="forget">I have an account ? <a href="/" class="text-primary ml-2">Login</a></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
