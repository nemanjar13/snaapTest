import React, { Component } from 'react'
import '../../App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { NormalLogin, SocialLogin } from './services'
import Swal from 'sweetalert2'
class Login extends Component{

   constructor(props) {
      super(props);
      this.state = {
          email: null,
          password: null,
      };
  }

   responseFacebook = async (params) => {
      if (params.accessToken) {
         var socialLogin = await SocialLogin({ accessToken: params.accessToken, type: 'facebook' })
        if(socialLogin.data.error) {
         Swal.fire({
            icon: 'error',
            title: 'OOPS',
            text: socialLogin.data.msg,
            showConfirmButton: false,
            timer: 1500
         })
        } else {
         Swal.fire({
            icon: 'success',
            title: 'Welcome ' + params.first_name + ' ' + params.last_name,
            text: 'Your account has been created successfully',
            showConfirmButton: false,
            timer: 1500
         }).then(() => {
            localStorage.setItem('isLogin', "true");
            localStorage.setItem('token', socialLogin.data.data.accessToken);
            localStorage.setItem('user_type', 'accessToken');
            window.location.href = '/membership-profile';
         })
        }
      }
   }

   responseGoogle = async (params) => {
      if (params.accessToken) {
         var socialLogin = await SocialLogin({ accessToken: params.accessToken, type: 'google' })
        if(socialLogin.data.error) {
         Swal.fire({
            icon: 'error',
            title: 'OOPS',
            text: socialLogin.data.msg,
            showConfirmButton: false,
            timer: 1500
         })
        } else {
         Swal.fire({
            icon: 'success',
            title: `Welcome ${params.profileObj.givenName} ${params.profileObj.familyName}`,
            text: 'Your account has been created successfully',
            showConfirmButton: false,
            timer: 1500
         }).then(() => {
            localStorage.setItem('isLogin', "true");
            localStorage.setItem('token', socialLogin.data.data.accessToken);
            localStorage.setItem('user_type', 'accessToken');
            window.location.href = '/membership-profile'; 
         })
        }
      }
   }

   onChange = (key, value) => {
      this.setState({
          [key]: value
      });
  }

   normalLogin = async () => {
      const { email, password } = this.state
      const auth = await NormalLogin({ email: email, password: password })
      if(auth.data.error) {
         Swal.fire({
            icon: 'error',
            title: 'OOPS',
            text: auth.data.msg,
            showConfirmButton: false,
            timer: 1500
        })
      } else {
         Swal.fire({
            icon: 'success',
            title: 'Success',
            text: "You are now logged into the system",
            showConfirmButton: false,
            timer: 1500
         }).then((result) => {
            localStorage.setItem('isLogin', "true");
            localStorage.setItem('token', auth.data.data.accessToken);
            localStorage.setItem('user_type', 'accessToken');
            window.location.href = '/membership-profile';
         })
      }
   }

    render () {
      return(
         <div class="page-wraper account-body accountbg">
            <div class="container">
               <div class="row vh-100 d-flex justify-content-center">
                  <div class="col-12 align-self-center">
                     <div class="row">
                        <div class="col-lg-5 mx-auto">
                           <div class="card">
                              <div class="card-body p-0 auth-header-box">
                                  <div class="text-center">
                                    <a href="index.html" class="logo logo-admin">
                                       <img src={require('../../../src/assets/mainlogo.png')}  height="50" alt="logo" class="auth-logo" />
                                    </a>
                                  </div>
                               </div>
                               <div class="card-body">
                                 <form class="form-horizontal auth-form my-4" action="index.html">
                                    <div class="form-group">
                                       <label for="email">Email</label>
                                       <div class="input-group mb-3"><input type="email" class="form-control" name="email" id="email" placeholder="Enter email" autoComplete='off'  onChange={(e) => this.onChange("email", e.target.value)} required/></div>
                                    </div>
                                    <div class="form-group">
                                       <label for="userpassword">Password</label>
                                       <div class="input-group mb-3"><input type="password" class="form-control" name="password" id="password" placeholder="Enter password"autoComplete='off'  onChange={(e) => this.onChange("password", e.target.value)} required /></div>
                                    </div>
                                    <div class="form-group row mt-4 mb-4">
                                       <div class="col-sm-6">
                                           <a href="auth-recover-pw.html" class="text-muted forget font-13"><i class="dripicons-lock"></i> Forgot password?</a>
                                        </div>
                                    </div>
                                    <div class="form-group mb-0 row">
                                       <div class="col-md-12">
                                          <button class="btn btn-primary loginbtn btn-block waves-effect waves-light" type="button" onClick={(e) => this.normalLogin()}>
                                             Log In <i class="fa fa-sign-in" aria-hidden="true"></i> 
                                          </button></div>
                                    </div>
                                 </form>
                                 <div class="m-3 text-center text-muted">
                                    <p class="forget">Don't have an account ? <a href="/register" class="text-primary ml-2">Register Here</a></p>
                                 </div>
                                 <div class="account-social">
                                    <h6 class="my-4">Or Login With</h6>
                                  </div>
                                 <div class="btn-group btn-block">
                                    <FacebookLogin
                                       appId="452716656645908"
                                       fields="first_name,last_name,email"
                                       callback={this.responseFacebook}
                                       render={renderProps => (
                                          <button onClick={renderProps.onClick} type="button" class="btn btn-sm btn-outline-secondary"><i class="fa-brands fa-facebook-f"></i></button>
                                       )}
                                    /> 
                                    <GoogleLogin
                                       clientId={"19222979667-0br0pgoec0k3u9vrrg5bjggco3gd2m0v.apps.googleusercontent.com"}
                                       render={renderProps => (
                                          <button onClick={renderProps.onClick} disabled={renderProps.disabled} type="button" class="btn btn-sm btn-outline-secondary m-l5"><i class="fa-brands fa-google"></i></button>
                                       )}
                                       buttonText="Login"
                                       onSuccess={this.responseGoogle}
                                       onFailure={this.responseGoogle}
                                       cookiePolicy={'single_host_origin'}
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )
    }
}
export default Login