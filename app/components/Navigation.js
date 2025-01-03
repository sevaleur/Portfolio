import gsap from 'gsap'

import Component from "classes/Component"

export default class Navigation extends Component
{
  constructor({ template })
  {
    super({
      element: '.navigation',
      elements:
      {

      },
    })

    this.template = template
    this.onChange(this.template)
  }

  create()
  {
    super.create()

    this.nav = {
      anim: {
        std: {},
        active: {},
        show: {}
      }
    }

    this.createAnimations()
  }

  createAnimations()
  {
    
  }

  onChange(template)
  {
    
  }

  show()
  {
    
  }

  addEventListeners()
  {
    super.addEventListeners()

  }

  removeEventListeners()
  {
    super.removeEventListeners()
  }
}