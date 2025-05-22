import { Link } from "react-router-dom";
import "../styles/Home.css";
import NavBar2 from "../components/Navbar2";
import Introduction from "../components/Introduction";
import Introduction2 from "../components/Introduction2";
import Comments from "../components/Comments";
import Category from "../components/Category";
import ServiceProviders from "../components/ServiceProviders";
import Contact from "../components/Contact";
import Footer from "../components/Footer";


const Home = () => {
  return (
   
    <div className="home-container">
    
      <div>
      
      <Introduction/>
      </div>
      <Introduction2/>
      <Comments/>
      <Category/>
      <ServiceProviders/>
      <div>
      <Contact/>
      </div>
      <Footer/>
    </div>
  
  );
};

export default Home;
