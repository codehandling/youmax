
	var youmax_global_options = {};

	
(function ($) {


	var secondsToTime = function(duration) {
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
		
	},
	
		//utility function to display time
	convertDuration = function(videoDuration) {
		var duration,returnDuration;
		videoDuration = videoDuration.replace('PT','').replace('S','').replace('M',':').replace('H',':');	
		
		//TODO: fix some duration settings
		//console.log('videoDuration-'+videoDuration);
		
		var videoDurationSplit = videoDuration.split(':');
		returnDuration = videoDurationSplit[0];
		for(var i=1; i<videoDurationSplit.length; i++) {
			duration = videoDurationSplit[i];
			////console.log('duration-'+duration);
			if(duration=="") {
				returnDuration+=":00";
			} else {
				duration = parseInt(duration,10);
				////console.log('duration else -'+duration)
				if(duration<10) {
					returnDuration+=":0"+duration;
				} else {
					returnDuration+=":"+duration;
				}
			}
		}
		if(videoDurationSplit.length==1) {
			returnDuration="0:"+returnDuration;
		}
		return returnDuration;
		
	},


	getDateDiff = function(timestamp) {
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

	},
	
	getReadableNumber = function(number) {
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
	},
	
		
	loadYoumax = function() {	

		youmaxWidgetWidth = $('#youmax').width();
		
		$('#youmax').append('<div id="youmax-header"><div id="youmax-stat-holder"></div></div>');

		//$('#youmax').append('<div id="youmax-tabs"></div>');
		
		$('#youmax').append('<div id="youmax-tabs"><span id="featured_" class="youmax-tab">Featured</span><span id="uploads_" class="youmax-tab">Uploads</span><span id="playlists_" class="youmax-tab">Playlists</span></div>');

		
		$('#youmax').append('<div id="youmax-encloser"><iframe id="youmax-video" width="'+(youmaxWidgetWidth-2)+'" height="'+(youmaxWidgetWidth/youmax_global_options.youtubeVideoAspectRatio)+'" src="" frameborder="0" allowfullscreen></iframe><div id="youmax-video-list-div"></div><div id="youmax-load-more-div">LOAD MORE</div></div>');
		
		$('#youmax-video').hide();
		
		$('#youmax').append('<div id="youmax-lightbox"><div style="width:100%; position:absolute; top:20%;"><iframe id="youmax-video-lightbox" width="640" height="360" src="" frameborder="0" allowfullscreen></iframe></div></div>');
		
		$('#youmax-lightbox').hide();
	},
	
	//get channel Id if channel URL is of the form ....../user/Adele
	getChannelId = function(apiUrl) {
		//console.log('inside getChannelId');
		//console.log('apiUrl-'+apiUrl);
		//showLoader();
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { 
				youmaxChannelId = response.items[0].id
				getChannelDetails(youmaxChannelId);
			},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},

	
	getChannelDetails = function(channelId) {
	
		//var apiProfileURL = "http://gdata.youtube.com/feeds/api/users/"+youmaxUser+"?v=2&alt=json";
		var apiProfileURL = "https://www.googleapis.com/youtube/v3/channels?part=brandingSettings%2Csnippet%2Cstatistics%2CcontentDetails&id="+channelId+"&key="+youmax_global_options.apiKey;

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

	},
	
	
	setHeader = function(xhr) {
		if(xhr && xhr.overrideMimeType) {
			xhr.overrideMimeType("application/j-son;charset=UTF-8");
		}
	},
	
	showLoader = function() {
		youmax_global_options.youmaxItemCount = 0;
		$('#youmax-video-list-div').empty();
		$('#youmax-video').hide();
		$('#youmax-video').attr('src','');
		$('#youmax-video-list-div').append('<div style="text-align:center; height:200px; font:14px Calibri;"><br><br><br><br><br><br>loading...</div>');
	},
	
	initFeaturedVideos = function () {
		youTubePlaylistURL = youmax_global_options.youTubePlaylistURL;
		console.log('inside init featured - '+youTubePlaylistURL);
		if(null!=youTubePlaylistURL&&youTubePlaylistURL.indexOf("youtube.com/playlist?list=")!=-1) {
			youmaxFeaturedPlaylistId = youTubePlaylistURL.substring(youTubePlaylistURL.indexOf("?list=")+6);
			youmax_global_options.youmaxFeaturedPlaylistId = youmaxFeaturedPlaylistId;
		}
	},
	


	showInfo = function(response) {
		console.log('showInfo');
		console.log(response);

		var channelData = response.items[0];
		var channelId = channelData.id;
		var channelName = channelData.snippet.title;
		var channelPic = channelData.snippet.thumbnails.default.url;
		var channelSubscribers = channelData.statistics.subscriberCount;
		var channelViews = channelData.statistics.viewCount;
		var channelDesc = "";
		var channelUploadsPlaylistId = channelData.contentDetails.relatedPlaylists.uploads;

		
		
		
		$('#youmax-header').append('<img id="youmax-header-logo" src="'+channelPic+'"/>'+channelName);
		
		$('#youmax-header').append('&nbsp;&nbsp;&nbsp;&nbsp;<div class="youmax-subscribe"><div class="g-ytsubscribe" data-channelid="'+channelId+'" data-layout="default" data-count="default"></div></div>');
		
		//$('#youmax-stat-holder').append('<div class="youmax-stat">'+channelSubscribers+'<br/> subscribers </div><div class="youmax-stat">'+channelViews+'<br/>video views</div>');
		
		//$('#youmax-stat-holder').append('<div class="youmax-stat"><span class="youmax-stat-count">'+getReadableNumber(channelViews)+'</span><br/> video views </div><div class="youmax-stat"><span class="youmax-stat-count">'+getReadableNumber(channelSubscribers)+'</span><br/>subscribers</div>');
		
		//$('#youmax-channel-desc').append('About '+channelName+'<br/>'+channelDesc);
		
		renderSubscribeButton();
		
		$('#youmax-tabs').find('span[id^=uploads_]').attr('id','uploads_'+channelUploadsPlaylistId);
		
	},

	renderSubscribeButton = function() {
		$.ajaxSetup({
		  cache: true
		});
		
		$.getScript("https://apis.google.com/js/platform.js")
		.done(function( script, textStatus ) {
			//alert( textStatus );
		})
		.fail(function( jqxhr, settings, exception ) {
			//alert( "Triggered ajaxError handler." );
		});		
	},


	showPlaylists = function(response,loadMoreFlag) {
		console.log(response);
		
		if(!loadMoreFlag) {
			$('#youmax-video-list-div').empty();
		}

		var nextPageToken = response.nextPageToken;
		var $youmaxLoadMoreDiv = $('#youmax-load-more-div');
		//console.log('nextPageToken-'+nextPageToken);
		
		if(null!=nextPageToken && nextPageToken!="undefined" && nextPageToken!="") {
			$youmaxLoadMoreDiv.data('nextpagetoken',nextPageToken);
		} else {
			$youmaxLoadMoreDiv.data('nextpagetoken','');
		}
		
		youmaxColumns = youmax_global_options.youmaxColumns;
		
		var playlistArray = response.items;
		var playlistIdArray = [];
		var zeroPlaylistCompensation = 0;
		for(var i=0; i<playlistArray.length; i++) {
			playListId = playlistArray[i].id;
			playlistSize = playlistArray[i].contentDetails.itemCount;
			if(playlistSize<=0){
				zeroPlaylistCompensation++;
				continue;
			}				
			playlistIdArray.push(playListId);
			playlistTitle = playlistArray[i].snippet.title;
			playlistUploaded = playlistArray[i].snippet.publishedAt;
			playlistThumbnail = playlistArray[i].snippet.thumbnails.medium.url;
			//playlistThumbnail = playlistThumbnail.replace("hqdefault","mqdefault");
			if((i+youmax_global_options.youmaxItemCount-zeroPlaylistCompensation)%youmaxColumns!=0)
				$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%;" id="'+playListId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+playlistThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+playlistThumbnail+'\')"><div class="youmax-playlist-sidebar" id="youmax-playlist-sidebar-'+playListId+'"><span class="youmax-playlist-video-count"><b>'+playlistSize+'</b><br/>VIDEOS</span></div></div><span class="youmax-video-list-title">'+playlistTitle+'</span><br/><span class="youmax-video-list-views">'+getDateDiff(playlistUploaded)+' ago</span></div>');
			else
				$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%; clear:both;" id="'+playListId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+playlistThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+playlistThumbnail+'\')"><div class="youmax-playlist-sidebar" id="youmax-playlist-sidebar-'+playListId+'"><span class="youmax-playlist-video-count"><b>'+playlistSize+'</b><br/>VIDEOS</span></div></div><span class="youmax-video-list-title">'+playlistTitle+'</span><br/><span class="youmax-video-list-views">'+getDateDiff(playlistUploaded)+' ago</span></div>');
				
		}
		
		youmax_global_options.youmaxItemCount+=playlistArray.length-zeroPlaylistCompensation;
			//console.log(playlistIdArray);
			
		$('.youmax-video-tnail-box').click(function() {
			//alert(this.id);
			showLoader();
			playlistTitle = $(this).find(".youmax-video-list-title").text();
			getUploads("play_"+this.id,playlistTitle);
			//getPlaylistVideos(this.id);
		});
		
		/* not sure why this is needed
		var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
		youmaxTnailWidth=youmaxTnailWidth.substring(0,youmaxTnailWidth.indexOf("px"));
		var youmaxTnailHeight = youmaxTnailWidth/youtubeMqdefaultAspectRatio;
		//$('html > head').append('<style>.youmax-video-tnail{height:'+youmaxTnailHeight+'px;}</style>');	
		$('div.youmax-video-tnail').css({'height':youmaxTnailHeight+'px'});
		*/
		
		
		/*
		if(youmaxTnailHeight<130) {
			maxTopVideos = 3;
			$('html > head').append('<style>.youmax-playlist-video-count{margin: 10%;margin-top: 15%;}.youmax-playlist-sidebar-video{margin: 8% auto;}</style>');	
			//$('div.youmax-playlist-video-count').css({'margin':'10%','margin-top':'15%'});
			//$('div.youmax-playlist-sidebar-video').css({'margin':'8% auto'});
		} else {
			maxTopVideos = 4;
		}*/
		
		resetLoadMoreButton();
		
		//console.log(youmaxTnailWidth);
		//console.log(youmaxTnailHeight);

		//getTopVideosFromPlaylist(playlistIdArray,maxTopVideos);
	},

	showUploads = function(response,playlistTitle,loadMoreFlag) {
		console.log(response);

		if(!loadMoreFlag) {
			$('#youmax-video-list-div').empty();
			
			if(playlistTitle) {
				$('.youmax-tab-hover').removeClass('youmax-tab-hover');
				$('#youmax-video-list-div').append('<span class="youmax-showing-title youmax-tab-hover" id="uploads_'+response.items[0].snippet.playlistId+'" style="max-width:100%;"><span class="youmax-showing">&nbsp;&nbsp;Showing playlist: </span>'+playlistTitle+'</span><br/>');
			}
		}
		
		var nextPageToken = response.nextPageToken;
		var $youmaxLoadMoreDiv = $('#youmax-load-more-div');
		//console.log('nextPageToken-'+nextPageToken);
		
		youmaxColumns = youmax_global_options.youmaxColumns;
		
		if(null!=nextPageToken && nextPageToken!="undefined" && nextPageToken!="") {
			$youmaxLoadMoreDiv.data('nextpagetoken',nextPageToken);
		} else {
			$youmaxLoadMoreDiv.data('nextpagetoken','');
		}
		
		var uploadsArray = response.items;
		var videoIdArray = [];
		
		for(var i=0; i<uploadsArray.length; i++) {
			videoId = uploadsArray[i].snippet.resourceId.videoId;
			videoTitle = uploadsArray[i].snippet.title;
			//videoViewCount = uploadsArray[i].snippet.viewCount;
			//videoDuration = uploadsArray[i].snippet.duration;				
			videoUploaded = uploadsArray[i].snippet.publishedAt;
			videoThumbnail = uploadsArray[i].snippet.thumbnails.medium.url;
			//videoThumbnail = videoThumbnail.replace("hqdefault","mqdefault");
			
			videoIdArray.push(videoId);
			
			//$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration">'+secondsToTime(videoDuration)+'</div></div><span class="youmax-video-list-title">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getReadableNumber(videoViewCount)+' views | '+getDateDiff(videoUploaded)+' ago</span></div>');

								
			if((i+youmax_global_options.youmaxItemCount)%youmaxColumns!=0)
				$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration"></div></div><span class="youmax-video-list-title">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span></div>');
			else
				$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%; clear:both;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration"></div></div><span class="youmax-video-list-title">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span></div>');
			
		}
		
		youmax_global_options.youmaxItemCount+=uploadsArray.length;
		
		$('.youmax-video-tnail-box').click(function(){
			//alert(this.id);
			//alert(showVideoInLightbox);
			if(youmax_global_options.showVideoInLightbox){
				showVideoLightbox(this.id);
			} else {
				$('#youmax-video').attr('src','http://www.youtube.com/embed/'+this.id);
				$('#youmax-video').show();
				$('html,body').animate({scrollTop: $("#youmax-header").offset().top},'slow');
			}
		});
		
		/* not sure why this is needed
		var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
		youmaxTnailWidth=youmaxTnailWidth.substring(0,youmaxTnailWidth.indexOf("px"));
		var youmaxTnailHeight = youmaxTnailWidth/youtubeMqdefaultAspectRatio;
		//$('html > head').append('<style>.youmax-video-tnail{height:'+youmaxTnailHeight+'px;}</style>');	
		$('div.youmax-video-tnail').css({'height':youmaxTnailHeight+'px'});
		*/

		getVideoStats(videoIdArray);
		resetLoadMoreButton();

	},


	//get video stats using Youtube API
	getVideoStats = function(videoIdList) {
		//console.log('inside getVideoStats');
		//console.log(videoIdList);
		//showLoader();
		
		apiVideoStatURL = "https://www.googleapis.com/youtube/v3/videos?part=statistics%2CcontentDetails&id="+videoIdList+"&key="+youmax_global_options.apiKey;
		$.ajax({
			url: apiVideoStatURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { displayVideoStats(response);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},

	//display video statistics
	displayVideoStats = function(response) {
		//console.log(response);
		
		var videoArray = response.items;
		var $videoThumbnail;

		for(var i=0; i<videoArray.length; i++) {
			videoId = videoArray[i].id;
			videoViewCount = videoArray[i].statistics.viewCount;
			videoViewCount = getReadableNumber(videoViewCount);
			videoDuration = videoArray[i].contentDetails.duration;
			//console.log('videoDuration-'+videoDuration);
			
			videoDuration = convertDuration(videoDuration);
			videoDefinition = videoArray[i].contentDetails.definition.toUpperCase();
			$videoThumbnail = $('#youmax-video-list-div #'+videoId);
			$videoThumbnail.find('.youmax-video-list-views').prepend(videoViewCount+' views | ');
			$videoThumbnail.find('.youmax-duration').append(videoDuration);
			//$videoThumbnail.append('<div class="youmax-definition">'+videoDefinition+'</div>');
			
		}
	},

		
	getUploads = function(youmaxTabId,playlistTitle,nextPageToken) {
		//showLoader();
		//var apiUploadURL = "http://gdata.youtube.com/feeds/api/users/"+youmaxUser+"/uploads/?v=2&alt=jsonc&max-results=50";
		
		var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		if(null!=nextPageToken) {
			pageTokenUrl = "&pageToken="+nextPageToken;
			loadMoreFlag = true;
		}

		var uploadsPlaylistId = youmaxTabId.substring(youmaxTabId.indexOf('_')+1);
		var apiUploadURL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId="+uploadsPlaylistId+"&maxResults="+youmax_global_options.maxResults+pageTokenUrl+"&key="+youmax_global_options.apiKey;

		console.log('apiUploadURL-'+apiUploadURL);
		
		$.ajax({
			url: apiUploadURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { showUploads(response,playlistTitle,loadMoreFlag);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},
	
	
	
	getPlaylists = function(nextPageToken) {

		var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		if(null!=nextPageToken) {
			pageTokenUrl = "&pageToken="+nextPageToken;
			loadMoreFlag = true;
		}
		
		var apiChannelPlaylistsURL = "https://www.googleapis.com/youtube/v3/playlists?part=contentDetails,snippet&channelId="+youmaxChannelId+"&maxResults="+youmax_global_options.maxResults+pageTokenUrl+"&key="+youmax_global_options.apiKey;

		//var apiPlaylistURL = "https://gdata.youtube.com/feeds/api/users/"+youmaxUser+"/playlists?v=2&alt=jsonc&max-results=50";	
		$.ajax({
			url: apiChannelPlaylistsURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { showPlaylists(response,loadMoreFlag);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},		

	showVideoLightbox = function(videoId) {			
		$('#youmax-lightbox').show();
		$('#youmax-video-lightbox').attr('src','http://www.youtube.com/embed/'+videoId);
		
		$('#youmax-lightbox').click(function(){
			$('#youmax-video-lightbox').attr('src','');
			$('#youmax-lightbox').hide();
		});
	},
		
	resetLoadMoreButton = function() {
		var $youmaxLoadMoreDiv = $('#youmax-load-more-div');
		$youmaxLoadMoreDiv.removeClass('youmax-load-more-div-click');
		$youmaxLoadMoreDiv.text('LOAD MORE');
	},
	
	prepareYoumax = function() {
		$('#youmax').empty();
		/*
		if(youTubeChannelURL.indexOf("youtube.com/user/")!=-1) {
			if(null!=youTubeChannelURL&&youTubeChannelURL.indexOf("?feature")!=-1)
				youmaxUser = youTubeChannelURL.substring(youTubeChannelURL.indexOf("youtube.com/user/")+17,youTubeChannelURL.indexOf("?feature"));
			else
				youmaxUser = youTubeChannelURL.substring(youTubeChannelURL.indexOf("youtube.com/user/")+17);
		}
		
		console.log('youTubeChannelURL-'+youTubeChannelURL);
		console.log('youmaxUser-'+youmaxUser);

		//youmaxUser = 'UCVUZWBzxM7w8ug87qYwkBLg';
		//youmaxUser = 'AdeleVEVO';
		*/
		
		loadYoumax();
		showLoader();
		
		$('.youmax-tab').click(function(){
			$('.youmax-tab-hover').removeClass('youmax-tab-hover');
			$(this).addClass('youmax-tab-hover');
			//$('.youmax-tab').css('color','#666');
			//$('.youmax-tab').css('background-color','rgb(230,230,230)');
			//$('.youmax-tab').css('text-shadow','0 1px 0 #fff');

			//$(this).css('color','#eee');
			//$(this).css('background-color','#999');
			//$(this).css('text-shadow','0 0');
			
			youmaxTabId = this.id;
			
			showLoader();
			
			if(youmaxTabId.indexOf("featured_")!=-1) {
				getUploads('featured_'+youmax_global_options.youmaxFeaturedPlaylistId,null,null);
			} else if(youmaxTabId.indexOf("uploads_")!=-1) {
				getUploads(youmaxTabId);
			} else if(youmaxTabId.indexOf("playlists_")!=-1) {
				getPlaylists();
			}
		});
		
		$('#youmax-load-more-div').click(function(){

			var $youmaxLoadMoreDiv = $('#youmax-load-more-div');
			$youmaxLoadMoreDiv.html('LOADING..');
			$youmaxLoadMoreDiv.addClass('youmax-load-more-div-click');
			
			var youmaxTabId = $('.youmax-tab-hover').attr('id');
			var nextPageToken = $youmaxLoadMoreDiv.data('nextpagetoken');
			console.log('load more clicked : nextPageToken-'+nextPageToken);
			
			if(null!=nextPageToken && nextPageToken!="undefined" && nextPageToken!="") {
				if(youmaxTabId.indexOf("featured_")!=-1) {
					getUploads('featured_'+youmax_global_options.youmaxFeaturedPlaylistId,null,nextPageToken);
				} else if(youmaxTabId.indexOf("uploads_")!=-1) {
					getUploads(youmaxTabId,null,nextPageToken);
				} else if(youmaxTabId=="playlists_") {
					getPlaylists(nextPageToken);
				}
			} else {
				$youmaxLoadMoreDiv.html('ALL DONE');
			}

		});
		
		youmaxDefaultTab = youmax_global_options.youmaxDefaultTab;
		
		if(typeof youmaxDefaultTab === 'undefined'||null==youmaxDefaultTab||youmaxDefaultTab==""||youmaxDefaultTab=="undefined") {
			$("#youmax-tabs span[id^=featured_]").click();
		} else if(youmaxDefaultTab.toUpperCase()=='UPLOADS'||youmaxDefaultTab.toUpperCase()=='UPLOAD') {
			$("#youmax-tabs span[id^=uploads_]").click();
		} else if(youmaxDefaultTab.toUpperCase()=='PLAYLISTS'||youmaxDefaultTab.toUpperCase()=='PLAYLIST') {
			$("#youmax-tabs span[id^=playlists_]").click();
		} else if(youmaxDefaultTab.toUpperCase()=='FEATURED'||youmaxDefaultTab.toUpperCase()=='FEATURED') {
			$("#youmax-tabs span[id^=featured_]").click();
		}
		
		
		youTubeChannelURL = youmax_global_options.youTubeChannelURL;
		
		//Get Channel header and details 
		if(youTubeChannelURL!=null) {
			s=youTubeChannelURL.indexOf("/user/");
			////console.log('s-'+s);
			if(s!=-1) {
				userId = youTubeChannelURL.substring(s+6);
				//console.log('userId-'+userId);
				apiUrl = "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername="+userId+"&key="+youmax_global_options.apiKey;
				getChannelId(apiUrl);
			} else {
				s=youTubeChannelURL.indexOf("/channel/");
				if(s!=-1) {
					youmaxChannelId = youTubeChannelURL.substring(s+9);
					youmax_global_options.youmaxChannelId = youmaxChannelId;
					//console.log('channelId-'+channelId);
					getChannelDetails(youmaxChannelId);
				} else {
					alert("Could Not Find Channel..");
				}
			}
		}
	
	}		
	
	
	$.fn.youmax = function(options) {

		
		//set local options
		youmax_global_options.apiKey = options.apiKey;
		youmax_global_options.youTubeChannelURL = options.youTubeChannelURL||'';
		youmax_global_options.youTubePlaylistURL = options.youTubePlaylistURL||'';
		youmax_global_options.youmaxDefaultTab = options.youmaxDefaultTab||'FEATURED';
		youmax_global_options.youmaxColumns = options.youmaxColumns||3;
		youmax_global_options.showVideoInLightbox = options.showVideoInLightbox||false;
		youmax_global_options.youmaxChannelId = '';
		youmax_global_options.maxResults = options.maxResults||15;
		youmax_global_options.youmaxItemCount = 0;
		youmax_global_options.youtubeVideoAspectRatio = 640/360;
	
		//youmax_global_options.youmaxWidgetWidth = options.youmaxWidgetWidth||800;
		//youmax_global_options.showFeaturedVideoOnLoad = options.showFeaturedVideoOnLoad||false;
		//youmax_global_options.youtubeMqdefaultAspectRatio = 300/180;

		initFeaturedVideos();
		prepareYoumax();
	
	};
	
 
}( jQuery ));


