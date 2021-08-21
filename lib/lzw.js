var LZW = new (function() {
	// set to false to disable lzw encoding
	this.enable = true

	// Unicode support
	this.symbolsToUnicode = function(s) {
		return s.replaceAll(/([^ -ÿ])/g,(f)=>'\\' + f.charCodeAt(0).toString(16).padStart(4,0))
	}
	this.unicodeToSymbols = function(s) {
		return s.replaceAll(/\\([0-9a-f]{4})/g, (_,g)=>String.fromCharCode(parseInt(g,16)))
	}

	// LZW-compress
	this.encodeJson = function(json) {
		return LZW.encodeStr(JSON.stringify(json).replace(/"([a-zA-Z_]+[a-zA-Z0-9_]*)":/g,'$1:').slice(1,-1))
	}
	this.encodeStr = function(s) {
		if(!this.enable) {
			return s
		}
		const dict = {}
		const out = []
		let code = 256

		const data = LZW.symbolsToUnicode(s).split('')
		let phrase = data.shift()
		let currChar
		while((currChar=data.shift())) {
			if (dict[phrase + currChar] != null) {
				phrase += currChar
			} else {
				out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0))
				dict[phrase + currChar] = code
				code++
				phrase=currChar
			}
		}

		out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0))
		for (let i=0; i<out.length; i++) {
			out[i] = String.fromCharCode(out[i])
		}
		return 'lzw:' + out.join('')
	}

	// Decompress an LZW-encoded string
	this.decodeJson = function(lzwStr) {
		let str = LZW.decodeStr(lzwStr)
		if(!str.startsWith('{')) {
			str = '{' + str + '}'
		}
		str = str.replace(/([,{[])([a-zA-Z_]+[a-zA-Z0-9_]*):/g,'$1"$2":')
		return JSON.parse(str)
	}
	this.decodeStr = function(s) {
		if(!s.startsWith('lzw:')) {
			return s
		}

		const data = s.substring(4).split('')
		const dict = {}
		let currChar = data[0]
		let oldPhrase = currChar
		const out = [currChar]
		let code = 256
		let phrase

		for (let i=1; i<data.length; i++) {
			const currCode = data[i].charCodeAt(0)
			phrase = currCode < 256
				? data[i]
				: dict[currCode]
					? dict[currCode]
					: oldPhrase + currChar
			out.push(phrase)
			currChar = phrase.charAt(0)
			dict[code] = oldPhrase + currChar
			code++
			oldPhrase = phrase
		}
		return LZW.unicodeToSymbols(out.join(''))
	}
})()
