import { useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import {
  getAllCampaigns,
  updateCampaign,
} from './utils/methods';
import { ClientContext } from './context/Context';
import CreateCampaign from './components/CreateCampaign';
import Navbar from './components/Navbar';
import CampaignCard from './components/Card/CampaignCard';
import Register from './components/Register';
import Login from './components/Login';
import Footer from './components/Footer';
import Wallet from './components/Wallet';
import CampaignDetails from './components/CampaignDetails/CampaignDetails';
import { CampaignInterface, Users } from './utils/interfaces';
import { Element } from 'react-scroll';
import { motion } from 'framer-motion';
import { Homepage } from './sections/Homepage';
import { About } from './sections/About';

function App() {
  const client = useContext(ClientContext);
  const [viewAllCampaign, setViewAllCampaign] = useState<boolean>(false);

  const handleGetCampaigns = async () => {
    const data = await getAllCampaigns() as [number, CampaignInterface][];
    data?.forEach(async (element) => {
      await updateCampaign(element[0], Number(element[1].dueDate) - Date.now() * 1000000);
    });
    const allCampaigns = await getAllCampaigns() as [number, CampaignInterface][];
    console.log(allCampaigns);
    client?.setAllCampaigns(allCampaigns);
  }

  useEffect(() => {
    if (localStorage.getItem('auth')) {
      client?.setIsLoggedIn(true);
      const user = JSON.parse(localStorage.getItem('auth') as string) as Users;
      user.balance = parseFloat(user.balance as unknown as string); // Force balance to be a number
      client?.setUser({
        username: user.username,
        password: user.password,
        email: user.email,
        balance: user.balance,
      });
    }
    handleGetCampaigns();
  }, []);
  
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {client?.activePage === "create-campaign" && (<CreateCampaign />)}
      {client?.activePage === "register" && (<Register />)}
      {client?.activePage === "login" && (
        <div className='fixed bg-black bg-opacity-50 backdrop-blur-sm z-10 w-full h-full'>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring' }}
            className='w-full min-h-screen flex flex-col items-center bg-transparent'
          >
            <Login />
          </motion.div>
        </div>
      )}
      {client?.activePage === "wallet" && (<Wallet />)}
      {client?.activePage === 'campaign-details' && client.selectedCampaign && (
        <CampaignDetails
          campaignId={client.selectedCampaignId}
          author={client.selectedCampaign.author}
          title={client.selectedCampaign.title}
          description={client.selectedCampaign.description}
          targetFund={client.selectedCampaign.targetFund}
          currentFund={client.selectedCampaign.currentFund}
          totalParticipant={client.selectedCampaign.totalParticipant}
          dueDate={client.selectedCampaign.dueDate}
        />
      )}
      <Element name='Home'>
        <Homepage />
      </Element>

      <Element name='AboutUs'>
        <About/>
      </Element>

      <Element name='ViewCampaigns' className='relative pt-[100px] items-center flex justify-center'>
        <div className="max-w-[120vh]">
          <div className='flex justify-center items-center text-xl font-bold'>
            EXPLORE CAMPAIGNS
          </div>
          <div className="w-full flex justify-end">
            <button onClick={() => setViewAllCampaign(!viewAllCampaign)} className="mt-3 w-fit">
              {viewAllCampaign ? 'View less' : 'View all'}
            </button>
          </div>

          {viewAllCampaign ? (
            <div className="flex flex-wrap mt-8 mb-10">
              {client?.allCampaigns.map((value) => {
                return (
                  <CampaignCard
                    key={value[0]}
                    campaignId={value[0]}
                    author={value[1].author}
                    title={value[1].title}
                    description={value[1].description}
                    targetFund={value[1].targetFund}
                    currentFund={value[1].currentFund}
                    totalParticipant={value[1].totalParticipant}
                    dueDate={value[1].dueDate.toString()}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex mt-8 mb-10">
              {client?.allCampaigns.slice(0, 4).map((value) => {
                return (
                  <CampaignCard
                    key={value[0]}
                    campaignId={value[0]}
                    author={value[1].author}
                    title={value[1].title}
                    description={value[1].description}
                    targetFund={value[1].targetFund}
                    currentFund={value[1].currentFund}
                    totalParticipant={value[1].totalParticipant}
                    dueDate={value[1].dueDate.toString()}
                  />
                );
              })}
            </div>
          )}
        </div>
      </Element>
        
      <div className="mt-[5vh] w-[60%]">
        <div className="flex flex-col space-y-5">
          <Navbar />
        </div>
        
        <div className='bg-gray-300 rounded-lg p-5 m-5'>
          <div className='flex justify-center items-center text-2xl font-bold mb-5'>
          Get the newest campaigns in your inbox
          </div>
        <div className='flex justify-center items-center mb-2'>
          <input
          className='border border-black rounded-lg p-2 w-[40%] mx-2'
          type='textfield'
          placeholder='Enter your email address'
          />
          <button className='bg-black text-white p-2 rounded-lg'>Sign Up</button>
        </div>
        <div className='flex justify-center items-center mb-5'>
          <h6>By clicking “Sign up” I have read and agree to CrowdLink's Terms of Use and Privacy Policy .</h6>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
