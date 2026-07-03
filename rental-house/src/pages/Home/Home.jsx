import Navbar from '../../components/Common/Navbar/Navbar';
import Footer from '../../components/Common/Footer/Footer';
import Hero from '../../components/Home/Hero';
import FeaturedListings from '../../components/Home/FeaturedListings';
import HowItWorks from '../../components/Home/HowItWorks';
import OwnerCTA from '../../components/Home/OwnerCTA';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedListings />
        <HowItWorks />
        <OwnerCTA />
      </main>
      <Footer />
    </>
  );
}
