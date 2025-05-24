import React, { useState } from 'react'
import "../styles/Hire.css";
import ViewWorkers from '../components/ViewWorkers'
import Category from '../components/Category'
import JobList from '../components/JobList'
import Bottom from '../components/Bottom'
import Footer from '../components/Footer'

const Hire = () => {
  const [activeTab, setActiveTab] = useState('providers'); // 'providers' or 'jobs'

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="hire-page-container">
      {/* <div className="hire-page-header">
        <h1>Hire Skilled Professionals</h1>
        <p>Find the perfect service provider for your needs or browse available jobs.</p>
      </div> */}
      
      <div className="hire-page-main">
        <div className="hire-tabs">
          <button 
            className={`hire-tab ${activeTab === 'providers' ? 'active' : ''}`}
            onClick={() => handleTabChange('providers')}
          >
            Service Providers
          </button>
          <button 
            className={`hire-tab ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => handleTabChange('jobs')}
          >
            Available Jobs
          </button>
        </div>
        
        {activeTab === 'providers' ? (
          <>
            <ViewWorkers />
          </>
        ) : (
          <>
            <JobList />
          </>
        )}
        
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