
export class Vector {
      constructor(x=0,y=0) {
        this.x = x
        this.y = y
    }

    getMagnitude() {
        return Math.sqrt(this.x**2 + this.y**2)
    }

    getUnitVector() {
        const mag = this.getMagnitude()
        if (mag == 0) {
            return new Vector(0,0)
        }
        return new Vector(this.x / mag, this.y / mag)
    }

    getNormalVector() {
        return new Vector(-this.y,this.x)
    }
}