import EventEmitter from './EventEmitter'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        this.start = Date.now()
        this.current = this.start 
        this.elapsed = 0 
        this.delta = 16 

        window.requestAnimationFrame(() => 
        {
            this.update()
        })
    }

    update()
    {
        const _current = Date.now()
        this.delta = _current - this.current 
        this.current = _current
        this.elapsed = this.current - this.start 

        this.trigger('update')

        window.requestAnimationFrame(() => 
        {
            this.update()
        })
    }
}