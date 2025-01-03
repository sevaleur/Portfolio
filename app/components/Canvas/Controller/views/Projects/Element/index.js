import { ShaderMaterial, Mesh } from "three"
import gsap from 'gsap'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

export default class Element
{
  constructor({ element, index, geometry, scene, screen, viewport })
  {
    this.element        = element
    this.index          = index
    this.geometry       = geometry
    this.scene          = scene
    this.screen         = screen
    this.viewport       = viewport

    this.createMaterial()
    this.createTexture()
    this.createMesh()
    this.createBounds()
    this.createAnimations()

    this.time = 0
  }

  createMaterial()
  {
    this.material = new ShaderMaterial({
      uniforms: {
        tMap:   { value: null },
        uAlpha: { value: 0.0 },
        uPlaneSize: { value: { x: 0, y: 0 } },
        uImageSize: { value: { x: 0, y: 0 } },
        uFrequency: { value: { x: 10, y: 2.5 } }, 
        uTime: { value: 0.0 }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true
    })
  }

  createTexture()
  {
    let src = this.element.querySelector('img').getAttribute('data-src')

    this.texture = window.IMAGE_TEXTURES[src]
    this.material.uniforms.tMap.value = this.texture

    this.material.uniforms.uImageSize.value.x = this.texture.source.data.naturalWidth
    this.material.uniforms.uImageSize.value.y = this.texture.source.data.naturalHeight
  }

  createMesh()
  {
    this.plane = new Mesh(this.geometry, this.material)
    this.scene.add(this.plane)
  }

  createAnimations()
  {
    this.onAlphaChange = gsap.fromTo(
      this.material.uniforms.uAlpha,
      {
        value: 0.0
      },
      {
        value: 1.0,
        ease: 'power2.inOut',
        paused: true
      }
    )
  }

  createBounds()
  {
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale()
    this.updateX()
    this.updateY()

    this.material.uniforms.uPlaneSize.value.x = this.plane.scale.x
    this.material.uniforms.uPlaneSize.value.y = this.plane.scale.y
  }

  show()
  {
    //this.onAlphaChange.play()
  }

  hide()
  {
    this.onAlphaChange.reverse()
    this.scene.remove(this.plane)
  }

  onMouseOver()
  {
    this.onAlphaChange.play()
  }

  onMouseLeave()
  {
    this.onAlphaChange.reverse()
  }

  onResize(sizes)
  {
    const { screen, viewport } = sizes

    if(screen)    this.screen = screen
    if(viewport)  this.viewport = viewport

    this.createBounds()
  }

  updateScale()
  {
    this.plane.scale.x = (this.viewport.width * this.bounds.width) / this.screen.width
    this.plane.scale.y = (this.viewport.height * this.bounds.height) / this.screen.height

    this.plane.material.uniforms.uPlaneSize.value.x = this.plane.scale.x
    this.plane.material.uniforms.uPlaneSize.value.y = this.plane.scale.y
  }

  updateX()
  {
    this.x = (this.bounds.left / this.screen.width) * this.viewport.width
    this.plane.position.x = (-this.viewport.width / 2) + (this.plane.scale.x / 2) + this.x
  }

  updateY()
  {
    this.y = (this.bounds.top / this.screen.height) * this.viewport.height
    this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - this.y
  }

  update(scroll)
  {
    if(!this.bounds) return

    this.time += 0.05

    this.material.uniforms.uTime.value = this.time

    this.updateScale()
    this.updateX()
    this.updateY()
  }
}