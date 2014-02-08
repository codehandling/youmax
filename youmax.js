	var youTubeChannelURL = "";
	var youTubePlaylistURL = "";
	var youmaxDefaultTab = "featured";
	var youmaxColumns = 2;	
	var youmaxWidgetWidth = 640;
	var youmaxWidgetHeight = "";
	var showFeaturedVideoOnLoad = false;
	var showVideoInLightbox = true;

	/*
	if(null==youmaxColumns||youmaxColumns==""||youmaxColumns=="undefined")
		var youmaxColumns = 2;
		
	if(null==youmaxWidgetWidth||youmaxWidgetWidth==""||youmaxWidgetWidth=="undefined")
		var youmaxWidgetWidth = 640;

	if(null==showFeaturedVideoOnLoad||showFeaturedVideoOnLoad==""||showFeaturedVideoOnLoad=="undefined")
		var showFeaturedVideoOnLoad = false;
	
	if(!showFeaturedVideoOnLoad)
		showFeaturedVideoOnLoad=false;
	
	if (typeof showVideoInLightbox !== 'undefined') {
		if(null!=showVideoInLightbox&&showVideoInLightbox)
			showFeaturedVideoOnLoad=false;
		else
			showVideoInLightbox=false;
	} else {
		var showVideoInLightbox = false;
		if(!showFeaturedVideoOnLoad)
			showVideoInLightbox = true;
	}
*/
	if (typeof youmaxWidgetHeight !== 'undefined') {
		//alert('youmaxWidgetHeight defined');
		if(null!=youmaxWidgetHeight&&youmaxWidgetHeight!=""&&youmaxWidgetHeight!="undefined")
			$('html > head').append('<style>#youmax{overflow-y:auto;height:'+youmaxWidgetHeight+'px;}</style>');	
	}
	
	var youmaxUser;
	var youmaxFeaturedPlaylistId;
	var youtubeMqdefaultAspectRatio = 300/180;
	var youtubeVideoAspectRatio = 640/360;

	
	function secondsToTime(duration) {
		if(null==duration||duration==""||duration=="undefined")
			return "?";

		var minutes = Math.floor(duration/60);
		//alert(minutes);
		
		var seconds = duration%60;

		if(seconds<10)
			seconds = "0"+seconds;
			
		var time = minutes+":"+seconds;
		return time;
		//alert()
		
	}

	function getDateDiff(timestamp) {
		if(null==timestamp||timestamp==""||timestamp=="undefined")
			return "?";
		//alert(timestamp);
		var splitDate=((timestamp.toString().split('T'))[0]).split('-');
		var d1 = new Date();		
		
		var d1Y = d1.getFullYear();
        var d2Y = parseInt(splitDate[0],10);
        var d1M = d1.getMonth();
        var d2M = parseInt(splitDate[1],10);

        var diffInMonths = (d1M+12*d1Y)-(d2M+12*d2Y);
		/*alert(d1Y);
		alert(d2Y);
		alert(d1M);
		alert(d2M);
		alert(diffInMonths);
		*/
		if(diffInMonths<=1)
			return "1 month";
		else if(diffInMonths<12)
			return  diffInMonths+" months";
		
		var diffInYears = Math.floor(diffInMonths/12);
		
		if(diffInYears<=1)
			return "1 year";
		else if(diffInYears<12)
			return  diffInYears+" years";

	}
	
	function getReadableNumber(number) {
		if(null==number||number==""||number=="undefined")
			return "?";
			
		number=number.toString();
		var readableNumber = '';
		var count=0;
		for(var k=number.length; k>=0;k--) {
			readableNumber+=number.charAt(k);
			if(count==3&&k>0) {
				count=1;
				readableNumber+=',';
			} else {
				count++;
			}
		}
		return readableNumber.split("").reverse().join("");
	}
	
		
	function loadYoumax() {		
		$('#youmax').append('<div id="youmax-header"><div id="youmax-stat-holder"></div></div>');

		$('#youmax').append('<div id="youmax-tabs"><span id="youmax-featured" class="youmax-tab">Featured</span><span id="youmax-uploads" class="youmax-tab">Uploads</span><span id="youmax-playlists" class="youmax-tab">Playlists</span></div>');
		
		$('#youmax').append('<div id="youmax-encloser"><iframe id="youmax-video" width="'+(youmaxWidgetWidth-2)+'" height="'+(youmaxWidgetWidth/youtubeVideoAspectRatio)+'" src="" frameborder="0" allowfullscreen></iframe><div id="youmax-video-list-div"></div></div>');
		
		$('#youmax-video').hide();
		
		$('#youmax').append('<div id="youmax-lightbox"><div style="width:100%; position:absolute; top:20%;"><iframe id="youmax-video-lightbox" width="640" height="360" src="" frameborder="0" allowfullscreen></iframe></div></div>');
		
		$('#youmax-lightbox').hide();
	}
		
	
		$(document).ready(function() {
		
			var style = '<style>.youmax-showing {color:black;font-weight:normal;}.youmax-duration {background-color: black;color: white;padding: 2px 3px;font-weight: bold;position: absolute;bottom: 0;right: 0;opacity: 0.8;}#youmax-header {background-color:rgb(53,53,53);font:24px Arial;color:white;line-height:25px;height:90px;text-align:left;border: 1px solid rgb(53,53,53);}.youmax-stat {float:right;margin:10px;font:10px Arial;color:#ccc;margin-top: 25px;text-align: center;}#youmax-stat-holder {float:right;height:100%;}.youmax-stat-count {font: 18px Arial;}#youmax-channel-desc {text-align:left;}#youmax {width:'+youmaxWidgetWidth+'px;background-color: rgb(230,230,230);margin:0px auto;font-family: Calibri;font-size: 14px;text-align:center; overflow-x:hidden;}.youmax-video-tnail {width:100%; background-repeat:no-repeat; background-size:cover;height:180px;position: relative;}.youmax-video-tnail-box {width:46%;margin:2%;float:left;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 1px 3px rgba(0, 0, 0, 0.2);cursor:pointer;cursor:hand;}#youmax-encloser {border-left: 1px solid #cccccc;border-right: 1px solid #cccccc;border-bottom: 1px solid #cccccc;}#youmax-video-list-div {width:100%;text-align:left;display: inline-block;background-color:rgb(230,230,230);	}.youmax-video-list-title {color:#438bc5;display: inline-block;padding:2% 10px; padding-bottom: 0px;font-weight:bold;max-width:250px;max-height:18px;overflow:hidden;}.youmax-video-list-views {color:#555;padding:1% 10px; padding-bottom: 3%;display:inline-block;font-size:12px;}.youmax-playlist-sidebar {background-color:rgba(0,0,0,0.8);float:right;max-width:50%;height:100%;color:white;text-align:center;}.youmax-playlist-video-count {	display:inline-block;margin:3%;margin-top:5%;height:20%;}.youmax-playlist-sidebar-video {opacity:1;width:64px;height:20%;background-color:rgb(114,114,114);display:inline-block;margin:2% auto;background-size:cover;background-position: center center;background-repeat:no-repeat;}.youmax-tab {background-color:rgb(230,230,230);color:#666;text-shadow:0 1px 0 #fff;display: inline-block;margin: 5px;margin-top: 10px;padding: 5px;cursor:pointer;cursor:hand;}#youmax-tabs {text-align:left;background-color:rgb(230,230,230);padding-left: 10px;border-left: 1px solid #cccccc;border-right: 1px solid #cccccc;}#youmax-lightbox {position:fixed;background-color:rgba(0,0,0,0.9);z-index:100;width:100%;height:100%;left:0;top:0;}#youmax-video-lightbox {opacity:1;}</style>';
			$('html > head').append(style);		

			var style='<style>::-webkit-scrollbar {width: 10px;}::-webkit-scrollbar-button {display:none;}::-webkit-scrollbar-track-piece {background: #888}::-webkit-scrollbar-thumb {background: #eee}</style>';
			$('html > head').append(style);		

			//prepareYoumax();
			
		});

		function prepareYoumax() {
			$('#youmax').empty();
			
			if(youTubeChannelURL.indexOf("youtube.com/user/")!=-1) {
				if(null!=youTubeChannelURL&&youTubeChannelURL.indexOf("?feature")!=-1)
					youmaxUser = youTubeChannelURL.substring(youTubeChannelURL.indexOf("youtube.com/user/")+17,youTubeChannelURL.indexOf("?feature"));
				else
					youmaxUser = youTubeChannelURL.substring(youTubeChannelURL.indexOf("youtube.com/user/")+17);
			}

			
			loadYoumax();
			showLoader();
			
			$('.youmax-tab').click(function(){
				$('.youmax-tab').css('color','#666');
				$('.youmax-tab').css('background-color','rgb(230,230,230)');
				$('.youmax-tab').css('text-shadow','0 1px 0 #fff');

				$(this).css('color','#eee');
				$(this).css('background-color','#999');
				$(this).css('text-shadow','0 0');
				
				youmaxTabId = this.id;
				
				if(youmaxTabId=="youmax-featured")
					initFeaturedVideos();
				if(youmaxTabId=="youmax-uploads")
					getUploads();
				if(youmaxTabId=="youmax-playlists")
					getPlaylists();
			});
			
			
			if(typeof youmaxDefaultTab === 'undefined'||null==youmaxDefaultTab||youmaxDefaultTab==""||youmaxDefaultTab=="undefined") {
				$("#youmax-featured").click();
			} else if(youmaxDefaultTab.toUpperCase()=='UPLOADS'||youmaxDefaultTab.toUpperCase()=='UPLOAD') {
				$("#youmax-uploads").click();
			} else if(youmaxDefaultTab.toUpperCase()=='PLAYLISTS'||youmaxDefaultTab.toUpperCase()=='PLAYLIST') {
				$("#youmax-playlists").click();
			} else {
				$("#youmax-featured").click();
			}
		
			var apiProfileURL = "http://gdata.youtube.com/feeds/api/users/"+youmaxUser+"?v=2&alt=json";

			$.ajax({
				url: apiProfileURL,
				type: "GET",
				async: true,
				cache: true,
				dataType: 'jsonp',
				success: function(response) { showInfo(response);},
				error: function(html) { alert(html); },
				beforeSend: setHeader
			});		
		}
		
		
        function setHeader(xhr) {
			if(xhr && xhr.overrideMimeType) {
				xhr.overrideMimeType("application/j-son;charset=UTF-8");
			}
        }
		
		function showLoader() {
			$('#youmax-video-list-div').empty();
			$('#youmax-video').hide();
			$('#youmax-video').attr('src','');
			$('#youmax-video-list-div').append('<div style="text-align:center; height:200px; font:14px Calibri;"><br><br><br><br><br><br>loading...</div>');
		}
		
		function initFeaturedVideos() {
			if(null!=youmaxFeaturedPlaylistId&&youmaxFeaturedPlaylistId!=""&&youmaxFeaturedPlaylistId!="undefined") {
				getFeaturedVideos(youmaxFeaturedPlaylistId);
			}else {
				if(typeof youTubePlaylistURL === 'undefined'||null==youTubePlaylistURL||youTubePlaylistURL==""||youTubePlaylistURL=="undefined") {
					youmaxFeaturedPlaylistId = getFeaturedPlaylistId();
				} else if(null!=youTubePlaylistURL&&youTubePlaylistURL.indexOf("youtube.com/playlist?list=")!=-1) {
					youmaxFeaturedPlaylistId = youTubePlaylistURL.substring(youTubePlaylistURL.indexOf("youtube.com/playlist?list=")+26);
					getFeaturedVideos(youmaxFeaturedPlaylistId);
				}
			}
		}
		
		function getFeaturedVideos(playlistId) {
			showLoader();
			var apiFeaturedPlaylistVideosURL = "http://gdata.youtube.com/feeds/api/playlists/"+playlistId+"?v=2&alt=jsonc&max-results=50";
			$.ajax({
				url: apiFeaturedPlaylistVideosURL,
				type: "GET",
				async: true,
				cache: true,
				dataType: 'jsonp',
				success: function(response) {
												showPlaylistVideos(response);
												if(showFeaturedVideoOnLoad) {
													//alert(showFeaturedVideoOnLoad);
													$('.youmax-video-tnail-box:first').click();
												}
											},
				error: function(html) { alert(html); },
				beforeSend: setHeader
			});
		}
		
		function getUploads() {
			showLoader();
			var apiUploadURL = "http://gdata.youtube.com/feeds/api/users/"+youmaxUser+"/uploads/?v=2&alt=jsonc&max-results=50";
			$.ajax({
				url: apiUploadURL,
				type: "GET",
				async: true,
				cache: true,
				dataType: 'jsonp',
				success: function(response) { showUploads(response);},
				error: function(html) { alert(html); },
				beforeSend: setHeader
			});
		}
		
		function getFeaturedPlaylistId() {
			showLoader();
			var apiPlaylistURL = "https://gdata.youtube.com/feeds/api/users/"+youmaxUser+"/playlists?v=2&alt=jsonc&max-results=1";	
			$.ajax({
				url: apiPlaylistURL,
				type: "GET",
				async: false,
				cache: false,
				dataType: 'jsonp',
				success: function(response) {
												youmaxFeaturedPlaylistId=response.data.items[0].id; 
												//console.log(response);
												getFeaturedVideos(youmaxFeaturedPlaylistId);
											},
				error: function(html) { alert(html); },
				beforeSend: setHeader
			});
		}
		
		
		function getPlaylists() {
			showLoader();
			var apiPlaylistURL = "https://gdata.youtube.com/feeds/api/users/"+youmaxUser+"/playlists?v=2&alt=jsonc&max-results=50";	
			$.ajax({
				url: apiPlaylistURL,
				type: "GET",
				async: true,
				cache: true,
				dataType: 'jsonp',
				success: function(response) { showPlaylists(response);},
				error: function(html) { alert(html); },
				beforeSend: setHeader
			});
		}
		
		
		function getTopVideosFromPlaylist(playlistIdArray,maxTopVideos) {
		
			for(var i=0; i<playlistIdArray.length; i++) {			
				playlistId = playlistIdArray[i];

				apiPlaylistVideosURL = "http://gdata.youtube.com/feeds/api/playlists/"+playlistId+"?v=2&alt=jsonc&max-results="+maxTopVideos;
				$.ajax({
					url: apiPlaylistVideosURL,
					type: "GET",
					async: true,
					cache: true,
					dataType: 'jsonp',
					success: function(response) { showTopVideosOfPlaylists(response);},
					error: function(html) { alert(html); },
					beforeSend: setHeader
				});
			}
		
		}
		
		function showTopVideosOfPlaylists(response) {
			//console.log(response);
			var playlistId = response.data.id;
			var playlistVideoArray = response.data.items;
			//alert(playlistVideoArray.length);
			for(var j=1; j<playlistVideoArray.length; j++) {
				videoTnail = playlistVideoArray[j].video.thumbnail;
				if(null!=videoTnail&&videoTnail!=""&&videoTnail!="undefined") {
					videoTnail = videoTnail.hqDefault;
					videoTnail = videoTnail.replace("hqdefault","mqdefault");
				}
				$('#youmax-playlist-sidebar-'+playlistId).append('<div class="youmax-playlist-sidebar-video" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoTnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoTnail+'\')"></div>');
			}
			
			var youmaxTnailHeight = $('.youmax-playlist-sidebar-video').css('height');
			youmaxTnailHeight=youmaxTnailHeight.substring(0,youmaxTnailHeight.indexOf("px"));
			var youmaxTnailWidth = youtubeMqdefaultAspectRatio*youmaxTnailHeight;
			//$('html > head').append('<style>.youmax-playlist-sidebar-video{width:'+youmaxTnailWidth+'px;}</style>');	
			//$('html > head').append('<style>.youmax-playlist-sidebar{width:'+(youmaxTnailWidth+20)+'px;}</style>');	
			$('div.youmax-playlist-sidebar-video').css({'width':youmaxTnailWidth+'px'});
			$('div.youmax-playlist-sidebar').css({'width':(youmaxTnailWidth+20)+'px'});

			
			//console.log(youmaxTnailWidth);
			//console.log(youmaxTnailHeight);

			
		}

		function showInfo(response) {
			//console.log(response);

			var channelName = response.entry.yt$username.display;
			var channelPic = response.entry.media$thumbnail.url;
			var channelSubscribers = response.entry.yt$statistics.subscriberCount;
			var channelViews = response.entry.yt$statistics.totalUploadViews;
			var channelDesc = response.entry.summary.$t;
			
			
			
			
			$('#youmax-header').append('<img style="vertical-align:middle; height:60px; margin: 15px; display:inline-block;" src="'+channelPic+'"/>'+channelName);
			
			$('#youmax-header').append('&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="http://www.youtube.com/subscription_center?add_user='+youmaxUser+'"><img style="vertical-align:middle;height:60px;" src="http://s.ytimg.com/yt/img/creators_corner/Subscribe_to_my_videos/YT_Subscribe_64x64_red.png" alt="Subscribe to me on YouTube"/></a>');
			
			//$('#youmax-stat-holder').append('<div class="youmax-stat">'+channelSubscribers+'<br/> subscribers </div><div class="youmax-stat">'+channelViews+'<br/>video views</div>');
			$('#youmax-stat-holder').append('<div class="youmax-stat"><span class="youmax-stat-count">'+getReadableNumber(channelViews)+'</span><br/> video views </div><div class="youmax-stat"><span class="youmax-stat-count">'+getReadableNumber(channelSubscribers)+'</span><br/>subscribers</div>');
			
			$('#youmax-channel-desc').append('About '+channelName+'<br/>'+channelDesc);
			
		}
		
		function showPlaylists(response) {
			//console.log(response);
			
			$('#youmax-video-list-div').empty();
			var playlistArray = response.data.items;
			var playlistIdArray = [];
			var zeroPlaylistCompensation = 0;
			for(var i=0; i<playlistArray.length; i++) {
				playListId = playlistArray[i].id;
				playlistSize = playlistArray[i].size;
				if(playlistSize<=0){
					zeroPlaylistCompensation++;
					continue;
				}				
				playlistIdArray.push(playListId);
				playlistTitle = playlistArray[i].title;
				playlistUploaded = playlistArray[i].created;
				playlistThumbnail = playlistArray[i].thumbnail.hqDefault;
				playlistThumbnail = playlistThumbnail.replace("hqdefault","mqdefault");
				if((i-zeroPlaylistCompensation)%youmaxColumns!=0)
					$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%;" id="'+playListId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+playlistThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+playlistThumbnail+'\')"><div class="youmax-playlist-sidebar" id="youmax-playlist-sidebar-'+playListId+'"><span class="youmax-playlist-video-count"><b>'+playlistSize+'</b><br/>videos</span></div></div><span class="youmax-video-list-title">'+playlistTitle+'</span><br/><span class="youmax-video-list-views">'+playlistSize+' videos | '+getDateDiff(playlistUploaded)+' ago</span></div>');
				else
					$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%; clear:both;" id="'+playListId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+playlistThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+playlistThumbnail+'\')"><div class="youmax-playlist-sidebar" id="youmax-playlist-sidebar-'+playListId+'"><span class="youmax-playlist-video-count"><b>'+playlistSize+'</b><br/>videos</span></div></div><span class="youmax-video-list-title">'+playlistTitle+'</span><br/><span class="youmax-video-list-views">'+playlistSize+' videos | '+getDateDiff(playlistUploaded)+' ago</span></div>');
					
			}
				//console.log(playlistIdArray);
				
			$('.youmax-video-tnail-box').click(function(){
				//alert(this.id);
				getPlaylistVideos(this.id);
			});
			
			var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
			youmaxTnailWidth=youmaxTnailWidth.substring(0,youmaxTnailWidth.indexOf("px"));
			var youmaxTnailHeight = youmaxTnailWidth/youtubeMqdefaultAspectRatio;
			//$('html > head').append('<style>.youmax-video-tnail{height:'+youmaxTnailHeight+'px;}</style>');	
			$('div.youmax-video-tnail').css({'height':youmaxTnailHeight+'px'});
			
			
			if(youmaxTnailHeight<130) {
				maxTopVideos = 3;
				$('html > head').append('<style>.youmax-playlist-video-count{margin: 10%;margin-top: 15%;}.youmax-playlist-sidebar-video{margin: 8% auto;}</style>');	
				//$('div.youmax-playlist-video-count').css({'margin':'10%','margin-top':'15%'});
				//$('div.youmax-playlist-sidebar-video').css({'margin':'8% auto'});
			} else {
				maxTopVideos = 4;
			}
			
			//console.log(youmaxTnailWidth);
			//console.log(youmaxTnailHeight);

			getTopVideosFromPlaylist(playlistIdArray,maxTopVideos);
		}
		
		function showUploads(response) {
			//console.log(response);

			$('#youmax-video-list-div').empty();
			
			var uploadsArray = response.data.items;
			
			for(var i=0; i<uploadsArray.length; i++) {
				videoId = uploadsArray[i].id;
				videoTitle = uploadsArray[i].title;
				videoViewCount = uploadsArray[i].viewCount;
				videoDuration = uploadsArray[i].duration;				
				videoUploaded = uploadsArray[i].uploaded;
				videoThumbnail = uploadsArray[i].thumbnail.hqDefault;
				videoThumbnail = videoThumbnail.replace("hqdefault","mqdefault");
				if(i%youmaxColumns!=0)
					$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration">'+secondsToTime(videoDuration)+'</div></div><span class="youmax-video-list-title">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getReadableNumber(videoViewCount)+' views | '+getDateDiff(videoUploaded)+' ago</span></div>');
				else
					$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%; clear:both;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration">'+secondsToTime(videoDuration)+'</div></div><span class="youmax-video-list-title">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getReadableNumber(videoViewCount)+' views | '+getDateDiff(videoUploaded)+' ago</span></div>');

			}
			
			$('.youmax-video-tnail-box').click(function(){
				//alert(this.id);
				//alert(showVideoInLightbox);
				if(showVideoInLightbox){
					showVideoLightbox(this.id);
				} else {
					$('#youmax-video').attr('src','http://www.youtube.com/embed/'+this.id);
					$('#youmax-video').show();
					$('html,body').animate({scrollTop: $("#youmax-header").offset().top},'slow');
				}
			});
			
			var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
			youmaxTnailWidth=youmaxTnailWidth.substring(0,youmaxTnailWidth.indexOf("px"));
			var youmaxTnailHeight = youmaxTnailWidth/youtubeMqdefaultAspectRatio;
			//$('html > head').append('<style>.youmax-video-tnail{height:'+youmaxTnailHeight+'px;}</style>');	
			$('div.youmax-video-tnail').css({'height':youmaxTnailHeight+'px'});

			

		}
		
		function getPlaylistVideos(playlistId) {
			showLoader();
			apiPlaylistVideosURL = "http://gdata.youtube.com/feeds/api/playlists/"+playlistId+"?v=2&alt=jsonc&max-results=50";
			$.ajax({
				url: apiPlaylistVideosURL,
				type: "GET",
				async: true,
				cache: true,
				dataType: 'jsonp',
				success: function(response) { showPlaylistVideos(response);},
				error: function(html) { alert(html); },
				beforeSend: setHeader
			});
		}
		
		function showPlaylistVideos(response) {
			//console.log(response);
			$('#youmax-video-list-div').empty();
			$('#youmax-video-list-div').append('<span class="youmax-video-list-title" style="max-width:100%;"><span class="youmax-showing">&nbsp;&nbsp;Showing playlist: </span>'+response.data.title+'</span><br/>');
			var videoArray = response.data.items;
			
			//alert(videoArray.length);

			for(var i=0; i<videoArray.length; i++) {
				videoId = videoArray[i].video.id;
				videoTitle = videoArray[i].video.title;
				videoViewCount = videoArray[i].video.viewCount;
				videoDuration = videoArray[i].video.duration;
				videoThumbnail = videoArray[i].video.thumbnail;
				videoUploaded = videoArray[i].video.uploaded;
				if(null!=videoThumbnail&&videoThumbnail!=""&&videoThumbnail!="undefined") {
					videoThumbnail = videoThumbnail.hqDefault;
					videoThumbnail = videoThumbnail.replace("hqdefault","mqdefault");
				} else {
					
				}
				//alert(secondsToTime(videoDuration));
				if(i%youmaxColumns!=0)
					$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration">'+secondsToTime(videoDuration)+'</div></div><span class="youmax-video-list-title">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getReadableNumber(videoViewCount)+' views | '+getDateDiff(videoUploaded)+' ago</span></div>');
				else
					$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%; clear:both;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration">'+secondsToTime(videoDuration)+'</div></div><span class="youmax-video-list-title">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getReadableNumber(videoViewCount)+' views | '+getDateDiff(videoUploaded)+' ago</span></div>');

			}

			$('.youmax-video-tnail-box').click(function(){
				//alert(this.id);
				//alert(showVideoInLightbox);
				if(showVideoInLightbox){
					showVideoLightbox(this.id);
				} else {
					$('#youmax-video').attr('src','http://www.youtube.com/embed/'+this.id);
					$('#youmax-video').show();
					$('html,body').animate({scrollTop: $("#youmax-header").offset().top},'slow');
				}
			});
			
			var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
			youmaxTnailWidth=youmaxTnailWidth.substring(0,youmaxTnailWidth.indexOf("px"));
			var youmaxTnailHeight = youmaxTnailWidth/youtubeMqdefaultAspectRatio;
			//$('html > head').append('<style>.youmax-video-tnail{height:'+youmaxTnailHeight+'px;}</style>');	
			$('div.youmax-video-tnail').css({'height':youmaxTnailHeight+'px'});
			
			//console.log(youmaxTnailWidth);
			//console.log(youmaxTnailHeight);

		}
		
		function showVideoLightbox(videoId) {			
			$('#youmax-lightbox').show();
			$('#youmax-video-lightbox').attr('src','http://www.youtube.com/embed/'+videoId);
			
			$('#youmax-lightbox').click(function(){
				$('#youmax-video-lightbox').attr('src','');
				$('#youmax-lightbox').hide();
			});
		}
