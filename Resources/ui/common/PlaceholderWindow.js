var PlaceholderWindow = function() {
	
	//SETUP 
	var acs = require('lib/acs');
	var Cloud = require('ti.cloud');
	Titanium.Facebook.appid = "197422093706392";
	Titanium.Facebook.permissions = ['publish_stream', 'read_stream', 'email'];

	//UI COMPONENTS DECLARATION
	var pWin = Ti.UI.createWindow({
		backgroundColor: '#ffff',
		top:16,
		width:'300dp',
		height:'400dp',
		borderWidth:2,
		borderRadius: 2, 
		borderColor:'#fff',
		backgroundColor:'#fff',
		layout:'vertical'
	});
	
	var title = Ti.UI.createLabel({
		text:'Anything here',
		top:5,
		width:Ti.UI.FILL,
		height:Ti.UI.SIZE,
		font: {
			fontWeight: 'bold',
			fontSize: '10'
		},
		textAlign: 'center',
		color:'black'
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
	pWin.add(title);
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
		        alert(e.result);
		        alert(JSON.parse(e.result).email);
		    } else if (e.error) {
		        alert(e.error);
		    } else {
		        alert('Unknown response');
		    }
		});
	});
	return pWin;
	
};

module.exports = PlaceholderWindow;
