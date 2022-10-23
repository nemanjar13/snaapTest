import React, { Component } from 'react'
class Terms extends Component {
  constructor (props) {
    super(props)
    this.state = {
      terms: this.props.terms,
      auto_pay: this.props.auto_pay,
      counter: 0
    }
  }

  handleChange (event) {
    const { name } = event.target
    const value = !this.state[name]
    let counter = this.state.counter
    this.setState({
      [name]: value
    })
    if (value) {
      counter = counter + 1
      this.setState({ counter: counter })
    } else {
      counter = counter - 1
      this.setState({ counter: counter })
    }
    if (counter == 2) {
      this.props.handleSubmit(false)
    } else {
      this.props.handleSubmit(true)
    }
    this.props.handleChange({ target: { name: name, value: value } })
  }

  render () {
    if (this.props.currentStep !== 4) {
      return null
    } else {
      return (
        <div class='page-wraper account-body accountbg'>
          <h3>Terms and conditions</h3>
          <div className='card-body'>
            <div class='terms'>
              <iframe width={"100%"} height={"350px"} src="https://ridesnaap.com/terms-and-condition.html"></iframe>
            </div>
          </div>
          <div className='card-footer'>
            <div class='form-check checkflex'>
              <input type='checkbox' class='form-check-input' name='terms' id='terms' checked={this.state.terms} onChange={(e) => { this.handleChange(e)}} />
              <label class='form-check-label' for='signed_agreement'>
                Yes, I have read the SNAAP Customer Agreement and accept its terms and conditions. Upon first use of the SNAAP Rider Account, I acknowledge acceptance of the SNAAP terms and conditions.
              </label>
            </div>
            <div class='form-check checkflex'>
              <input type='checkbox' class='form-check-input' name='auto_pay' id='auto_pay' checked={this.state.auto_pay} onChange={(e) => { this.handleChange(e)}} />
              <label class='form-check-label' for='payment_terms'>
                Agree for a charge of $350 which includes $100 non-refundable annual membership fee, $250 security deposit and auto replenishment of $50 as rider fee
              </label>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Terms
