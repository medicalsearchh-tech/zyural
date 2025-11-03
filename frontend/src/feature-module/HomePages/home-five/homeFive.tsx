import { useEffect } from 'react'
import Banner from './section/banner'
// import Onlinecourses from './section/online-courses';
import Masterskill from './section/master-skill';
import Favourite from './section/fvourite';
import Courses from './section/courses';
import Callaction from './section/call-action';
import Acheivegoal from './section/acheive-goal';
import Accelerate from './section/accelerate';
// import Trendingcourse from './section/trending-course';
import Gallery from './section/gallery';
import Instructor from './section/instructor';
import Leadingcompany from './section/leading-company';
import Testimonials from './section/testimonials';
import Footer from './footer';
import Latestblog from './section/latest-blog';

const HomeFive = () => {
  useEffect(() => {
    const root = document.getElementsByTagName("body")[0];
    root.classList.add("home-five");
    return () => {
      root.classList.remove("home-five");
    };
  }, []);
  return (
    <>
      <Banner />
      {/* <Onlinecourses /> */}
      <Masterskill />
      <Favourite />
      <Courses />
      <Callaction />
      <Acheivegoal />
      <Accelerate />
      {/* <Trendingcourse /> */}
      <Gallery />
      <Instructor />
      <Leadingcompany />
      <Testimonials />
      <Latestblog />
      <Footer />
    </>
  )
}

export default HomeFive
