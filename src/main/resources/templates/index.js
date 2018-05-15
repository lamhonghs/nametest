var ACCESS_TOKEN = '';
var APP_ID = '226699394730535';
var USER_ID = '';
$(document).ready(function() {
    initFBSDK();

});
function initFBSDK() {
    $.ajaxSetup({ cache: true });
    $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
            appId: APP_ID,
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v3.0',
        });
        //$('#loginbutton,#feedbutton').removeAttr('disabled');
        FB.getLoginStatus(updateStatusCallback);
    });

}

function updateStatusCallback(data) {
    console.log('updateStatusCallback', data);
    ACCESS_TOKEN = data.authResponse.accessToken;
    USER_ID = data.authResponse.userID;
    initCanvas();
    initEvent();
}

function getProfileInfo() {
    var path = '/me';
    FB.api(path, 'get', {
        access_token: ACCESS_TOKEN,
        fields: 'id,name,email',
    }, function(response) {
        console.log(response);
        var rs = '';
        for(var key in response){
            rs += key;
            rs += ': ';
            rs += response[key];
            rs += '<br>';
        }
        $('.dataProfile').html(rs);
    })
}

function getAvatar() {
    var path = '/me';
    FB.api(path, 'get', {
        access_token: ACCESS_TOKEN,
        fields: 'picture',
    }, function(response) {
        var data = response.picture.data;
        var rs = img(data.url, data.width, data.height);
        $('.dataAvatar').html(rs);
    })
}

function getFriends() {
    var path = '/me';
    FB.api(path, 'get', {
        access_token: ACCESS_TOKEN,
        fields: 'friends{picture}',
    }, function(response) {
        var data = response.friends.data;
        for(var key in data){
            var item = data[key].picture.data;
            rs += key;
            rs += ': ';
            rs += img(item.url, item.width * 2, item.height * 2);
            rs += '<br>';
        }
        $('.dataFriend').html(data);
    })
}

function getPhoto() {
    // order asc: reverse_chronological, desc chronological
    var path = '/me';
    FB.api(path, 'get', {
        access_token: ACCESS_TOKEN,
        fields: 'albums{name,photos{id,link,images}}',
    }, function(response) {
        console.log(response);
        var rs = '';
        var albums = response.albums.data;
        if(albums) {
            for(var i = 0; i < albums.length; i++) {
                if(albums[i].photos) {
                    var photos = albums[i].photos.data;
                    for(var key in photos){
                        var item = photos[key];
                        rs += key;
                        rs += ': ';
                        rs += img(item.images[0].source, item.width, item.height);
                        rs += '<br>';
                    }
                }
            }
        }
        $('.photo').html(rs);
    })
}

function img(src, w, h) {
    return '<img src=' + src + ' width=' + w + ' height=' + h + '/>';
}

function initEvent() {
    $('#getProfileInfo').on('click', function() {
        getProfileInfo();
    });
    $('#getPhoto').on('click', function() {
        getPhoto();
    });
    $('#getAvatar').on('click', function() {
        getAvatar();
    });
    $('#getFriend').on('click', function() {
        getFriends();
    });
}

function initCanvas() {
    var canvas = new fabric.Canvas('canvas');
    var rect = new fabric.Rect({
        top : 100,
        left : 100,
        width : 60,
        height : 70,
        fill : 'red'
    });
    canvas.add(rect);
}