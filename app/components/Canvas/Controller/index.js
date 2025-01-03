import { PlaneGeometry } from 'three'

import Home from './views/Home'
import Projects from './views/Projects'

export default class Controller
{
  constructor({ scene, screen, viewport })
  {
    this.scene = scene
    this.screen = screen
    this.viewport = viewport

    this.createGeometry()
  }

  createGeometry()
  {
    this.geometry = new PlaneGeometry(1, 1, 10, 10)
  }

  createHome()
  {
    if(this.home) this.destroyHome()

    this.home = new Home({
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      geo: this.geometry
    })

    console.log('created')
  }

  createProjects()
  {
    if(this.projects) this.destroyProjects()

    this.projects = new Projects({
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      geometry: this.geometry
    })
  }

  /*
  *
  ** DESTROY.
  *
  */

  destroyHome()
  {
    if(!this.home) return

    this.home.destroy()
    this.home = null
  }

  destroyProjects()
  {
    if(!this.projects) return

    this.projects.destroy()
    this.projects = null
  }

/*
*
** EVENTS.
*
*/

  async onChangeStart(template, url, push)
  {
    if(!push)
      return

    if(this.home)
      await this.home.hide()

    if(this.projects)
      this.projects.hide()
  }

  onChange(template)
  {
    switch(template)
    {
      case 'home':
        this.createHome()

        this.destroyProjects()
        break
      case 'projects':
        this.createProjects()

        this.destroyHome()
        break
      default:
        this.destroyHome()
        this.destroyProjects()
      break
    }
  }

  onResize({ screen, viewport })
  {
    if(this.home) this.home.onResize({ screen, viewport })
    if(this.projects) this.projects.onResize({ screen, viewport })
  }

  onTouchDown({ y, x })
  {
    if(this.projects)
      this.projects.onTouchDown({ y, x })
  }

  onTouchMove({ y, x })
  {
    if(this.projects)
      this.projects.onTouchMove({ y, x })
  }

  onTouchUp({ y, x })
  {
    if(this.projects)
      this.projects.onTouchUp({ y, x })
  }

  onWheel(e)
  {
    if(this.projects)
      this.projects.onWheel(e)
  }

  /*
  *
  ** UPDATE.
  *
  */

  update(scroll)
  {
    if(this.home)
      this.home.update()

    if(this.projects)
      this.projects.update()
  }
}