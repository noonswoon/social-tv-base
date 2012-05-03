var PlaceholderWindow = function() {
	
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
	pWin.add(title);
	
	//
	// Login Button
	//
	Titanium.Facebook.appid = "197422093706392";
	Titanium.Facebook.permissions = ['publish_stream', 'read_stream'];
	
	var b1 = Ti.UI.createButton({
		title:'Run Query',
		width:200,
		height:40,
		top:10
	});
	pWin.add(b1);
	
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
					alert(r.error);
				} else {
					alert("call was unsuccessful");
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
	
	b1.addEventListener('click', function()
	{
		if (!Titanium.Facebook.loggedIn)
		{
			Ti.UI.createAlertDialog({title:'Facebook', message:'Login before running query'}).show();
			return;
		}
	
		runQuery();
	});

	
	return pWin;
	
};

module.exports = PlaceholderWindow;
