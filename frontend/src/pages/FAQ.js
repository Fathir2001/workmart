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
      answer: []
    },
    {
      question: 'How to register as a service provider?',
      answer: []
    },
    {
      question: 'How to apply for jobs?',
      answer: []
    },
    {
      question: 'How do I respond to a job invitation?',
      answer: []
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