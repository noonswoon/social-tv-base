/*
 * A good example of caching images to the device.
 */
 
 /* example on how to use it
var win = Ti.UI.createWindow();
win.addEventListener("open", onOpen);
win.open();
 
function onOpen(e){ 
    get_remote_file("Wiki.png", "http://upload.wikimedia.org/wikipedia/en/b/bc/Wiki.png", onComplete, onProgress)
}
 
function onComplete(file){
    var img = Ti.UI.createImageView({
        image:  file.path + file.file
    });
    win.add(img);
}
function onProgress(progress){
    TI.API.info("progress being made " + progress);
}
*/ 

function get_remote_file(filename, url, fn_end, fn_progress ) {
    var file_obj = {file:filename, url:url, path: null};
    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
    if ( file.exists() ) {
        file_obj.path = Titanium.Filesystem.applicationDataDirectory+Titanium.Filesystem.separator;
        fn_end(file_obj);
    }
    else {
        if ( Titanium.Network.online ) {
            var c = Titanium.Network.createHTTPClient();
            c.setTimeout(10000);
            c.onload = function()
            {
                if (c.status == 200 ) {
                    var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
                    f.write(this.responseData);
                    file_obj.path = Titanium.Filesystem.applicationDataDirectory+Titanium.Filesystem.separator;
 
                }else{
                    file_obj.error = 'file not found'; // to set some errors codes
                }
                fn_end(file_obj);
            };
            c.ondatastream = function(e)
            {
                if ( fn_progress ) fn_progress(e.progress);
            };
            c.error = function(e)
            {
                file_obj.error = e.error;
                fn_end(file_obj);
            };
            c.open('GET',url);
            c.send();           
        }
        else {
            file_obj.error = 'no internet';
            fn_end(file_obj);
        }
    }
};