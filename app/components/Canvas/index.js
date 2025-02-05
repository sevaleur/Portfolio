import { Scene } from 'three'

import Camera from './setup/Camera'
import Renderer from './setup/Renderer'

import Controller from './Controller'

export default class Canvas
{
  static instance

  constructor({ template, canvas, screen })
  {
    if(Canvas.instance)
      return Canvas.instance

    Canvas.instance = this

    this.template = template
    this.canvas = canvas
    this.screen = screen

    this.createObjects()
    this.createScene()
    this.createCamera()
    this.createRenderer()

    this.onResize(this.screen)

    this.createController()
  }

  createObjects()
  {
    this.touch = {
      y: {
        start: 0,
        distance: 0,
        end: 0
      },
      x: {
        start: 0,
        distance: 0,
        end: 0
      }
    }

    this.scroll = {}
  }

  createScene()
  {
    this.scene = new Scene()
  }

  createCamera()
  {
    this.camera = new Camera({
      screen: this.screen,
      scene: this.scene, 
    })
  }

  createRenderer()
  {
    this.renderer = new Renderer({
      canvas: this.canvas,
      screen: this.screen,
      scene: this.scene,
      camera: this.camera, 
      template: this.template
    })
  }

  createController()
  {
    this.controller = new Controller({
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport
    })
  }

  /*
    EVENTS.
  */

  onTouchDown(e)
  {
    this.isDown = true

    this.touch.x.start = e.touches ? e.touches[0].clientX : e.clientX
    this.touch.y.start = e.touches ? e.touches[0].clientY : e.clientY

    this.controller.onTouchDown({
      y: this.touch.y,
      x: this.touch.x
    })
  }

  onTouchMove(e)
  {
    if(!this.isDown) return

    const x = e.touches ? e.touches[0].clientX : e.clientX
    const y = e.touches ? e.touches[0].clientY : e.clientY

    this.touch.y.end = y
    this.touch.x.end = x

    this.controller.onTouchMove({
      y: this.touch.y,
      x: this.touch.x
    })
  }

  onTouchUp(e)
  {
    this.isDown = false

    this.controller.onTouchUp({
      y: this.touch.y,
      x: this.touch.x
    })
  }

  onWheel(e)
  {
    this.controller.onWheel(e)
  }

  onPreloaded()
  {
    this.controller.onChange(this.template)
  }

  async onChangeStart(template, url, push)
  {
    if(!push)
        return

    await this.controller.onChangeStart(template, url, push)
  }

  onChange(template)
  {
    this.controller.onChange(template)
    this.renderer.onChange(template, this.camera)
  }

  onResize(screen)
  {
    if(this.camera) this.camera.onResize(screen)
    if(this.renderer) this.renderer.onResize(screen)

    const fov = this.camera.perspective.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.perspective.position.z
    const width = height * this.camera.perspective.aspect

    this.viewport = {
      width,
      height
    }

    if(this.controller)
    {
      this.controller.onResize({
        screen: screen,
        viewport: this.viewport
      })
    }
  }

  update()
  {
    if(this.controller) this.controller.update(scroll)
    if(this.renderer) this.renderer.update()
  }
}