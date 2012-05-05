ReplyTableViewRow = function(table) {
	var row = Ti.UI.createTableViewRow({
		height: 30,
		allowsSelection: false,
		className: "ReplyTableViewRow",
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	row.contentLabel = Ti.UI.createLabel({
		text: '-',
		top: 5,
		left: 5,
		width: 310,
		height: 30,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	row.add(row.contentLabel);

	row.replyToolbar = Ti.UI.createView({
		left: 5,
		top: 35,
		width: 310,
		height: 60,
		visible: false
	});
	row.add(row.replyToolbar);
	
	row.replyTextField = Ti.UI.createTextField({
		left: 0,
		top: 0,
		width: 310,
		height: 20,
		hintText: "Reply here...",
    	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	row.replyToolbar.add(row.replyTextField);

	row.upButton = Ti.UI.createButton({
		left: 0,
		top: 25,
		width: 70,
		height: 20,
		title: 'Vote Up',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	row.replyToolbar.add(row.upButton);
	
	row.downButton = Ti.UI.createButton({
		left: 80,
		top: 25,
		width: 70,
		height: 20,
		title: 'Vote Down',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	row.replyToolbar.add(row.downButton);
	
	row.replyButton = Ti.UI.createButton({
		right: 0,
		top: 25,
		width: 70,
		height: 20,
		title: 'Reply',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	row.replyToolbar.add(row.replyButton);
	
	/** starting comments of comment **/
	
/*
	row.commentsOfComment = Ti.UI.createView({
		left: 5,
		top: 35,
		width: 350,
		height: 30 * 3
	});
	row.add(row.commentsOfComment);
	
	var coc1 = Ti.UI.createLabel({
		text: 'wait...',
		top: 0,
		left: 20,
		width: 350,
		height: 30,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	
	var coc2 = Ti.UI.createLabel({
		text: 'this Stanford person...will dominate Thailand and SEA!',
		top: 30*1+5,
		left: 20,
		width: 350,
		height: 30,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	
		var coc3 = Ti.UI.createLabel({
		text: 'Trush me..do you?',
		top: 30*2+5,
		left: 20,
		width: 100,
		height: 30,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	row.commentsOfComment.add(coc1);	
	row.commentsOfComment.add(coc2);	
	row.commentsOfComment.add(coc3);
	
	row.height = 30+row.commentsOfComment.height; //reset the height
*/		
/** end comments of comment section **/
	
	row._setReply = function(reply) {
		row.reply = reply;
		row.contentLabel.text = reply.content;
	};
	
	row._hideToolbar = function() {
		if (row.replyToolbar.visible == false) return;
		row.replyToolbar.visible = false;
		
		row.height -= row.replyToolbar.height;
	};
	
	row._showToolbar = function() {
		if (row.replyToolbar.visible == true) return;
		row.replyToolbar.visible = true;
		
		row.height += row.replyToolbar.height;
	};
	
	
	row.contentLabel.addEventListener('click', function() {
		if (table.shownRow != undefined) table.shownRow._hideToolbar();
		
		table.shownRow = row;
		table.shownRow._showToolbar();
		
		table.setData(table.data);
	});
	
	return row;
}
module.exports = ReplyTableViewRow;
