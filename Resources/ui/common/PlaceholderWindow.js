var PlaceholderWindow = function() {
	
	
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
	
	var fbExplHeader = Ti.UI.createLabel({
		top: 5,
		left: 5,
		textAlign: 'center',
		font: { fontSize: 20, fontFamily: 'Helvetica Neue', fontWeight:'bold'},
		text: 	'Why we use Facebook'
	});
	
	var fbExplPrelim = Ti.UI.createLabel({
		top: 5,
		left: 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'Using Facebook as our login system helps improve the user experience in a number of ways:'
	});
	
	var fbExplFirst = Ti.UI.createLabel({
		top: 5,
		left: 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'1.) It makes it super fast to sign up and create a Chatterbox profile'
	});
	
	var fbExplSecond = Ti.UI.createLabel({
		top: 5,
		left: 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'2.) It allows you to see what friends you have in common with other Chatterbox users'
	});
	
	var fbExplThird = Ti.UI.createLabel({
		top: 5,
		left: 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'3.) It helps ensure that people are using their real identities'
	});
	
	var fbExplConclude = Ti.UI.createLabel({
		top: 5,
		left: 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'We really want to earn your trust and we will not auto-post to your account or misuse your personal information in any way.'
	});
	
	var fbExplContact = Ti.UI.createLabel({
		top: 5,
		left: 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 'Please let us know if you\'d like more login options or have feedback on this. Thanks!'
	});
	
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
	pWin.add(fbExplHeader);
	pWin.add(fbExplPrelim);
	pWin.add(fbExplFirst);
	pWin.add(fbExplSecond);
	pWin.add(fbExplThird);
	pWin.add(fbExplConclude);
	pWin.add(fbExplContact);
	
	pWin.add(b1);
	pWin.add(searchFriendsWithApp);
	pWin.add(graphAPI);
	
	//FUNCTION CALLBACK
	function runQuery()
	{
		b1.title = 'Loading...';
	
		var tableView = Ti.UI.createTableView({minRowHeight:100});
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
		query += "order by last_name limit 20";
		Ti.API.info('user id ' + Titanium.Facebook.uid);
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
					height:'auto',
					selectedBackgroundColor:'#fff',
					backgroundColor:'#fff'
				});
				var imageView;
				imageView = Ti.UI.createImageView({
					image:row.pic_square === null ? '../images/custom_tableview/user.png' : row.pic_square,
					left:10,
					width:50,
					height:50
				});
				tvRow.add(imageView);
	
				var userLabel = Ti.UI.createLabel({
					font:{fontSize:16, fontWeight:'bold'},
					left:70,
					top:5,
					right:5,
					height:20,
					color:'#576996',
					text:row.name
				});
				tvRow.add(userLabel);
	
				var statusLabel = Ti.UI.createLabel({
					font:{fontSize:13},
					left:70,
					top:25,
					right:20,
					height:'auto',
					color:'#222',
					text:(!row.status || !row.status.message ? 'No status message' : row.status.message)
				});
				tvRow.add(statusLabel);
				tvRow.uid = row.uid;
				data[c] = tvRow;
			}
			
			tableView.setData(data, { animationStyle : Titanium.UI.iPhone.RowAnimationStyle.DOWN });
			win.open({modal:true});
			b1.title = 'Run Query';
		});
	}
	
	//EVENT REGISTERING
	backBtn.addEventListener('click',function() {
		pWin.close();
	});


	b1.addEventListener('click', function()
	{
		if (!Titanium.Facebook.loggedIn)
		{
			Ti.UI.createAlertDialog({title:'Chatterbox', message:'Login before running query'}).show();
			return;
		}
		runQuery();
	});	
	
	searchFriendsWithApp.addEventListener('click', function() { 
			Cloud.SocialIntegrations.searchFacebookFriends(function (e) {
			    if (e.success) {
			        Ti.API.info('Friends Count: ' + e.users.length);
			        for (var i = 0; i < e.users.length; i++) {
			            var user = e.users[i];
			            alert('id: ' + user.id + '\\n' +
			                'first name: ' + user.first_name + '\\n' +
			                'last name: ' + user.last_name);
			         }
			    } else {
			        Ti.API.info('searchFriendsWithApp Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
		});
		
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
