
export class Node {

    constructor(location, xIndex, yIndex) {
        this.location = location
        this.xIndex = xIndex
        this.yIndex = yIndex
        this.color = "red"
        this.particles = []
    }

    resetParticleNodes() {
        this.particles.length = 0
    }

    getDistanceToPoint(point) {
        const dist = Math.sqrt((point.x - this.location.x)**2 + (point.y - this.location.y)**2)
        return dist
    }

    highlight(color) {
        this.color = color
    }
}