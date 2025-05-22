import React from 'react'
import ProfileView from '../components/ProfileView';
import Comments from '../components/Comments';
import Footer from '../components/Footer';

const Profile =()=> {
  return (
    <div>
      <ProfileView/>
      <Comments/>
      <Footer/>
    </div>
  )
}

export default Profile;