import React, { Component } from 'react'
class Video extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    if (this.props.currentStep !== 3) {
      return null
    } else {
      return (
        <div class='page-wraper account-body accountbg'>
          <h3>Member Safety</h3>
          <div className='card-body"'>
            <div class='profileVideo'>
              <p>Please watch our brief safety video - the final step for being a SNAAP member.</p>
              <video onPlay={this.props.handleVideoStart} onEnded={this.props.handleVideoEnd} controls='' autoPlay width='100%' height='100%'>
                <source type='video/mp4' src='https://video-previews.elements.envatousercontent.com/h264-video-previews/04dc39be-74f6-4e61-a608-7c9040c6bb02/15087680.mp4' />
              </video>
              <p>Just like the safety video when you board an airline flight, please sit back, relax, pay attention, and then you’ll be ready to ride SNAAP.</p>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Video
