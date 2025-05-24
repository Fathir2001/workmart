import React, { useState } from 'react';
import '../styles/FAQ.css';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: 'How to create an account',
      answer: [
        'To create an account, go to the sign up page from here.',
        'After entering your name and phone number, click the signup button.',
        'Enter the six-digit one time password in the SMS received on the phone and press the confirm button.'
      ]
    },
    {
      question: 'How to post a job?',
      answer: [
        'Log in to your Work Mart account.',
        'Navigate to the "Post a Job" section from the dashboard or main menu.',
        'Fill out the job details form including title, description, category, and location.',
        'Set your budget and any specific requirements for the job.',
        'Upload any relevant images or documents that might help service providers understand the job better.',
        'Review your posting details and click "Submit Job" to publish it on the platform.',
        'You will receive notifications when service providers apply for your job.'
      ]
    },
    {
      question: 'How to register as a service provider?',
      answer: [
        'Create a regular user account on Work Mart first if you haven\'t already.',
        'Navigate to the "Become a Service Provider" section from your account dashboard.',
        'Complete the service provider application form, including your skills, experience, and service category.',
        'Upload your profile picture and any certifications or qualifications you may have.',
        'Provide your location and service areas where you\'re willing to work.',
        'Set your availability schedule and hourly/fixed rates for your services.',
        'Submit your application for review. Our team will verify your details within 1-2 business days.',
        'Once approved, your service provider profile will be visible to customers looking for services in your category.'
      ]
    },
    {
      question: 'How to apply for jobs?',
      answer: [
        'Log in to your service provider account.',
        'Browse available jobs through the "Find Jobs" section or from the dashboard.',
        'Use filters to narrow down jobs by category, location, or budget that match your skills.',
        'Click on any job to view its full details and requirements.',
        'If you\'re interested in a job, click the "Apply" button on the job details page.',
        'You may need to write a short proposal explaining why you\'re suitable for the job and your expected timeline.',
        'Submit your application and wait for the job poster to respond.',
        'You\'ll receive a notification when the job poster views or responds to your application.'
      ]
    },
    {
      question: 'How do I respond to a job invitation?',
      answer: [
        'When you receive a job invitation, you\'ll get a notification in your account and via email.',
        'Log in to your service provider account and go to the "Invitations" section.',
        'Review the job details carefully to ensure it matches your skills and availability.',
        'You have three options: "Accept," "Decline," or "Request More Information".',
        'If you accept, you\'ll be connected with the client to discuss further details.',
        'If you need more information, you can send specific questions to the client before making a decision.',
        'If you decline, provide a brief reason to help the client understand your decision.',
        'Always respond to invitations promptly (within 24-48 hours) to maintain a good profile rating.'
      ]
    }
  ];

  return (
    <div>
    <div className="faq-container">
      <h1 className="faq-title">Work Mart- FAQ</h1>
      
      {faqItems.map((item, index) => (
        <div className="faq-section" key={index}>
          <div 
            className="faq-question" 
            onClick={() => toggleFAQ(index)}
          >
            <h2>{item.question}</h2>
            <span className="dropdown-icon">
              {activeIndex === index ? '−' : '+'}
            </span>
          </div>
          
          {activeIndex === index && item.answer.length > 0 && (
            <ol className="faq-answer">
              {item.answer.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  <Contact/>
  <Footer/>
    </div>
  );
};

export default FAQ;