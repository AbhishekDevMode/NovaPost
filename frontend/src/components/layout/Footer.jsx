const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 text-transparent bg-clip-text">
              BlogSpace
            </span>
            <p className="text-sm text-gray-500 mt-1">
              A modern platform for brilliant minds to share their stories.
            </p>
          </div>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BlogSpace. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
