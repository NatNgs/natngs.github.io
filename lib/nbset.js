const MAX_DECAL = 6 // 2^6 = 64
const B64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-'
const NB_SORT = (a,b)=>(a>b?1:(a<b?-1:0))

var NB_SET = new (function() {
	this.add = function(nbset, ...toAdd) {
		for(let nb of toAdd) {
			const rnk = (nb/MAX_DECAL)|0
			while(rnk >= nbset.length) nbset.push(0)
			nbset[rnk] |= 1<<(nb - rnk*MAX_DECAL)
		}
		return nbset
	}
	this.rem = function(nbset, ...toRem) {
		for(let nb of toRem) {
			const rnk = (nb/MAX_DECAL)|0
			while(rnk >= nbset.length) nbset.push(0)
			nbset[rnk] &= ~(1<<(nb - rnk*MAX_DECAL))
		}
		return nbset
	}

	this.fromList = function(list) {
		return this.add([], ...list)
	}
	this.toList = function(nbset) {
		const list = []
		for(let i=0; i<nbset.length; i++) {
			for(let j=0; j<MAX_DECAL; j++) {
				if(nbset[i] & 1<<j) list.push(i*MAX_DECAL+j)
			}
		}
		return list
	}

	this.toPrintableASCII = function(nbset) {
		return nbset.map(i=>B64[i]).join('')
	}
	this.fromPrintableASCII = function(printable) {
		return !printable ? [] : printable.split('').map(c=>B64.indexOf(c))
	}
})()
