import { Boundary } from "./boundary.js"
import { Node } from "./node.js"
import { Point } from "./point.js"
import { Vector } from "./vector.js"

export class Plane {

    constructor(width, height, gridSpacing) {
        this.width = width
        this.height = height
        this.gridSpacing = gridSpacing
        this.nodes = []
        this.boundaries = []
        this.particles = []
        this.gravity = new Vector(0,0.6)
        this.friction = 0.01

        this.fillPlaneWithNodes()
        this.addBoundaries()


    }

    step(elapsedTime) {
        this.calculateParticleNodes()
        this.particles.forEach((p) => p.initializeForNextStep())
        this.particles.forEach((particle) => {
            const node = particle.node
            const neighbours = this.getNeighbouringNodes(node,particle.massRadius)
            neighbours.forEach(neighbouringNode => {
                neighbouringNode.particles.forEach(neighbouringParticle => {                    
                    neighbouringParticle.addForceFromNearbyParticle(particle)
                    neighbouringParticle.transferMomentumFromNearbyParticle(particle)
                })
            })
            this.boundaries.forEach((b) => {
                particle.addForceFromBoundary(b)
            })
        })
        this.particles.forEach((particle) => {
            particle.step(elapsedTime, this)
        })

    }

    setGravityAngle(angle) {
        const gravityMagnitude = this.gravity.getMagnitude()
        this.gravity = new Vector(Math.cos(angle)*gravityMagnitude, Math.sin(angle)*gravityMagnitude)
    }

    onResize(width,height) {
        this.nodes = []
        this.boundaries = []
        this.width = width
        this.height = height
        this.fillPlaneWithNodes()
        this.addBoundaries()
    }
    getNeighbouringNodes(node, reach) {
        const neighbours = []
        const reachCount = Math.ceil((reach) / this.gridSpacing)
        node.highlight("blue")
        let nodeX = node.xIndex
        let nodeY = node.yIndex
        for (let x = nodeX - reachCount; x <= nodeX + reachCount; x++) {
            for (let y = nodeY - reachCount; y <= nodeY + reachCount; y++) {
                const row = this.nodes[x]
                if (row) {
                    let neighbourNode = row[y]
                    neighbourNode && neighbours.push(neighbourNode)
                    neighbourNode != node && neighbourNode && neighbourNode.highlight("green")
                }
            }
        }
        return neighbours
    }

    calculateParticleNodes() {
        this.nodes.forEach((row) => {
            row.forEach((node) => {
                node.resetParticleNodes()
            })
        })

        this.particles.forEach(particle => {
            const node = this.getNearestNode(particle.location.x, particle.location.y)
            particle.node = node
            node.particles.push(particle)
        });
    }

    getNearestNode(x,y) {
        let xIndex = Math.round(x/this.gridSpacing)
        let yIndex = Math.round(y/this.gridSpacing)
        xIndex = Math.max(Math.min(this.nodes.length-1, xIndex),0)
        yIndex = Math.max(Math.min(this.nodes[xIndex].length-1, yIndex),0)

        return this.nodes[xIndex][yIndex]
    }


    fillPlaneWithNodes() {
        const xNodecount = Math.floor(this.width / this.gridSpacing) +1
        const yNodecount = Math.floor(this.height / this.gridSpacing) +1

        for (let x = 0; x < xNodecount; x++) {
            this.nodes[x] = []
            for (let y = 0; y < yNodecount; y++) {
                const point = new Point(x*this.gridSpacing,y*this.gridSpacing)
                const node = new Node(point,x,y)
                this.nodes[x][y] = node
            }
        }
    }

    screenMovedHorizontal(distance) {
        this.particles.forEach((particle) => {
            particle.location.x -= distance;
        })
    }
    screenMovedVertical(distance) {
        this.particles.forEach((particle) => {
            particle.location.y -= distance;
        })
    }

    addBoundaries() {
        const leftBoundary = new Boundary(new Point(0,0), new Point(0,this.height),50,40,"left")
        const rightBoundary = new Boundary(new Point(this.width,this.height), new Point(this.width,0),50,40, "right")
        const bottomBoundary = new Boundary(new Point(0,this.height), new Point(this.width,this.height),50,40, "bottom")
        const topBoundary = new Boundary(new Point(this.width,0), new Point(0,0),20,40, "top")
        
        
        this.boundaries.push(leftBoundary)
        this.boundaries.push(rightBoundary)
        this.boundaries.push(bottomBoundary)
        this.boundaries.push(topBoundary)

        
        // fountain
        const f = new Boundary(new Point(this.width/2-8,this.height), new Point(this.width/2 - 8,this.height/1.5),-150,10, "f")
        const f2 = new Boundary(new Point(this.width/2 + 8,this.height/1.5),new Point(this.width/2+8,this.height), -150,10, "f")
        const f4= new Boundary(new Point(this.width/2 - 8,this.height - 20),new Point(this.width/2+8,this.height - 20), 228,60, "f")
        const f5= new Boundary(new Point(this.width/2 - 8,this.height - 60),new Point(this.width/2+8,this.height - 60), 228,60, "f")
        const f6= new Boundary(new Point(this.width/2 - 8,this.height),new Point(this.width/2+8,this.height), 228,60, "f")
         
        // this.boundaries.push(f)
        // this.boundaries.push(f2)
        // this.boundaries.push(f4)
        // this.boundaries.push(f5)

        // shelf
        const s1 = new Boundary(new Point(100,this.height-80), new Point(this.width,this.height-100),110,20, "f")
        const s2 = new Boundary(new Point(this.width-50,this.height-40),new Point(50,this.height-40), 80,20, "f")
        const s3 = new Boundary(new Point(50,this.height-40),new Point(this.width-50,this.height-40), 80,20, "f")
        const s4 = new Boundary(new Point(50,this.height-180),new Point(50,this.height-40), 80,20, "f")
        const s5 = new Boundary(new Point(50,this.height-40),new Point(50,this.height-180), 80,20, "f")
        const s6 = new Boundary(new Point(0,this.height-40),new Point(50,this.height-40), 80,10, "f")
        s6.isPump = true
        // this.boundaries.push(s1)
        // this.boundaries.push(s2)
        // this.boundaries.push(s3)
        // this.boundaries.push(s4)
        // this.boundaries.push(s5)
        // this.boundaries.push(s6)

    }

}