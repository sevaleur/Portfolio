import gsap from 'gsap'

import Page from '../../classes/Page'
import Show from '../../animations/Show'

export default class Project extends Page
{
    constructor()
    {
      super({
        id: 'project',
        element: '.project',
        elements: {
          wrapper: '.project__wrapper', 
          visitLink: '.project__text__left__sub__visit__link',
          visitBorder: '.project__text__left__sub__visit__border'
        }
      })
    }

    create()
    {
      super.create()

      this.scaleBorder = gsap.fromTo(
        this.elements.visitBorder, 
        {
          scaleX: 0, 
        }, 
        {
          scaleX: 1, 
          duration: 0.5, 
          ease: 'power2.inOut', 
          paused: true
        }
      )
    }

    show()
    {
      super.show()
    }

    hide()
    {
      super.hide()
    }

    onMouseOver()
    {
      this.scaleBorder.play()
    }

    onMouseLeave()
    {
      this.scaleBorder.reverse()
    } 

    addEventListeners()
    {
      super.addEventListeners()

      this.elements.visitLink.addEventListener('mouseover', this.onMouseOver.bind(this))
      this.elements.visitLink.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    }

    removeEventListeners()
    {
      super.removeEventListeners()

      this.elements.visitLink.removeEventListener('mouseover', this.onMouseOver)
      this.elements.visitLink.removeEventListener('mouseleave', this.onMouseLeave)
    }
}
