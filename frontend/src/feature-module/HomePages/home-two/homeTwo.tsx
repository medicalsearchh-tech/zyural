import { useEffect } from 'react'
import Bannersection from './section/bannersection'
import Favorite from './section/favorite'
import Benefits from './section/benefits'
import Whatsnew from './section/whatsnew'
import Countertrending from './section/counter-trending'
import Subscribe from './section/subscribe'
import Masterskill from './section/master-skill'
import Client from './section/client'
import Aboutus from './section/about-us'
import Faq from './section/faq'
import Blogsection from './section/blog-section'

const HomeTwo = () => {

   useEffect(() => {
      const root = document.getElementsByTagName("body")[0];
      root.classList.add("home-two");
      return () => {
        root.classList.remove("home-two");
      };
    }, []);
    
  return (
    <div>
      <Bannersection />
      <Favorite />
      <Benefits />
      <Whatsnew />
      <Countertrending />
      <Subscribe />
      <Masterskill />
      <Client />
      <Aboutus />
      <Faq />
      <Blogsection />
    </div>
  )
}

export default HomeTwo
