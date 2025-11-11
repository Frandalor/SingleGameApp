import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import HeroBar from '../components/HeroBar';

function MainLayout() {
  return (
    
    <div className='flex flex-col min-h-screen bg-myPrimary' >
      <HeroBar/>
      <Navbar />
      <main className='flex-1 px-4 sm:px-6 lg:px-8 py-6 '>
        <Outlet />
      </main>
      <footer className='mt-[500px]'>
      <Footer/>
      </footer>
    </div>
  );
}

export default MainLayout;
