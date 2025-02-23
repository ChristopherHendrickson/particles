import { Point } from "./point.js";
import { Vector } from "./vector.js";

export class Particle {
    static id = 0
    constructor(size,density,radius,pos) {
        this.id = Particle.id++
        this.size = size
        this.density = density
        this.mass = this.size**2 * density
        this.location = new Point(pos.x,pos.y)

        this.acceleration = new Vector(0,0)
        this.velocity = new Vector(0,0)
        this.prevVelocity = new Vector(0,0)
        this.forceVector = new Vector(0,0)
        this.massRadius = size * radius
        this.viscosityRadius = 2.0 * this.massRadius
        this.viscosity = 0.006
        this.node = null
        this.lostMomentum = new Vector(0,0)
        this.gainedMomentum = new Vector(0,0)
        this.color = "blue"
        this.collisionLosses = 0.6
    }
    get momentum() {
        return new Vector(this.velocity.x * this.mass, this.velocity.y * this.mass)
    }
    initializeForNextStep() {
        this.forceVector = new Vector(0,0)
        this.lostMomentum = new Vector(0,0)
        this.gainedMomentum = new Vector(0,0)
    }

    step(elapsedTime, plane) {
        const limity = plane.height
        const limitx = plane.width

        this.prevVelocity.x = this.velocity.x
        this.prevVelocity.y = this.velocity.y
        this.calculateForce(elapsedTime, plane.friction, plane.gravity)
        this.calculateAcceleration()
        this.calculateVelocity(elapsedTime)
        this.calculatePosition(elapsedTime)
        this.color = this.getColorAtHeight(plane.height)
        if (this.location.x - this.size <= 0 || this.location.x + this.size >= limitx) {
            this.velocity.x = -this.velocity.x * (1-this.collisionLosses)
            this.prevVelocity.x = -this.prevVelocity.x 
            this.location.x = Math.min(this.location.x, limitx - this.size)
            this.location.x = Math.max(this.location.x, this.size)
        }

        if (this.location.y - this.size <= 0 || this.location.y + this.size >= limity) {
            this.velocity.y = -this.velocity.y * (1-this.collisionLosses)
            this.prevVelocity.y = -this.prevVelocity.y
            this.location.y = Math.min(limity - this.size, this.location.y)
            this.location.y = Math.max(this.location.y, this.size)
        }  


    }
    
    calculateForce(elapsedTime, friction, gravity) {
        this.forceVector.x += gravity.x * this.mass
        this.forceVector.y += gravity.y * this.mass
        this.forceVector.x *= (1-(friction))**elapsedTime
        this.forceVector.y *= (1-(friction))**elapsedTime
    }
    
    calculateAcceleration() {
        this.acceleration.x = this.forceVector.x / this.mass
        this.acceleration.y = this.forceVector.y / this.mass

    }

    calculateVelocity(elapsedTime) {
        this.velocity.x += this.acceleration.x * elapsedTime
        this.velocity.y += this.acceleration.y * elapsedTime
        this.velocity.x += (this.gainedMomentum.x - this.lostMomentum.x) / this.mass
        this.velocity.y += (this.gainedMomentum.y - this.lostMomentum.y) / this.mass
    }

    calculatePosition(elapsedTime) {
        this.location.x += ((this.velocity.x +this.prevVelocity.x)/2) * elapsedTime
        this.location.y += ((this.velocity.y +this.prevVelocity.y)/2) * elapsedTime
    }


    


    addForceFromNearbyParticle(particle) {
        this.color = "green"
        if (particle.id == this.id) {
            return
        }

        let xDist = particle.location.x - this.location.x
        let yDist = particle.location.y - this.location.y
        if (xDist == 0) {
            xDist = Math.random() - 0.5
        }
        if (yDist == 0) {
            yDist = Math.random() - 0.5
        }
        const particleToParticleVector = new Vector(xDist,yDist)
        const particleToParticleDistance = this.getDistanceToPoint(particle.location)
        const particleToParticleUnitVector = particleToParticleVector.getUnitVector()
        
        const forceDistance = 1 - (Math.min(1,1*particleToParticleDistance / particle.massRadius))
        this.forceVector.x -= particleToParticleUnitVector.x * forceDistance * particle.mass / 2
        this.forceVector.y -= particleToParticleUnitVector.y * forceDistance * particle.mass / 2
    }


    transferMomentumFromNearbyParticle(particle) {
        const particleToParticleDistance = this.getDistanceToPoint(particle.location)
        const forceDistance = 1 - (Math.min(1,1*particleToParticleDistance / particle.viscosityRadius))
        let transferedMomentumX = forceDistance * this.viscosity * particle.velocity.x * particle.mass 
        let transferedMomentumY = forceDistance * this.viscosity * particle.velocity.y * particle.mass

        this.gainedMomentum.x += transferedMomentumX
        this.gainedMomentum.y += transferedMomentumY

        particle.lostMomentum.x += transferedMomentumX
        particle.lostMomentum.y += transferedMomentumY
    }

    addForceFromBoundary(boundary) {
        const forceVector = boundary.getForceAtPoint(this.location)
        this.forceVector.x += forceVector.x
        this.forceVector.y += forceVector.y
    }

    getDistanceToPoint(point) {
        const dist = Math.sqrt((point.x - this.location.x)**2 + (point.y - this.location.y)**2)
        return dist
    }

    getColorAtHeight(max) {
        const hue = (this.location.y / max) * 360;

        // Convert hue to an HSL color (full saturation and lightness)
        return `hsl(${hue}, 100%, 50%)`;
    }
}

