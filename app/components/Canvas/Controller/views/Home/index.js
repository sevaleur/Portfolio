import { Group, TextureLoader } from 'three'
import gsap from 'gsap'

import Element from './Element'

export default class Home
{
  constructor({ scene, screen, viewport, geo })
  {
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.geo = geo

    this.group = new Group()

    this.createTouch()
    this.createElements()

    this.onResize({ screen, viewport })

    this.scene.add(this.group)

    this.show()
  }

  createTouch()
  {
    this.touch = {
      position: 0.0, 
      current: 0.0, 
      target: 0.0
    }
  }

  createElements()
  {
    this.element = new Element(
      {
        screen: this.screen,
        viewport: this.viewport,
        geometry: this.geo,
        scene: this.group
      }
    )
  }

  show()
  {
    this.element.show()
  }

  async hide()
  {
    await this.element.hide()
  }

  onResize({screen, viewport})
  {
    this.element.onResize({ screen, viewport })
  }

  update()
  {
    this.element.update()
  }

  destroy()
  {
    this.scene.remove(this.group)
  }
}