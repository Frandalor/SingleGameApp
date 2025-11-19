import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import HeroBar from '../components/HeroBar';

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-myPrimary">
      <HeroBar />
      <Navbar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="mt-[500px]">
        <Footer />
      </footer>
    </div>
  );
}

export default MainLayout;
