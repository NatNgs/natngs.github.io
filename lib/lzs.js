// Import needed libraries
if(!('LZString' in window)) {
	document.head.append('<script src="https://cdn.jsdelivr.net/gh/pieroxy/lz-string@1.4.4/libs/lz-string.js">')
}

var LZS = (function() {
	function JSONtoSmallStr(jsonObject) {
		return JSON.stringify(jsonObject).replace(/"([a-zA-Z0-9_]+)":/g,'$1:')
	}

	function JSONfromSmallStr(str) {
		return JSON.parse(str.replace(/([,{[])([a-zA-Z0-9_]+):/g,'$1"$2":'))
	}

	const LZS = {
		encodeJson: function(json) {
			return LZS.encodeStr(JSONtoSmallStr(json))
		},
		encodeStr: function(str) {
			return LZString.compressToUTF16(str)
		},

		decodeJson: function(lzsStr) {
			return JSONfromSmallStr(LZS.decodeStr(lzsStr))
		},
		decodeStr: function(lzsStr) {
			return LZString.decompressFromUTF16(lzsStr) || lzsStr
		},
	}

	return LZS
})()
