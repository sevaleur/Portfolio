import gsap from 'gsap'

import Page from 'classes/Page'

export default class Home extends Page
{
    constructor()
    {
      super({
        id: 'home',
        element: '.home',
        elements: {
          occupation: '.home__occupation ', 
          slogan: '.home__slogan'
        }
      })
    }

    create()
    {
      super.create()

      this.onFadeIn = gsap.fromTo(
        [
          this.elements.occupation, 
          this.elements.slogan
        ], 
        {
          opacity: 0.0
        }, 
        {
          opacity: 1.0, 
          duration: 0.8, 
          ease: 'power2.inOut', 
          delay: 0.5,
          paused: true
        }
      )
    }

    show()
    {
      super.show()

      this.onFadeIn.play()
    }

    hide()
    {
      super.hide()

      this.onFadeIn.reverse()
    }
}
