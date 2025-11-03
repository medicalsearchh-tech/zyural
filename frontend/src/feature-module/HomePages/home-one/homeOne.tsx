import BannerSection from './section/banner'
import Benefits from './section/benefits'
import Institutions from './section/institutions'
import Topcourses from './section/top-courses'
import Trust from './section/trust'
import Featuredcourse from './section/featured-course'
import Community from './section/community'
import Clinet from './section/clinet'
import Howitworks from './section/how-it-works'
import Featureinstructor from './section/feature-instructor'
import Faq from './section/faq'
import Latestblog from './section/latest-blog'
import Testimonials from './section/testimonials'
import Footer from './footer'

const HomeOne = () => {
  return (
    <div>
      <BannerSection />
      <Benefits />
      <Institutions />
      <Topcourses />
      <Trust/>
      <Featuredcourse />
      <Community />
      <Clinet />
      <Howitworks />
      <Featureinstructor />
      <Testimonials />
      <Faq/>
      <Latestblog />
      <Footer/>
    </div>
  )
}

export default HomeOne
