import React from 'react';
import { useNavigate } from 'react-router-dom';

import Payment from '../components/Payment';
import Category from '../components/Category';
import Bottom from '../components/Bottom';
import Footer from '../components/Footer';

const Work = () => {
  const navigate = useNavigate();

  const navigateToPostJob = () => {
    navigate('/postjob');
  };

  return (
    <div>
     
      <Payment navigateToPostJob={navigateToPostJob} />
      <Category />
      <Bottom />
      <Footer />
    </div>
  );
};

export default Work;