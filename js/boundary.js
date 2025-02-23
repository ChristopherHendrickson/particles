import { Vector } from './vector.js'

export class Boundary {
    constructor(p1, p2, force, forceRadius, name) {
        this.p1 = p1
        this.p2 = p2
        this.vector = new Vector(p1.x-p2.x, p1.y-p2.y)
        this.force = force
        this.forceRadius = forceRadius
        this.name = name
        this.isPump = false
    }

    getForceAtPoint(point) {
        if (!this.willIntersect(point)) return {x:0,y:0}
        const normalVector = this.vector.getNormalVector().getUnitVector()
        const distance = this.getDistanceToPoint(point) 
        if (!this.isPump && distance < 0) {
            return {x:0,y:0}
        }        
        const forceDistance = 1 - (Math.min(1,1 * distance / this.forceRadius))
        normalVector.x *= forceDistance * this.force
        normalVector.y *= forceDistance * this.force

        return normalVector
    }

    getDistanceToPoint(point) {
        const num = ((this.p2.y - this.p1.y)*point.x - (this.p2.x-this.p1.x)*point.y + this.p2.x*this.p1.y - this.p2.y * this.p1.x)
        const den = Math.sqrt((this.p2.y - this.p1.y)**2 + (this.p2.x - this.p1.x)**2)
        if (den == 0) return 0
        return num / den
    }

    willIntersect(point) {
        const normalVector = this.vector.getNormalVector() 

        const p1_1 = this.p1
        const p1_2 = {x: this.p1.x+normalVector.x,y: this.p1.y+normalVector.y} 
        const p2_1 = this.p2
        const p2_2 = {x: this.p2.x+normalVector.x,y: this.p2.y+normalVector.y} 
        const ans = this.isLeft(p1_1,p1_2,point) != this.isLeft(p2_1,p2_2,point)
        return ans
    }

    isLeft(a,b,c) {
        return (b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x) > 0;
      }


}