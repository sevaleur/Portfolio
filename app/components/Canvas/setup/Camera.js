import { OrthographicCamera, PerspectiveCamera } from 'three'

export default class Camera 
{
    constructor({ scene, screen })
    {
        this.scene = scene 
        this.screen = screen

        this.setPerspective()
        this.setOrtho()
    }

    setPerspective()
    {
        this.perspective = new PerspectiveCamera(
            75,
            this.screen.aspectRatio,
            0.1,
            1000
          )
          this.perspective.position.set(0, 0, 2)
          this.perspective.updateProjectionMatrix()
          this.scene.add(this.perspective)
    }

    setOrtho()
    {
        this.ortho = new OrthographicCamera(
            -0.5, 
            0.5, 
            0.5,
            -0.5, 
            -1000, 
            1000
        )

        this.ortho.position.set(0, 0, 2)
        this.scene.add(this.ortho)
    }

    onResize(screen)
    {
        this.ortho.left = -0.5 
        this.ortho.right = 0.5 
        this.ortho.top = 0.5 
        this.ortho.bottom = -0.5
        this.ortho.near = -1000 
        this.ortho.far = 1000 

        this.perspective.aspect = screen.aspectRatio
        this.perspective.updateProjectionMatrix()
    }
}