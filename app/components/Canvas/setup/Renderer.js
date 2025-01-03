import { WebGLRenderer } from 'three'

export default class Renderer
{
  constructor({ canvas, screen, scene, camera, template })
  {
    this.canvas = canvas
    this.screen = screen
    this.scene = scene
    this.camera = camera
    this.activeCamera = template === 'home' ? camera.ortho : camera.perspective

    this.createInstance()
  }

  createInstance()
  {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })

    this.instance.setSize(this.screen.width, this.screen.height)
    this.instance.setPixelRatio(this.screen.pixelRatio)
  }

  onChange(template, camera)
  {
    switch(template)
    {
      case 'home': 
        this.activeCamera = camera.ortho
        break 
      case 'projects': 
        this.activeCamera = camera.perspective
        break 
      default: 
        this.activeCamera = undefined
        break
    }
  }

  onResize(screen)
  {
    this.instance.setSize(screen.width, screen.height)
    this.instance.setPixelRatio(screen.pixelRatio)
  }

  update()
  {
    if(this.activeCamera !== undefined)
      this.instance.render(this.scene, this.activeCamera)
  }
}