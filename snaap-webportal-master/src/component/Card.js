import React, { Component } from 'react'

class Card extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cardName: this.props.cardName,
      cardNumber: this.props.cardNumber,
      cardExpiry: this.props.cardExpiry,
      cardCvv: this.props.cardCvv
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
    this.props.handleChange({ target: { name: name, value: value } })
  }

  componentDidMount () {
    console.log('Card', this.props.currentStep)
    if (this.props.currentStep === 2) {
      this.disableNextBtn()
    }
  }

  disableNextBtn () {
    this.props.handleNxtBtn(true)
  }

  render () {
    if (this.props.currentStep !== 2) {
      return null
    } else {
      return (
        <div class='page-wraper account-body accountbg '>
          <div>
            <h3 className='heading'>Payment Information</h3>
            <div class='card-body'>
              <form className='form-horizontal auth-form'>
                <div class='form-group'>
                  <label for='cardName'>Name On Card</label>
                  <div class='input-group mb-3'>
                    <input type='text' class='form-control' name='cardName' value={this.state.cardName} onChange={(e) => this.handleChange(e)} id='cardName' placeholder='Name On Card' />
                  </div>
                </div>
                <div class='form-group'>
                  <label for='card_number'>Card Number</label>
                  <div class='input-group mb-3'>
                    <input type='text' class='form-control' value={this.state.cardNumber} onChange={(e) => this.handleChange(e)} name='cardNumber' id='cardNumber' placeholder='XXXX-XXXX-XXXX-XXXX' />
                  </div>
                </div>
                <div class='form-group'>
                  <label for='expiry_date'>Expiration Date</label>
                  <div class='input-group mb-3'>
                    <input type='text' class='form-control' value={this.state.cardExpiry} onChange={(e) => this.handleChange(e)} name='cardExpiry' id='cardExpiry' placeholder='05/2024' />
                  </div>
                </div>
                <div class='form-group'>
                  <label for='cvv'>CVV</label>
                  <div class='input-group mb-3'>
                    <input type='text' class='form-control' value={this.state.cardCvv} onChange={(e) => this.handleChange(e)} name='cardCvv' id='cardCvv' placeholder='CVV' />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Card
