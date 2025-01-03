import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super()

        this.screen = {
            width: window.innerWidth,
            height: window.innerHeight, 
            ratio: Math.min(2, window.devicePixelRatio)
        }

        this.aspect = this.screen.width / this.screen.height 

        window.addEventListener('resize', () => 
        {
            this.screen.width = window.innerWidth
            this.screen.height = window.innerHeight
            this.screen.ratio = Math.min(2, window.devicePixelRatio)
            this.aspect = this.screen.width / this.screen.height

            this.trigger('resize')
        })
    }
}