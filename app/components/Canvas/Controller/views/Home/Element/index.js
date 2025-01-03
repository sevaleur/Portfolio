import { PlaneGeometry, ShaderMaterial, Mesh } from 'three'
import gsap from 'gsap'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

export default class Element
{
  constructor({ screen, viewport, scene })
  {
    this.screen = screen 
    this.viewport = viewport
    this.scene = scene 

    this.createGeometry()
    this.createMaterial()
    this.setMouse()
    this.createAnimations()
    this.onResize()
    this.show()

    this.time = 0
  }

  createGeometry()
  {
    this.geo = new PlaneGeometry(1, 2, 2, 1)
  }

  createMaterial()
  {
    this.mat = new ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        u_scale: { value: { x:1, y:1 } },
        u_mouse: { value: { x:0, y:0 } },
        u_size: { value: 0.0 }, 
        u_mouse_size: { value: 0.0 }, 
        u_cam_pos: { value: 2.0}, 
        u_box_size: { value: { x:0.125, y:0.125 } }, 
        u_time_factor: { value: 0.03 },
        u_color: { value: { x:.6, y:.2, z:.5 } }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.plane = new Mesh(this.geo, this.mat)
    this.scene.add(this.plane)
  }

  setMouse()
  {
    this.mouse = { x: 0, y: 0 }
    window.addEventListener('mousemove', (e) =>
    {
      this.mouse.x = e.clientX / this.screen.width * 2 - 1
      this.mouse.y = -(e.clientY / this.screen.height * 2 - 1)
    })
  }

  createAnimations()
  {
    this.onShow = gsap.fromTo(
      [ 
        this.mat.uniforms.u_size, 
        this.mat.uniforms.u_mouse_size 
      ],
      {
        value: 1.0
      },
      {
        value: 0.0,
        duration: 1.5,
        delay: 0.5,
        ease: 'power.inOut', 
        paused: true
      }
    )

    this.cameraAnimate = gsap.fromTo(
      this.mat.uniforms.u_cam_pos, 
      {
        value: 2.0
      }, 
      {
        value: 5.0, 
        duration: 2.0, 
        ease: 'power2.inOut', 
        paused: true
      }
    )

    this.sizeAnimate = gsap.fromTo(
      this.mat.uniforms.u_box_size.value, 
      {
        x: 0.125, 
        y: 0.125
      }, 
      {
        x: 2.0, 
        y: 2.0, 
        duration: 2.0, 
        ease: 'power2.inOut', 
        delay: 1.0, 
        paused: true
      }
    )

    this.resetTimeFactor = gsap.fromTo(
      this.mat.uniforms.u_time_factor, 
      {
        value: 0.03
      }, 
      {
        value: 0.015, 
        duration: 2.0, 
        ease: 'power2.inOut', 
        paused: true
      }
    )
  }

  show()
  {
    this.onShow.play()
  }

  hide()
  {
    return new Promise(
      resolve => 
      {
        this.onShow.reverse()
          .eventCallback(
            'onReverseComplete', () => 
            {
              resolve()
            }
          )
      }
    )
  }

  onResize()
  {
    this.aspect = 1.77
    this.vpa = this.screen.width / this.screen.height

    if(this.aspect > this.vpa)
    {
      this.mat.uniforms.u_scale.value.x = this.aspect / this.vpa
      this.mat.uniforms.u_scale.value.y = 1
    }
    else
    {
      this.mat.uniforms.u_scale.value.x = 1
      this.mat.uniforms.u_scale.value.y = this.vpa / this.aspect
    }
  }

  update()
  {
    this.time += 0.05 

    this.mat.uniforms.u_time.value = this.time

    gsap.to(
      this.mat.uniforms.u_mouse.value,
      {
        x: this.mouse.x,
        y: this.mouse.y,
        duration: 2.5,
        ease: 'linear'
      }
    )
  }
}
