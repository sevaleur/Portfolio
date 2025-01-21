import gsap from 'gsap'

import Page from 'classes/Page'

export default class About extends Page
{
    constructor()
    {
      super({
        id: 'about',
        element: '.about',
        elements: {
          portrait: '.about__media__figure__image'
        }
      })
    }

    create()
    {
      super.create()

      this.onShow = gsap.fromTo(
        this.elements.portrait, 
        {
          opacity: 0
        }, 
        {
          opacity: 1.0,  
          ease: 'power2.inOut',
          paused: true
        }
      )
    }

    show()
    {
      super.show()

      this.onShow.play()
    }

    hide()
    {
      super.hide()

      this.onShow.reverse()
    }
}
