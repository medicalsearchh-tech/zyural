import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import AboutSection from './section/aboutSection'
import Benefits from './section/benefits'
// import Institution from './section/institution'
// import Counter from './section/counter'
// import Testimonials from './section/testimonials'
import Faq from './section/faq'

const AboutUs = () => {
  return (
    <>
         <Breadcrumb title="About Us" />
         <AboutSection />
         <Benefits />
         {/* <Institution /> */}
         {/* <Counter /> */}
         {/* <Testimonials /> */}
         <Faq />
    </>
  )
}

export default AboutUs