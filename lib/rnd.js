var RND = new (function() {
	const xmur3 = function(str) {
		for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
			h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
			h = h << 13 | h >>> 19
		}
		return function() {
			h = Math.imul(h ^ h >>> 16, 2246822507)
			h = Math.imul(h ^ h >>> 13, 3266489909)
			return (h ^= h >>> 16) >>> 0
		}
	}

	const Generator = function(rng) {
		this.float = function(min=0,max=1) {
			return rng()*(max-min)+min
		}
		this.int = function(min,max) {
			return this.float(min,max)|0
		}
		this.normal = function(mean=0, stddev=1, skew = 0) {
			let r1 = 0, r2 = 0;
			while (r1 <= 0) r1 = rng()
			while (r2 <= 0) r2 = rng()
			const R = Math.sqrt(-2.0 * Math.log(r1))
			const t = 2.0 * Math.PI * r2
			const u0 = R * Math.cos(t)
			const v = R * Math.sin(t)
			if (skew === 0) {
				return mean + stddev * u0
			}
			const s = skew / Math.sqrt(1 + skew * skew)
			const u1 = s * u0 + Math.sqrt(1 - s*s) * v
			const z = u0 >= 0 ? u1 : -u1
			return mean + stddev * z
		}
	}

	const basicGenerator = new Generator(Math.random)
	this.float = basicGenerator.float
	this.int = basicGenerator.int
	this.normal = basicGenerator.normal

	this.newGenerator = function(seed) {
		const s = xmur3(seed)
		let a=s(), b=s(), c=s(), d=s()
		let t = b << 9, r = a * 5
		return new Generator(() => {
			r = (r << 7 | r >>> 25) * 9
			c ^= a; d ^= b; b ^= c; a ^= d; c ^= t
			d = d << 11 | d >>> 21
			return (r >>> 0) / 4294967296
		})
	}

})()
