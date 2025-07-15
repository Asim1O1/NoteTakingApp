import { NotebookPen } from "lucide-react";

import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-600/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="mb-8 animate-bounce">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full shadow-2xl">
                <NotebookPen className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Your Ideas,
              <span className="bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">
                {" "}
                Organized
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Capture, organize, and find your thoughts instantly with the most
              intuitive note-taking app. Your digital brain that never forgets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/login"
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Start Taking Notes Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get <span className="text-gray-400">Organized?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join Us and Increase your productivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
