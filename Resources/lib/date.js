
function since(date) {

	var pluralize = function (base, number) {
		if (number == 1) return base;
		else return base + "s";
	}
	
	var blocks = [
		{ divisor: 1000, max: 60, name: 'sec' },
		{ divisor: 60, max: 60, name: 'min' },
		{ divisor: 60, max: 24, name: 'hr' },
		{ divisor: 24, max: 30, name: 'day' },
		{ divisor: 30, max: 12, name: 'mon' },
		{ divisor: 12, max: 100, name: 'year' }
	];

	var unit = (new Date() - date.getTime());	
	for (var i=0;i<blocks.length;i++) {
		unit = parseInt(unit / blocks[i].divisor);
		if (unit < blocks[i].max) {
			return unit + ' ' + pluralize(blocks[i].name,unit) + ' ago';
		}
	}
};
