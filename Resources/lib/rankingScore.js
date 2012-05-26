
function calculateRankingScore(_total, _positive) {
	if (_total == 0) return 0;
	
	var negavite = _total - _positive;
	var sumUpDown = _positive + negavite;
	if(sumUpDown == 0) return 0;
	
	var z = 1.0 //1.0 = 84%, 1.6=95%
	var phat = _positive/_total;
	return Math.sqrt(phat+z*z/(2*_total)-z*((phat*(1-phat)+z*z/(4*_total))/_total))/(1+z*z/_total);
};
