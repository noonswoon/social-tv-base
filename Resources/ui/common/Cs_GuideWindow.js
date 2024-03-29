function GuideWindow(_channelSelectionWin) {
	
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Guide');
	
	var ChannelInGuideWindow = require('ui/common/Cs_ChannelInGuideWindow');

	var channelsList = ['3','5','7','9','11','ThaiPBS'];
	//channel 3 as a default
	var displayChannel = new ChannelInGuideWindow('ch3',_channelSelectionWin);
 	
	var self = Ti.UI.createWindow({
		backgroundColor: 'pink'
	});

	var selectChannelToolbar = Ti.UI.createView({
		top: 0,
		height: 44,
		backgroundImage: 'images/ToolbarBG.png'
	});
	self.add(selectChannelToolbar);
	
	var selectChannelButton = Ti.UI.createButton({
		width: 41,
		height: 34,
		right: 10,
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		image: 'images/toolbar_button.png'
	});
	selectChannelToolbar.add(selectChannelButton);
	
	var pickChannelLabel = Ti.UI.createLabel({
		color: '#8c8c8c',
		width: 70,
		height: 50,
		right: 55,
		textAlign: 'right',
		text: L('PICK A CHANNEL'),
		font:{fontSize: 11}
	});
	selectChannelToolbar.add(pickChannelLabel);
	
	var selectChannelLabel = Ti.UI.createLabel({
		text: 'CH3',
		left: 20,
		font: {fontSize: 18, fontWeight: 'bold'},
		color: '#333'
	});
	selectChannelToolbar.add(selectChannelLabel);

	//Opacity window when picker is shown
	var opacityView = Ti.UI.createView({
		opacity : 0.6,
		top : 0,
		height : 120,
		zIndex : 7777,
		backgroundColor: '#000'
	});

	//Picker
	var picker_view = Titanium.UI.createView({
		height:251,
		bottom:-251,
		zIndex: 2
	});

	var cancel =  Titanium.UI.createButton({
		title:'Cancel',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});

	var done =  Titanium.UI.createButton({
		title:'Done',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});

	var spacer =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var toolbar =  Titanium.UI.iOS.createToolbar({
		top:0,
		zIndex: 3,
		items:[cancel,spacer,done]
	});

	var picker = Titanium.UI.createPicker({
		top:43
	});
	picker.selectionIndicator=true;
	
	for(var i=0;i<channelsList.length;i++) {
		var curChannel = channelsList[i];
		var row = Ti.UI.createPickerRow({
			width:100,
			heigth:100
		});

		var img = Ti.UI.createImageView({
			image:'images/channel/'+i+'.png',
			width:100,
			heigth:100,
			left: 10
		});
		
		var channelLabel = Ti.UI.createLabel({
			text: curChannel,
			width: 300,
			left: 100
		});
		row.add(channelLabel);
		row.add(img);
		picker.add(row);
	}

	picker_view.add(toolbar);
	picker_view.add(picker);

	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-251});

	self._enableOpenCheckinWindow = function() {
		displayChannel._enableOpenCheckinWindow();
	};

	selectChannelButton.addEventListener('click',function() {
		picker_view.animate(slide_in);
		self.add(opacityView);
	});

	cancel.addEventListener('click',function() {
		picker_view.animate(slide_out);
		self.remove(opacityView);
	});

	done.addEventListener('click',function() {
		picker_view.animate(slide_out);
		self.remove(opacityView);
	});
	
	picker.addEventListener('change',function(e){
		var index = e.rowIndex;
		if(index === 0){
			displayChannel._updateProgramContents('ch3');
			selectChannelLabel.text = 'CH3';
		}
		else if(index === 1){
			displayChannel._updateProgramContents('ch5');
			selectChannelLabel.text = 'CH5';	
		}
		else if(index === 2){
			displayChannel._updateProgramContents('ch7');			
			selectChannelLabel.text = 'CH7';	
		}
		else if(index === 3){
			displayChannel._updateProgramContents('ch9');			
			selectChannelLabel.text = 'CH9';
		}
		else if(index === 4){
			displayChannel._updateProgramContents('ch11');			
			selectChannelLabel.text = 'CH11';
		}
		else if(index === 5){
			displayChannel._updateProgramContents('pbs');			
			selectChannelLabel.text = 'ThaiPBS';
		}	
	});

	self.add(picker_view);
	self.add(displayChannel);	

	return self;
}
module.exports = GuideWindow;