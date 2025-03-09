window.currentTrack = -1;
window.albumDuration = 0.0;
window.albumData;

function loadAlbum(albumId){
    window.scrollTo({top: 0, behavior: 'smooth'});
    pause();
    document.getElementById('record-cover').style.width = '250px';
    document.getElementById('record-cover').style.height = '250px';
    loadJSON('https://bandcamp.theoxygent.nl/api/album.php?id='+albumId).then((data) => {
        window.albumData = {data}; 
        window.albumDuration = getAlbumDuration();
        window.currentTrack = -1;
        document.getElementById('record-print').style.backgroundImage = 'url(images/thumb_'+albumId+'.jpg)';
        document.getElementById('record-cover').src = window.albumData.data.album_art_lg;
        document.getElementById('record-cover').style.width = '350px';
        document.getElementById('record-cover').style.height = '350px';
        document.getElementById('record-cover').parentNode.title = window.albumData.data.linkback_action + ' at bandcamp';
        document.getElementById('record-cover').parentNode.href = window.albumData.data.linkback;
        document.getElementById('bandcamp-action').innerText = window.albumData.data.linkback_action + ' at bandcamp';
        document.getElementById('bandcamp-action').formAction = window.albumData.data.linkback;

        setTrack(0);
        play();

    });
}
function setTrack(trackNumber){
    if(window.currentTrack == trackNumber){
        return true;
    }
    window.currentTrack = trackNumber;
    if(window.albumData.data.tracks[window.currentTrack].file != null){
        audio.src = window.albumData.data.tracks[window.currentTrack].file['mp3-128'];
        document.title = window.albumData.data.tracks[window.currentTrack].title + ' - ' + window.albumData.data.artist;
        return true;
    }
    return false;
}

async function loadJSON(url){
  const response = await fetch(url);
  return response.json();
}
function play() {
    if(document.getElementById('scrobbler').value > 0.999999){
        seek(0);
    }
    audio.play();
}

function pause() {
    audio.pause();
}

function seek(percentage) {
    seekTime = 0.0;
    for(var i = 0; i < window.albumData.data.tracks.length; i = i + 1){
        if(window.albumData.data.tracks[i].file === null){
            continue;
        }
        if(seekTime + window.albumData.data.tracks[i].duration > percentage * window.albumDuration){
            setTrack(i);
            audio.currentTime = percentage * window.albumDuration - seekTime;
            audio.play();
            return;
        }
        seekTime += window.albumData.data.tracks[i].duration;
    }
}

function getAlbumPercentage(){
    seekTime = 0.0;
    for(var i = 0; i < window.currentTrack; i = i + 1){
        if(window.albumData.data.tracks[i].file !== null){
            seekTime += window.albumData.data.tracks[i].duration;
        }
    }
    return (seekTime+audio.currentTime)/window.albumDuration;
}

function playNext(){
    if(window.currentTrack < window.albumData.data.tracks.length - 1){
        if(setTrack(window.currentTrack + 1)){
            audio.play();
            return true;
        }
        else{
            return playNext();
        }
    }
    seek(0.9999);
    pause();
    return false;
}

function getAlbumDuration(){
    duration = 0;
    for(var i = 0; i < window.albumData.data.tracks.length; i = i + 1){
        if(window.albumData.data.tracks[i].file !== null){
            duration += window.albumData.data.tracks[i].duration; 
        }
    }
    return duration;
}

function rotate(){
    document.getElementById('record').style.animationPlayState = 'running';
}
function freeze(){
    document.getElementById('record').style.animationPlayState = 'paused';
}
function disable(element){
    element.style.opacity = 0.5;
    element.onClick = function(){
        return false;
    }
}
function toggleDarkMode(){
    darkQuery = window.matchMedia('(prefers-color-scheme: dark)').matches
    onlyQuery = document.querySelector('meta[name="color-scheme"]').getAttribute("content").includes('only');
    if(onlyQuery){
        document.querySelector('meta[name="color-scheme"]').setAttribute("content", "light dark");
    }
    else if(darkQuery){
        document.querySelector('meta[name="color-scheme"]').setAttribute("content", "only light");
    }
    else{
        document.querySelector('meta[name="color-scheme"]').setAttribute("content", "only dark");
    }
}
function toggleFullScreen() {
   var doc = window.document;
   var docEl = doc.documentElement;

   var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
   var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

   if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
       requestFullScreen.call(docEl);
       window.scrollTo(0,0);
   }
   else {
       cancelFullScreen.call(doc);
   }
}

function scrollToRecordStore(){
    document.getElementById('record-store').scrollIntoView({ 
      behavior: 'smooth' 
    });
}
