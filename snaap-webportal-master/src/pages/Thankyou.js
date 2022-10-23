import React, { Component } from 'react'
class Thankyou extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.handleVideoEnd = this.handleVideoEnd.bind(this)
  }

  handleVideoEnd () {
    console.log('Finished')
  }

  sessionReset() {
    localStorage.clear()
    window.location.href='/'
  }

  render () {
    return (
      <div className='App'>
        <div class='page-wraper account-body accountbg '>
          <div class='container'>
            <div class='row vh-100 d-flex justify-content-center'>
              <div class='col-md-12'>
                <div className='centeralign'>
                  <div class='title-tpl1 default'>
                    <h4 class='top_title_all text-center'>Membership profile <br/> completed</h4>
                    <h3 class='stabapp-title text-center title-top-center'> You can start your ride by downloading the app from store</h3>
                    <div>
                      <img src={require('../assets/android.png')} />
                    </div>
                    <div>
                      <img src={require('../assets/image')} />
                    </div>
                    <div>
                      <button onClick={this.sessionReset} className='btn btn-primary loginbtn btn-block waves-effect waves-light logout-btn' type='button'>Logout</button>
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

// const Video = props => {
//   if (props.currentStep !== 3) {
//     return null
//   }
//   this.handleVideoEnd = this.handleVideoEnd.bind(this)

// return (
//   <div class='page-wraper account-body accountbg'>
//     <h3>Safety  Video</h3>
//     <div className='card-body"'>
//       <div class='profileVideo'>
//         <video onEnded={this.handleVideoEnd} controls autoPlay width='100%' height='100%'>
//           <source type='video/mp4' src='https://endtest-videos.s3-us-west-2.amazonaws.com/documentation/endtest_data_driven_testing_csv.mp4' />
//         </video>
//       </div>
//     </div>
//   </div>
// )
// }

export default Thankyou
