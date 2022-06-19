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
		/**
		 * Given no parameters:
		 * 	Returns a random float between 0 and 1 (0 included, 1 excluded)
		 *
		 * Given 2 parameters (min, max):
		 * 	Returns a random float between min and max (min included, max excluded)
		 */
		this.float = function(min=0, max=1) {
			return rng()*(max-min)+min
		}

		/**
		 * Given 1 parameter (m1):
		 * 	returns a random integer between 0 & m1 (included)

		 * Given 2 parameters (m1, m2):
		 * 	Returns a random integer between m1 & m2 (included)
		 */
		this.int = function(m1, m2) {
			if(m2 === undefined) {
				return this.float(0,m1+1)|0
			} else {
				return this.float(m1,m2+1)|0
			}
		}

		/**
		 * Given no parameters:
		 * 	Returns a random float following normal distribution (with mean 0 and standard deviation 1)
		 *
		 * Given 2 parameters (mean, stddev):
		 * 	Returns a random float following normal distribution
		 *
		 * Given 3 parameters (mean, stddev, skew):
		 * 	Returns a random float following normal distribution, with a skew
		 */
		this.normal = function(mean=0, stddev=1, skew=0) {
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

		/**
		 * Shuffles given array in place
		 * @return the array itself (for chaining)
		 */
		this.shuffle = function(array) {
			let j, t
			for (let i = array.length-1; i>0; i--) {
				j = this.int(i)
				t = array[i]
				array[i] = array[j]
				array[j] = t
			}
			return array
		}
	}

	const basicGenerator = new Generator(Math.random)
	this.float = basicGenerator.float
	this.int = basicGenerator.int
	this.normal = basicGenerator.normal
	this.shuffle = basicGenerator.shuffle

	this.newGenerator = function(seed) {
		const s = xmur3(''+seed)
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
