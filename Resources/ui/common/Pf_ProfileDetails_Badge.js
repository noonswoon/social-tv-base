var ProfileBadgeView = function(){
	var badgeExp = 2;
	var badgeView = Ti.UI.createView();
	
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			var badgeImg = Ti.UI.createImageView({
				height: 100,
				width: 100,
				left: (j*100)+5,
			});
			if(badgeExp>0){
				badgeImg.image = 'images/badge.png';
				badgeExp--;}
			else {
				badgeImg.image = 'images/lockbadge.png';
				}
			badgeImg.top = (i*100)+5;
			badgeView.add(badgeImg);
		};

	};
	
return badgeView;
}

module.exports = ProfileBadgeView;