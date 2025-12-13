
import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar'
import WastraProses from '../components/WastraProses'
import BenefitsSection from '../components/BenefitsSection'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import CustomCursor from '../components/CustomCursor'
import { Toaster } from "react-hot-toast";

const Home = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors min-h-screen">
        <CustomCursor />
        <ScrollToTop />
        <Navbar />
        <Toaster position="top-center" />
        <HeroSection />
        <WastraProses />
        <BenefitsSection />
        <CallToAction />
        <Footer />
    </div>
  )
}

export default Home