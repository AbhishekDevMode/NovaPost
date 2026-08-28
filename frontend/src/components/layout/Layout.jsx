import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <div className="flex-grow w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
