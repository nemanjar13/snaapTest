import React, { Component } from 'react'
import { FileUpload, GetUserProfile, UpdateUserProfile } from './services'
import Swal from 'sweetalert2'
import '../../src/App.css'
class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      firstname: null,
      lastname: null,
      email: null,
      phone: null,
      photo: "https://www.seekpng.com/png/detail/966-9665317_placeholder-image-person-jpg.png",
      emailReadOnly: false,
      fileUploadCheck: false,
      is_profile_updated: 0
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getUserProfile()
  }

  enableNextBtn () {
    this.props.handleNxtBtn(true)
  }

  disableNextBtn () {
    this.props.handleNxtBtn(false)
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    this.props.handleChange({ target: { name: name, value: value }})
  }

  onFileChange = async (type, e) => {
    this.setState({ fileUploadCheck: true })
    var converb64 = await this.toBase64(e.target.files[0])
    var b64 = (converb64).split(",")
    var data = {
      file:  b64[1],
      type: e.target.files[0].type
    }
    var profilePhoto = await FileUpload(data)
    if(profilePhoto.data.error) {
      Swal.fire({
        icon: 'error',
        title: 'OOPS',
        text: profilePhoto.data.msg,
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      this.setState({ [type]: profilePhoto.data.data.url, fileUploadCheck: false })
      this.props.handleChange({ target: { name: type, value: profilePhoto.data.data.url } })
    }
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  getUserProfile = async () => {
    var profile = await GetUserProfile()
    if(profile.data.error) {
       Swal.fire({
          icon: 'error',
          title: 'OOPS',
          text: profile.data.msg,
          showConfirmButton: false,
          timer: 1500
      })
      window.location.href = '/membership-profile';
    } else {
       const { firstname, lastname, cell, email, photo, type, is_profile_updated, watched_safety_video, signed_agreement } = profile.data.data
       if (is_profile_updated== 1 && watched_safety_video == 1 && signed_agreement == 1) {
        window.location.href = '/membership-completed';
       } else {
        this.setState({
          firstname: firstname,
          lastname: lastname,
          phone: cell,
          email: email,
          photo: photo == "" || photo == null ? this.state.photo : photo
        })
        this.props.handleChange({ target: { name: "firstname", value: firstname } })
        this.props.handleChange({ target: { name: "lastname", value: lastname } })
        this.props.handleChange({ target: { name: "phone", value: cell } })
        this.props.handleChange({ target: { name: "email", value: email } })
        this.props.handleChange({ target: { name: "photo", value: photo } })
        if (type != 'manual') {
          this.setState({ emailReadOnly: true })
        }
      }
    }
 }

 updateUserProfile = async () => {
  const { firstname, lastname, phone, email, photo, audio } = this.state
  var data = {
    firstname: firstname,
    lastname: lastname,
    phone: phone,
    email: email,
    photo: photo,
    audio: audio
  }
  var userProfile = await UpdateUserProfile(data)
  if(userProfile.data.error) {
    Swal.fire({
      icon: 'error',
      title: 'OOPS',
      text: userProfile.data.msg,
      showConfirmButton: false,
      timer: 1500
    })
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Profile Update',
      text: 'Your profile has been updated successfully',
      showConfirmButton: false,
      timer: 1500
    })
  }
 }
 onChange = (key, value) => {
  this.setState({
      [key]: value
  });
}
  render () {
    if (this.props.currentStep !== 1) {
      return null
    } else {
      return (
        <div className='page-wraper account-body accountbg'>
          <div>
            <h3 className='heading'>Profile</h3>
            <div className='text-center'>
              <div className='profile'>
                <img src={this.state.photo} height='50' alt='logo' className='auth-logo' />
                <div className='image-upload'>
                  <label for='file-input'>
                    <i className='fa fa-camera' aria-hidden='true' />
                  </label>
                  <input id='file-input' type='file' accept='image/png,image/jpeg,image/jpg' onChange={(e) => this.onFileChange('photo', e)}></input>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <form className='form-horizontal auth-form'>
                <div className='form-group'>
                  <label for='firstname' className='required'>Firstname</label>
                  <div className='input-group mb-3'>
                    <input type='text' className='form-control' value={this.state.firstname} name='firstname' id='firstname' onChange={(e) => this.handleChange(e)} placeholder='Enter firstname' />
                  </div>
                </div>
                <div className='form-group'>
                  <label for='lastname' className='required'>Lastname</label>
                  <div className='input-group mb-3'>
                    <input type='text' className='form-control' value={this.state.lastname} name='lastname' id='lastname' onChange={(e) => this.handleChange(e)} placeholder='Enter lastname' />
                  </div>
                </div>
                <div className='form-group'>
                  <label for='email' className='required'>Email</label>
                  <div className='input-group mb-3'>
                    <input type='text' className='form-control' value={this.state.email} name='email' id='email' onChange={(e) => this.handleChange(e)} placeholder='Enter email' disabled={this.state.emailReadOnly} />
                  </div>
                </div>
                <div className='form-group'>
                  <label for='phone' className='required'>Phone Number</label>
                  <div className='input-group mb-3'>
                    <input type="tel" className='form-control' value={this.state.phone} name='phone' id='phone' onChange={(e) => this.handleChange(e)} placeholder="XXX-XXX-XXXX" autoComplete='off'/>
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

export default Profile;
