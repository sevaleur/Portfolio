import gsap from 'gsap'

import Page from 'classes/Page'

export default class Project extends Page
{
    constructor()
    {
      super({
        id: 'project',
        element: '.project',
        elements: {
          wrapper: '.project__wrapper', 
          linkDivs: '.link__div',
          linkBorders: '.link__border', 
          externalIcon: '.externalLinkIcon'
        }
      })
    }

    create()
    {
      super.create()

      this.project={
        anims: {
          linkBorders: {}, 
          linkIcons: {}
        }
      }

      if(window.innerWidth > 768)
      {
        this.elements.linkBorders.forEach((el,idx) => {
          this.project.anims.linkBorders[idx] = gsap.fromTo(
            el, 
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

          this.project.anims.linkIcons[idx] = gsap.fromTo(
            this.elements.externalIcon[idx], 
            {
              scale: 0,
              yPercent: 0
            }, 
            {
              scale: 1, 
              yPercent: -50,
              duration: 0.5, 
              ease: 'expo.inOut', 
              paused: true
            }
          )
        })
      }
    }

    show()
    {
      super.show()
    }

    hide()
    {
      super.hide()
    }

    onMouseOver(idx)
    {
      this.project.anims.linkBorders[idx].play()
      this.project.anims.linkIcons[idx].play()
    }

    onMouseLeave(idx)
    {
      this.project.anims.linkBorders[idx].reverse()
      this.project.anims.linkIcons[idx].reverse()
    } 

    addEventListeners()
    {
      super.addEventListeners()

      if(window.innerWidth > 768)
      {
        this.elements.linkDivs.forEach((el, idx) => {
          el.addEventListener('mouseover', this.onMouseOver.bind(this, idx))
          el.addEventListener('mouseleave', this.onMouseLeave.bind(this, idx))
        })
      }
    }

    removeEventListeners()
    {
      super.removeEventListeners()

      if(window.innerWidth > 768)
      {
        this.elements.linkDivs.forEach((el, idx) => {
          el.removeEventListener('mouseover', this.onMouseOver)
          el.removeEventListener('mouseleave', this.onMouseLeave)
        })
      }
    }
}
