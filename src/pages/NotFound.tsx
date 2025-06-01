import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <section className="page_404 bg-white min-h-screen flex items-center justify-center font-['Arvo']">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 text-center">
            <div className="four_zero_four_bg bg-no-repeat h-[400px] bg-center"
                 style={{
                   backgroundImage: "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)"
                 }}>
              <h1 className="text-center text-[80px]">404</h1>
            </div>

            <div className="contant_box_404 mt-[-50px]">
              <h3 className="text-[80px]">Look like you're lost</h3>
              <p>The page you are looking for is not available!</p>
              <Link 
                to="/" 
                className="link_404 bg-[#39ac31] text-white px-5 py-2.5 inline-block mt-5 rounded-md hover:bg-[#2d8526] transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
