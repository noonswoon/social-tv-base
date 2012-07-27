var PlaceholderWindow = function(_parnetWindow) {
	
	
	//UI COMPONENTS DECLARATION
	var pWin = Ti.UI.createWindow({
		title: 'Random Stuff',
		backgroundColor: 'white',
		barColor: '#6d0a0c',
		layout: 'vertical'
	});

	var backBtn = Titanium.UI.createButton({
		title:'Back',
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	//#############PULL TO REFRESH
	function formatDate()
	{
		var date = new Date();
		var datestr = date.getMonth()+'/'+date.getDate()+'/'+date.getFullYear();
		if (date.getHours()>=12)
		{
			datestr+=' '+(date.getHours()==12 ? date.getHours() : date.getHours()-12)+':'+date.getMinutes()+' PM';
		}
		else
		{
			datestr+=' '+date.getHours()+':'+date.getMinutes()+' AM';
		}
		return datestr;
	}
	
	var data = [
		{title:"Row 1"},
		{title:"Row 2"},
		{title:"Row 3"}
	];
	
	var lastRow = 4;
	
	var tableView = Ti.UI.createTableView({
		data: data
	});
	
	pWin.add(tableView);
	
	var border = Ti.UI.createView({
		backgroundColor:"#576c89",
		height:2,
		bottom:0
	});
	
	var tableHeader = Ti.UI.createView({
		backgroundColor:"#e2e7ed",
		width:320,
		height:60
	});
	
	// fake it til ya make it..  create a 2 pixel
	// bottom border
	tableHeader.add(border);
	
	var arrow = Ti.UI.createView({
		backgroundImage:"../images/whiteArrow.png",
		width:23,
		height:60,
		bottom:10,
		left:20
	});
	
	var statusLabel = Ti.UI.createLabel({
		text:"Pull to reload",
		left:55,
		width:200,
		bottom:30,
		height:"auto",
		color:"#576c89",
		textAlign:"center",
		font:{fontSize:13,fontWeight:"bold"},
		shadowColor:"#999",
		shadowOffset:{x:0,y:1}
	});
	
	var lastUpdatedLabel = Ti.UI.createLabel({
		text:"Last Updated: "+formatDate(),
		left:55,
		width:200,
		bottom:15,
		height:"auto",
		color:"#576c89",
		textAlign:"center",
		font:{fontSize:12},
		shadowColor:"#999",
		shadowOffset:{x:0,y:1}
	});
	
	var actInd = Titanium.UI.createActivityIndicator({
		left:20,
		bottom:13,
		width:30,
		height:30
	});
	
	tableHeader.add(arrow);
	tableHeader.add(statusLabel);
	tableHeader.add(lastUpdatedLabel);
	tableHeader.add(actInd);
	
	tableView.headerPullView = tableHeader;
	
	
	var pulling = false;
	var reloading = false;
	
	function beginReloading()
	{
		// just mock out the reload
		setTimeout(endReloading,2000);
	}
	
	function endReloading()
	{
		// simulate loading
		for (var c=lastRow;c<lastRow+10;c++)
		{
			tableView.appendRow({title:"Row "+c});
		}
		lastRow += 10;
	
		// when you're done, just reset
		tableView.setContentInsets({top:0},{animated:true});
		reloading = false;
		lastUpdatedLabel.text = "Last Updated: "+formatDate();
		statusLabel.text = "Pull down to refresh...";
		actInd.hide();
		arrow.show();
	}
	
	tableView.addEventListener('scroll',function(e)
	{
		var offset = e.contentOffset.y;
		if (offset <= -65.0 && !pulling)
		{
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({transform:t,duration:180});
			statusLabel.text = "Release to refresh...";
		}
		else if (pulling && offset > -65.0 && offset < 0)
		{
			pulling = false;
			var t = Ti.UI.create2DMatrix();
			arrow.animate({transform:t,duration:180});
			statusLabel.text = "Pull down to refresh...";
		}
	});
	
	tableView.addEventListener('scrollEnd',function(e)
	{
		if (pulling && !reloading && e.contentOffset.y <= -65.0)
		{
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.text = "Reloading...";
			tableView.setContentInsets({top:60},{animated:true});
			arrow.transform=Ti.UI.create2DMatrix();
			beginReloading();
		}
	});
	
	//#######################
	var b1 = Ti.UI.createButton({
		title:'Run Query',
		width:200,
		height:40,
		top:10
	});
	
	var searchFriendsWithApp = Ti.UI.createButton({
		title:'FbFriends with an App',
		width:200,
		height:40,
		top:10
	});
	
	var graphAPI = Ti.UI.createButton({
		title:'GraphAPI Call',
		width:200,
		height:40,
		top:10
	});
	
	//ADDING UI COMPONENTS
	pWin.setLeftNavButton(backBtn);
	
	pWin.add(b1);
	pWin.add(searchFriendsWithApp);
	pWin.add(graphAPI);
	
	//FUNCTION CALLBACK
	function runQuery()
	{
		b1.title = 'Loading...';
	
		var tableView = Ti.UI.createTableView();
		var win = Ti.UI.createWindow({title:'Facebook Query'});
		win.add(tableView);
	
		// create close button on window nav
		var close = Titanium.UI.createButton({
			title:'Close'
		});
		
		close.addEventListener('click', function()
		{
			win.close();
		});
		
		if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
			win.setRightNavButton(close);
		}
	
		// run query, populate table view and open window
		var query = "SELECT uid, name, pic_square, status FROM user ";
		
		query +=  "where uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + ")";
		//query +=  "where uid IN (SELECT uid2 FROM friend WHERE uid1 = " + acs.getUserFbId() + ")";
		query += "order by last_name limit 10";
		Ti.API.info('user id ' + Titanium.Facebook.uid);
		//Ti.API.info('user id ' + acs.getUserFbId());
		Titanium.Facebook.request('fql.query', {query: query},  function(r)
		{
			if (!r.success) {
				if (r.error) {
					Ti.API.info(r.error);
				} else {
					Ti.API.info("call was unsuccessful");
				}
				return;
			}
			var result = JSON.parse(r.result);
			var data = [];
			for (var c=0;c<result.length;c++)
			{
				var row = result[c];
	
				var tvRow = Ti.UI.createTableViewRow({
					height:50,
					selectedBackgroundColor:'#fff',
					backgroundColor:'#fff'
				});
				var imageView;
				imageView = Ti.UI.createImageView({
					image:row.pic_square === null ? '../images/custom_tableview/user.png' : row.pic_square,
					left:10,
					width:40,
					height:40
				});
				tvRow.add(imageView);
	
				var userLabel = Ti.UI.createLabel({
					font:{fontSize:15, fontWeight:'bold'},
					left:60,
					height:20,
					width: 180,
					color:'#000',
					//backgroundColor: 'red',
					text:row.name
				});
				tvRow.add(userLabel);
	
				tvRow.uid = row.uid;
				data[c] = tvRow;
			}
			
			tableView.setData(data, { animationStyle : Titanium.UI.iPhone.RowAnimationStyle.DOWN });
			win.open({modal:true});
			b1.title = 'Run Query';
		});
	}
////	
	//EVENT REGISTERING
	backBtn.addEventListener('click',function() {
		pWin.close();
	});


	b1.addEventListener('click', function() {
		if (!Titanium.Facebook.loggedIn)
		{
			Ti.UI.createAlertDialog({title:'Chatterbox', message:L('Login before running query')}).show();
			return;
		}
		runQuery();
	});	
	
	searchFriendsWithApp.addEventListener('click', function() { 
			Cloud.SocialIntegrations.searchFacebookFriends(function (e) {
			    if (e.success) {
			        Ti.API.info('Friends Count: ' + e.users.length);
			        for (var i = 0; i < e.users.length; i++) {
			        	if(e.users.length==0) break;
			            var user = e.users[i];
			            // alert('id: ' + user.id + '\\n' +
			                // 'first name: ' + user.first_name + '\\n' +
			                // 'last name: ' + user.last_name);
			         }
			    } else {
			        Ti.API.info('searchFriendsWithApp Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
		});
////		
	graphAPI.addEventListener('click', function() {
		Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
		    if (e.success) {
		        Ti.API.info(JSON.stringify(e));
		    } else if (e.error) {
		       	Ti.API.info(JSON.stringify(e));
		    } else {
		        Ti.API.info('Unknown response');
		    }
		});
	});
	return pWin;
	
};

module.exports = PlaceholderWindow;
