import React from 'react'
import "../styles/Hire.css";
import ViewWorkers from '../components/ViewWorkers'
import Category from '../components/Category'
import Bottom from '../components/Bottom'
import Footer from '../components/Footer'

const Hire = () => {
  return (
    <div className="hire-container">
      <div className="hire-header">
        <h1>Hire Skilled Professionals</h1>
        <p>Find the perfect service provider for your needs. Browse through our categories or search for specific skills.</p>
      </div>
      
      <div className="hire-main">
        <ViewWorkers />
        <Category />
      </div>
      
      <div className="bottom-section">
        <Bottom />
        <Footer />
      </div>
    </div>
  )
}

export default Hire;