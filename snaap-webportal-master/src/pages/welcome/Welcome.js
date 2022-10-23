import React, { Component } from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from "../../component/Profile";
import Video from "../../component/Video";
import Card from "../../component/Card";
import Terms from "../../component/Terms";
import { UpdateUserProfile } from './services'
import Swal from 'sweetalert2';
import Loader from 'react-loader';

class Welcome extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentStep: null,
      firstname: null,
      lastname: null,
      email: null,
      phone: null,
      safteyVideo: false,
      terms: false,
      disableNext: false,
      disablePrev: false,
      disableSubmit: true,
      loaded: true,
      cardNumber: null,
      cardExpiry: null,
      cardCvv: null,
      safteyVideo: false,
      terms: false,
      auto_pay: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleVideoEnd = this.handleVideoEnd.bind(this);
    this.handleVideoStart = this.handleVideoStart.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNxtBtn = this.handleNxtBtn.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
  }

  componentDidUpdate() {
    // if (previousProps.data !== this.props.data) {
      // const { cardName, cardNumber, cardExpiry, cardCvv } = this.state
      // console.log('Welcome', cardName, cardNumber, cardExpiry, cardCvv)
      // if (cardName?.length > 0 && cardNumber?.length > 15 && cardExpiry?.length > 0 && cardCvv?.length > 0) {
      //   if(this.disableNext != false) {
      //     this.setState({ disableNext: false })
      //   }
      // }
    // }
  }

  static getDerivedStateFromProps(props, state) {
    const { cardName, cardNumber, cardExpiry, cardCvv } = state
    console.log('Welcome', cardName, cardNumber, cardExpiry, cardCvv)
    if (cardName?.length > 0 && cardNumber?.length > 15 && cardExpiry?.length > 0 && cardCvv?.length > 0) {
      if(state.disableNext != false && state.currentStep == 2) {
        return state.disableNext = false
      }
    }
  }

  disableNextBtn () {
    this.handleNxtBtn(true)
  }

  enableNextBtn () {
    this.handleNxtBtn(false)
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name == 'terms' || name== 'auto_pay') {
      this.setState({
        [name]: !this.state[name]
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  handleNxtBtn(state) {
    this.setState({ disableNext: state})
  }

  handleVideoEnd() {
    console.log('handleVideoEnd')
    this.setState({
      disableNext: false,
      safteyVideo: true,
      disablePrev: false
    });
  }

  handleVideoStart() {
    console.log('handleVideoStart')
    this.setState({
      disableNext: true,
      disablePrev: true
    });
  }
  
  handleSubmit(status) {
    this.setState({
      disableSubmit: status
    });
  };

  _next() {
    let currentStep = this.state.currentStep;
    this.setState({ loaded: false })
    if (currentStep == 1) {
      this.userProfileUpdate()
    } else if (currentStep == 2) {
      this.cardDetailsUpdate()
    } else if (currentStep == 3) {
      this.videoStatusUpdate()
    }
    currentStep = currentStep >= 3 ? 4 : currentStep + 1;
    this.setState({ currentStep: currentStep });
  }

  _prev() {
    let currentStep = this.state.currentStep;
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep: currentStep,
      disableNext: false
    });
  }

  get previousButton() {
    let currentStep = this.state.currentStep;
    if (currentStep !== 1) {
      return (
         <div className='' style={{paddingRight: "10px"}} >
          <button color="secondary float-left" className='btn btn-secondary wizard-content previous' disabled={this.state.disablePrev} onClick={this._prev}>
            Previous
          </button>
        </div>
      );
    }
    return null;
  }

  get nextButton() {
    let currentStep = this.state.currentStep;
    if (currentStep < 4) {
      return (
        <div className=''>
           <button className='btn btn-primary wizard-content primary float-right' disabled={this.state.disableNext} onClick={this._next }>
            Next
          </button>
        </div>
      );
    }
    return null;
  }

  get submitButton() {
    let currentStep = this.state.currentStep;
    if (currentStep > 3) {
      return <button className='btn btn-primary wizard-content primary float-right' disabled={this.state.disableSubmit} onClick={this.termsAndConditionUpdate} >
        Submit
        </button>;
    }
    return null;
  }

  userProfileUpdate = () => {
    const { firstname, lastname, phone, email, photo } = this.state
    const data = {
      firstname: firstname,
      lastname: lastname,
      cell: phone,
      email: email,
      photo: photo
    }
    this.saveChanges(data,1)
  }

  cardDetailsUpdate = () => {
    const { cardNumber, cardExpiry, cardCvv } = this.state
    const data = {
      cardnumber: cardNumber,
      expirationdate: cardExpiry,
      cardcvv: cardCvv
    }
    this.saveChanges(data,2)
  }

  videoStatusUpdate = () => {
    const { safteyVideo } = this.state
    const data = {
      safteyVideo: safteyVideo
    }
    this.saveChanges(data,3)
  }

  termsAndConditionUpdate = () => {
    const { terms, auto_pay } = this.state
    const data = {
      terms: terms,
      auto_pay: auto_pay
    }
    this.saveChanges(data,4)
  }

  saveChanges =  async (data,step) => {
    var userProfile = await UpdateUserProfile(data)
    if(userProfile.data.error) {
      Swal.fire({
        icon: 'error',
        title: 'OOPS',
        text: userProfile.data.msg,
        showConfirmButton: false,
        timer: 1500
      })
      this.setState({loaded: true, currentStep: step})
    } else {
      if (step == 4) {
        window.location.href = '/membership-completed';
      }
      this.setState({loaded: true})
      return false
    }
  }

  componentDidMount () {
    this.setState({ currentStep: 1 })
  }

  onChange = (key, value) => {
    this.setState({
        [key]: value
    });
  }

  render () {
    return (
      <div class="page-wraper account-body accountbg wizards">
        <div class="container">
          <div class="row  d-flex justify-content-center">
            <div class="col-12 align-self-center">
              <div class="row shadow">
                <div class="col-lg-6 p-a0">
                  <div class="form-section align-self-center">
                    <div class="login-title">
                      <div class="text-center formlogo">
                        <a href="index.html" class="logo logo-admin">
                          <svg xmlns="http://www.w3.org/2000/svg" width="1102" height="396" viewBox="0 0 1102 396" class="newlogo">
                            <defs>
                              <clipPath id="clip-newlogo">
                                <rect width="1102" height="396"/>
                              </clipPath>
                            </defs>
                            <g id="newlogo" clip-path="url(#clip-newlogo)">
                              <g id="Group_23" data-name="Group 23" transform="translate(34.047)">
                                <g id="Group_22" data-name="Group 22" transform="translate(-209.947 -27.9)">
                                  <circle id="Ellipse_2" data-name="Ellipse 2" cx="178.031" cy="178.031" r="178.031" transform="translate(221.9 49.414)" fill="#01284d"/>
                                  <path id="Path_77" data-name="Path 77" d="M578.38,30.9V136.249l-72.263,29.323L396.706,121.2l-4.419-1.792a8.154,8.154,0,0,1,1.553-13.617l1.075-.418Z" transform="translate(-67.426 0)" fill="#00ccb5"/>
                                  <path id="Path_78" data-name="Path 78" d="M558.16,350.7V455.213a13.437,13.437,0,0,1-4.419,7.167l-7.465,3.046L339.1,549.395V446.076l104.513-42.4h0l106.962-43.418a12.246,12.246,0,0,0,2.449-.955A9.832,9.832,0,0,0,558.16,350.7Z" transform="translate(-47.206 -128.809)" fill="#00ccb5"/>
                                  <path id="Path_79" data-name="Path 79" d="M530.309,277.106a8.094,8.094,0,0,1-2.807,6.151l-4.957,2.031h0L417.614,327.81l-64.739-26.278A22.414,22.414,0,0,1,338.9,280.809V188.3a8.58,8.58,0,0,0,4.479,7.7,7.119,7.119,0,0,0,1.194.478l110.545,44.851,68.561,27.83h0l2.747,1.135A7.873,7.873,0,0,1,530.309,277.106Z" transform="translate(-47.125 -63.398)" fill="#499ef2"/>
                                </g>
                                <text id="SNAAP" transform="translate(405 248)" fill="#00ccb5" font-size="129" font-family="OpenSans-Bold, Open Sans" font-weight="700" letter-spacing="0.35em"><tspan x="0" y="0" class="snap">SNAAP</tspan></text>
                              </g>
                            </g>
                          </svg>
                        </a>
                      </div>
                      <h1>Member Profile</h1>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 p-a0">
                  <div className='card borrad' style={{height:"700px"}}>
                    <Loader loaded={this.state.loaded} lines={10} length={20} width={10} radius={30} corners={1} rotate={0} direction={1} color="#C0C0C0" speed={1} trail={60} shadow={false} hwaccel={false} className="spinner" zIndex={2e9} top="50%" left="50%" scale={1.0} loadedClassName="loadedContent">
                      <div className='card-body p-0 auth-header-box' style={{height:"700px"}}>
                        <ul className='tablist'>
                          <li>
                            <a className=''><span class="step stepactive">1</span></a>
                          </li>
                          <li>
                            <a className=''><span className={ this.state.currentStep >= 2 ? 'step stepactive': 'step' }>2</span></a>
                          </li>
                          <li>
                            <a className=''><span class="step" className={ this.state.currentStep >= 3 ? 'step stepactive': 'step' }>3</span></a>
                          </li>
                          <li>
                            <a className=''><span class="step" className={ this.state.currentStep == 4 ? 'step stepactive': 'step' }>4</span></a>
                          </li>
                        </ul>
                        <Profile currentStep={this.state.currentStep} handleChange={this.handleChange} handleNxtBtn={this.handleNxtBtn}/>
                        <Card currentStep={this.state.currentStep} handleChange={this.handleChange} handleNxtBtn={this.handleNxtBtn} />
                        <Video currentStep={this.state.currentStep} handleVideoEnd={this.handleVideoEnd} handleVideoStart={this.handleVideoStart} />
                        <Terms currentStep={this.state.currentStep} handleChange={this.handleChange} handleSubmit={this.handleSubmit}/>
                        <div valign="bottom" className='btmbtn'> {this.previousButton} {this.nextButton} {this.submitButton}</div>
                      </div>
                    </Loader>
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
export default Welcome
