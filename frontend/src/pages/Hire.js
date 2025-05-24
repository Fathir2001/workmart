import React from 'react'
import "../styles/Hire.css";
import ViewWorkers from '../components/ViewWorkers'
import Category from '../components/Category'
import JobList from '../components/JobList'
import Bottom from '../components/Bottom'
import Footer from '../components/Footer'

const Hire = () => {
  return (
    <div className="hire-page-container">
      <div className="hire-page-header">
        <h1>Hire Skilled Professionals</h1>
        <p>Find the perfect service provider for your needs. Browse through our categories or search for specific skills.</p>
      </div>
      
      <div className="hire-page-main">
        <h2 className="hire-section-title">Service Providers</h2>
        <ViewWorkers />
        
        <h2 className="hire-section-title">Available Jobs</h2>
        <JobList />
        
        <Category />
      </div>
      
      <div className="hire-bottom-section">
        <Bottom />
        <Footer />
      </div>
    </div>
  )
}

export default Hire;