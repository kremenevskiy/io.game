function Vector(x, y){
	this.x = x;
	this.y = y;
}


Vector.prototype.set = function(x, y) {
	if (x instanceof Vector) {
		this.x = x.x;
		this.y = x.y;
		return this;
	}
	if (x instanceof Array) {
		this.x = x[0];
		this.y = x[1];
		return this;
	}
	this.x = x;
	this.y = y;
	return this;
}


Vector.prototype.copy = function() {
	return new Vector(this.x, this.y);
}

Vector.prototype.add = function(x, y) {
	if (x instanceof Vector) {
		console.log('vec: x' + this.x + " y: " + this.y)
		if (x.x !== 0){
			console.log('\t\tAddvec: x' + x.x + " y: " + x.y)
		}

		this.x += x.x;
		this.y += x.y;
		console.log('res vec: x' + this.x + " y: " + this.y)
		console.log('doing add')
		return this;
	}
	if (x instanceof Array) {
		this.x += x[0];
		this.y += x[1];
		return this;
	}
	this.x += x;
	this.y += y;
	return this;
}


Vector.prototype.sub = function(x, y) {
	if (x instanceof Vector) {
		this.x -= x.x;
		this.y -= x.y;
		return this;
	}
	if (x instanceof Array) {
		this.x -= x[0];
		this.y -= x[1];
		return this;
	}
	this.x -= x;
	this.y -= y;
	return this;
}


Vector.prototype.mult = function(x, y) {
	if (x instanceof Vector) {
		this.x *= x.x;
		this.y *= x.y;
		return this;
	}
	if (x instanceof Array) {
		if (x.length === 1) {
			this.x *= x[0];
			this.y *= x[0];
		}
		if (x.length === 2) {
			this.x *= x[0];
			this.y *= x[1];
		}
		return this;
	}

	const args = [...arguments];
	if (args.length === 1) {
		this.x *= args[0];
		this.y *= args[0];
	}
	if (args.length === 2) {
		this.x *= args[0];
		this.y *= args[1];
	}
	return this;
}


Vector.prototype.div = function(x, y) {
	if (x instanceof Vector) {
		if (x.x === 0 || x.y === 0) {
			console.warn('Vector div(): division by zero');
			throw new Error('Div by zero');
		}
		this.x /= x.x;
		this.y /= x.y;
		return this;
	}
	if (x instanceof Array) {
		if (x.some(element => element === 0)) {
			console.warn('Vector div(): division by zero');
			throw new Error('Div by zero');
		}
		if (x.length === 1) {
			this.x /= x[0];
			this.y /= x[0];
		}
		if (x.length === 2) {
			this.x /= x[0];
			this.y /= x[1];
		}
		return this;
	}

	const args = [...arguments];
	if (args.some(element => element === 0)) {
			console.warn('Vector div(): division by zero');
			throw new Error('Div by zero');
	}
	if (args.length === 1) {
		this.x /= args[0];
		this.y /= args[0];
	}
	if (args.length === 2) {
		this.x /= args[0];
		this.y /= args[1];
	}
	return this;
}


Vector.prototype.magSq = function(){
	return this.x * this.x + this.y * this.y;
}



Vector.prototype.mag = function() {
	return Math.sqrt(this.magSq());
}



Vector.prototype.dist = function(otherVector){
	return otherVector.copy().sub(this).mag();
}


Vector.prototype.normalize = function() {
	const len = this.mag();
	if (len !== 0){
		this.mult(1 / len);
	}
	return this;
}


Vector.prototype.limit = function(max) {
	const mSq = this.magSq();
	if (mSq > max * max) {
		this.div(Math.sqrt(mSq)).mult(max);
	}
	return this;
}


Vector.prototype.setMag = function(n){
	return this.normalize().mult(n);
}


// Vector.prototype.lerp = function(x, y, amt){
// 	if (x instanceof Vector) {
// 		return this.lerp(x.x, x.y, x.z, y)
// 	}
// 	this.x += (x - this.x) * amt || 0;
// 	this.y += (y - this.y) * amt || 0;
// 	return this;
// }


Vector.prototype.lerp = function(target, amnt){
	this.x = this.x * (1 - amnt) + target.x * amnt;
	this.y = this.y * (1 - amnt) + target.y * amnt;
	return this;
}

module.exports = Vector;