import { CanvasHandler } from "./canvas.js"
import { Particle } from "./particle.js"
import { Plane } from "./plane.js"

const htmlCanvas = document.getElementById("canvas")
const canvasHandler = new CanvasHandler(htmlCanvas)

let x = 0
let y = 0
let interval
let screenLeft = window.screenLeft
let screenTop = window.screenTop
document.addEventListener("mousemove", (e) => {
    x = e.clientX 
    y = e.clientY 

})

window.addEventListener("resize", (event) => {
    canvasHandler.onResize()
    plane.onResize(canvasHandler.width, canvasHandler.height)
});

canvasHandler.canvas.addEventListener("mousedown", () => {
    interval = setInterval(()=>{
        makeParticle(x,y)
        makeParticle(x,y)
        makeParticle(x,y)
        makeParticle(x,y)
        // makeParticle(x,y)
    }, 2)
    // makeParticle(x,y)
})
document.addEventListener("mouseup", () => {
    clearInterval(interval)
})


const plane = new Plane(canvasHandler.width, canvasHandler.height, 8)
const gameLoop = () => {

    
    canvasHandler.clear()
    
    plane.step(0.3)
    if (window.screenLeft != screenLeft) {
        plane.screenMovedHorizontal(window.screenLeft - screenLeft)
        screenLeft = window.screenLeft
    }
    if (window.screenTop != screenTop) {
        plane.screenMovedVertical(window.screenTop - screenTop)
        screenTop = window.screenTop
    }
    canvasHandler.drawPlane(plane)

    plane.boundaries.forEach(b => {
        canvasHandler.drawBoundary(b)
    })

    plane.particles.forEach(p => {
        canvasHandler.drawParticle(p)
    })   

    requestAnimationFrame(() => {
        gameLoop()
    })
}
const makeParticle = (x,y) => {
    const particle = new Particle(4, 1, 6, {x: x,y: y} )
    plane.particles.push(particle)

}
document.addEventListener("keydown", (e) => {
    const particle = new Particle(20, 1, 20, {x: x,y: y} )
    // particle.viscosity = 1
    // plane.particles.push(particle)
    
})
// makeParticle(0,0)

gameLoop()
const tfb = document.getElementById("tfb")
const tvb = document.getElementById("tvb")
const tnb = document.getElementById("tnb")
const tbb = document.getElementById("tbb")
const trb = document.getElementById("trb")
const grange = document.getElementById("grav")
const compass = document.getElementById("compass")

tfb.onclick = (ev) => {
    canvasHandler.drawParticleForceVector = !canvasHandler.drawParticleForceVector 
}
tvb.onclick = (ev) => {
    canvasHandler.drawparticleVelocityVector = !canvasHandler.drawparticleVelocityVector 
}
tnb.onclick = (ev) => {
    canvasHandler.drawNodes = !canvasHandler.drawNodes 
}
tbb.onclick = (ev) => {
    canvasHandler.drawBoundaries = !canvasHandler.drawBoundaries 
}
trb.onclick = (ev) => {
    canvasHandler.drawParticleRadius = !canvasHandler.drawParticleRadius 
}
grange.addEventListener("input", (event) => {
    const angle = (Number(event.target.value)) * 3.6 - 90
    const angleRadians = angle * (Math.PI / 180)

    compass.style.transform = `rotate(${angle-90}deg)`
    plane.setGravityAngle(angleRadians)
});