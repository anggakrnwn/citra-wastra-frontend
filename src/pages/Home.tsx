
import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar'
import WastraProses from '../components/WastraProses'
import BenefitsSection from '../components/BenefitsSection'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

const Home = () => {
  return (
    <div>
        <ScrollToTop />
        <Navbar />
        <HeroSection />
        <WastraProses />
        <BenefitsSection />
        <CallToAction />
        <Footer />
    </div>
  )
}

export default Home