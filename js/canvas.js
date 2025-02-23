export class CanvasHandler {

    canvas;
    ctx;
    
    get height() {
        return this.canvas.height
    }
   
    get width() {
        return this.canvas.width
    }

    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 60;
        this.drawParticleRadius = false;
        this.drawParticleForceVector = false;
        this.drawparticleVelocityVector = false
        this.drawNodes = false
        this.drawBoundaries = false;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    onResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 60;
    }

    drawBoundary(boundary) {
        if (this.drawBoundaries) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = "red"
            this.ctx.moveTo(boundary.p1.x, boundary.p1.y);
            this.ctx.lineTo(boundary.p2.x, boundary.p2.y);
            this.ctx.stroke();

        }

    }

    drawParticle(particle) {
        this.ctx.beginPath()
        this.ctx.arc(particle.location.x, particle.location.y, particle.size,0,Math.PI*2)
        this.ctx.fillStyle = particle.color
        this.ctx.fill(); 
        particle.color="blue"
        if (this.drawParticleRadius) {
            this.ctx.beginPath()
            this.ctx.arc(particle.location.x, particle.location.y, particle.massRadius,0,Math.PI*2)
            this.ctx.strokeStyle = "rgba(0,0,255,0.2)"
            this.ctx.stroke(); 
        }
        if (this.drawParticleForceVector) {
            const startX = particle.location.x
            const startY = particle.location.y
            const endX = startX + particle.forceVector.x*2
            const endY = startY + particle.forceVector.y*2
    
            this.ctx.beginPath();
            this.ctx.strokeStyle = "lime"
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
        if (this.drawparticleVelocityVector) {
            const startX = particle.location.x
            const startY = particle.location.y
            const endX = startX - particle.velocity.x
            const endY = startY - particle.velocity.y
    
            this.ctx.beginPath();
            this.ctx.strokeStyle = "orange"
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }

    }

    drawPlane(plane) {
        if (this.drawNodes) {
            plane.nodes.forEach(col => {
                col.forEach(node => {
                    this.drawNode(node)
                })
            });
        }

    }

    drawNode(node) {
        const x = node.location.x
        const y = node.location.y
        this.ctx.beginPath();
        this.ctx.strokeStyle = node.color
        this.ctx.moveTo(x-4, y);
        this.ctx.lineTo(x+4, y);
        this.ctx.stroke();

        this.ctx.moveTo(x, y-4);
        this.ctx.lineTo(x, y+4);
        this.ctx.stroke();
        node.color = "red"
    }


}