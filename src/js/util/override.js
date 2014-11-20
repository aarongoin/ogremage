define(function() {
	
	return function(a, b) {
		switch (b.length) {
			case 1: return function() { b(a); };
			case 2: return function(a1) { b(a, a1); };
			case 3: return function(a1, a2) { b(a, a1, a2); };
			case 4: return function(a1, a2, a3) { b(a, a1, a2, a3); };
			case 5: return function(a1, a2, a3, a4) { b(a, a1, a2, a3, a4); };
			default: return function() { alert("failed to override function"); };
		}
	};
});