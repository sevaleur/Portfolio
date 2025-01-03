import { Group, TextureLoader } from 'three'
import gsap from 'gsap'

import Prefix from 'prefix'

import Element from './Element'

export default class Projects
{
  constructor({ scene, screen, viewport, geometry })
  {
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.geometry = geometry

    this.group = new Group()

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      speed: 0.1,
      ease: 0.05
    }

    //this.tPrefix = Prefix('transform')

    this.getElements()
    this.createBounds()
    this.createElements()

    this.onResize({ screen, viewport })

    this.scene.add(this.group)

    this.show()

    this.addEventListener()
  }

  getElements()
  {
    this.projectsWrapper = document.querySelector('.projects__wrapper')
    this.projectsElements = document.querySelectorAll('.projects__project')
    this.projectsImages = document.querySelectorAll('figure.projects__project__media__figure')
  }

  createElements()
  {
    this.elements = Array.from(
      this.projectsImages,
      (element, index) =>
      {
        return new Element({
          element,
          index,
          geometry: this.geometry,
          scene: this.group,
          screen: this.screen,
          viewport: this.viewport
        })
      }
    )
  }

  createBounds()
  {
    this.fullBounds = this.projectsWrapper.getBoundingClientRect()

    if(this.elements)
      this.scroll.limit = this.fullBounds.height - this.elements[0].bounds.height
  }

  show()
  {
    this.elements.forEach(
      (element, index) =>
      {
        element.show()
      }
    )
  }

  hide()
  {
    this.elements.forEach(
      (element, index) =>
      {
        element.hide()
      }
    )
  }

  onMouseOver(index)
  {
    this.elements[index].onMouseOver()
  }

  onMouseLeave(index)
  {
    this.elements[index].onMouseLeave()
  }

  onResize({ screen, viewport })
  {
    this.createBounds()

    this.elements.forEach(
      element =>
      {
        element.onResize(
          {
            screen,
            viewport
          }
        )
      }
    )
  }

  onTouchDown({y, x})
  {
    if(this.selected) return

    this.scroll.position = this.scroll.current
  }

  onTouchMove({y, x})
  {
    if(this.selected) return

    const dist = y.start - y.end

    this.scroll.target = this.scroll.position - dist * 1.5
  }

  onTouchUp({ y, x })
  {

  }

  onWheel({ pixelY })
  {
    if(this.selected) return

    this.scroll.target -= pixelY * 0.5
  }

  update()
  {
    this.scroll.target = gsap.utils.clamp(-this.scroll.limit, 0, this.scroll.target)
    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.ease)

    //this.projectsWrapper.style[this.tPrefix] = `translateY(${this.scroll.current}px)`

    if(this.scroll.current > -0.01) this.scroll.current = 0

    this.elements.forEach(element => element.update(this.scroll))

    this.scroll.last = this.scroll.current
  }

  addEventListener()
  {
    this.projectsElements.forEach(
      (element, index) => 
      {
        element.addEventListener('mouseover', this.onMouseOver.bind(this, index))
        element.addEventListener('mouseleave', this.onMouseLeave.bind(this, index))
      }
    )
  }

  destroy()
  {
    this.scene.remove(this.group)
  }
}