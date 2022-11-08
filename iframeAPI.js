 // 2. This code loads the IFrame Player API code asynchronously.
 var tag = document.createElement('script');

 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 // 3. This function creates an <iframe> (and YouTube player)
 //    after the API code downloads.
 function onYouTubeIframeAPIReady() {
   console.log('Youtube Iframe API is ready');
 }
 // My custom function to play video from ID given by user
    // https://www.youtube.com/watch?v=QkWOaqGn9Vg -> source of knowledge
    var player;
 const playVideo = vidid => {
   // conditional that works when video has been already loaeded and user want to change video
   if(player) {
     player.destroy();
   }
   player = new YT.Player('player', {
     height: '360',
     width: '640',
     videoId: vidid,
     events: {
       'onReady': onPlayerReady,
       'onStateChange': onPlayerStateChange,
       'onError': onPlayerError
     }
   });
 }
 // QkWOaqGn9Vg
 // FPrnYtCI9Gs
 // function taking ID from input and call playVideo function
 const playAnotherVideo = () => {
   var ID = document.getElementById('otherID').value;
   if(ID.length > 11) {
     const newID = ID.substr(-11);
     playVideo(newID);
   } else {
     playVideo(ID);
     console.log(YT);
   }
}

 // 4. The API will call this function when the video player is ready.
 function onPlayerReady(event) {
   event.target.playVideo();
 }

 // 5. The API calls this function when the player's state changes.
 //    The function indicates that when playing a video (state=1),
 //    the player should play for six seconds and then stop.

 var done = false;
 function onPlayerStateChange(event) {
   // if (event.data == YT.PlayerState.PLAYING && !done) {
   //   setTimeout(stopVideo, 3000);
   //   done = true;
   // }
   if (event.data == YT.PlayerState.ENDED) {               
     console.log("Video Ended");
     //clears elements in DOM created by countdown()
     // removeCountdown(); //moved into countdown() for better sync of execution
   }

   if (event.data == YT.PlayerState.PLAYING) {             
     console.log("Video Playing");
   // countdown() is calculating how much time left to the end of video, will start on timeout
       countdown(removeCountdown);
   }
   if(event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.BUFFERING || event.data == YT.PlayerState.ENDED) {
   }

   if (event.data == YT.PlayerState.PAUSED) {              
       console.log("Video Paused");
   }

   if (event.data == YT.PlayerState.BUFFERING) {               
       console.log("Video Buffering");
   }

   if (event.data == YT.PlayerState.CUED) {                
       console.log("Video Cued");
   }
   if(event.data == YT.PlayerState.UNSTARTED) {
     console.log("Video Unstarted");
   }
 }
 // 6. Handling errors(mine)
 function onPlayerError(event) {
   if(event.data == 2) {
     console.log('error2');
     alert('error 2: ID isn\'t 11 characters or includes % or !');
   }
   if(event.data == 5) {
     console.log('error5');
     alert('error5: żądanego materiału nie można odtworzyć w odtwarzaczu HTML5 lub wystąpił inny błąd związany z odtwarzaczem HTML5.');
   }
   if(event.data == 100) {
     console.log('error100');
     alert('error100: nie znaleziono żądanego filmu. Ten błąd występuje, gdy film został usunięty (z dowolnego powodu) lub został oznaczony jako prywatny.');
   }
   if(event.data == 101 || event.data == 150) {
     console.log('error101 or error 150');
     alert('error 101 or error 150: właściciel żądanego filmu nie zezwala, by był on odtwarzany w odtwarzaczach umieszczanych na stronach.');
   }
 }
 function stopVideo() {
   player.stopVideo();
 }
 function warning() {
   alert('Video wasn\'t found on youtube');
 }

 // Explaining how these functions work together to count down at the end of video

 // There is defined TimeLeft of video by video length - CurrentVideoTime - 10s, then I used timeout with that as variable
 // I catch a moment when start to countdown - setTimeout(func,video TimeLeft * 900); - should be 1000 but player switches state ealier so countdown has to start ealier too
 //before countdown(), addForeground(), creates a darker background for number, but on top of YT player and creates centered blockNumber as div element, then countdownNumber() injects number from within loop from countdown() func
 // then with for loop countdown to 0 with interval equal to 1s or nested timeout - place it in func?
   //Note: Neither interval or nested Timeout didnt countdown on a reasonable and stable time, async function with promise does, it slows down exectuion of for loop
   // here it is sleep() func making delay of for loop, source code and explanation of it below
   //source code: https://javascript.plainenglish.io/javascript-slow-down-for-loop-9d1caaeeeeed
 // within body there is placed countdown number(also as loop parameter)
 // removeCountdown() removes previously created foreground and numberBlock for letting a user replay or switch video and still see good
 const whatLeft = () => {
   let length = player.getDuration();
   let CurrentTime = player.getCurrentTime()
   let TimeLeft = length - CurrentTime - 10;

   return TimeLeft; 
 }
 
 const sleep = (time) => {
   return new Promise((resolve) => setTimeout(resolve, time))
 }
 // const doSomething = async () => {
 //   for (let i = 10; i > 0; i--) {
 //     await sleep(1000)
 //     console.log(i)
 // }
 //}
 // doSomething is replaced by code downhere
 const countdown = callback => {
   let timer = whatLeft(); // video is playing and time left to end is known
     // async and await are neccesary for delaying execution of loop
   let nestedTimeout = setTimeout( async () => { // gonna calculate how much to wait for starting countdown
     addForeground(); //foreground and .numberBlock is created on top of YT player
     for(let i = 10; i > 0; i--) {
       await sleep(1000);
       // shows number in a .numberBlock div element
       countdownNumber(i);
     }
     callback();
     }, timer * 1000); //time accepted by Timeout is in miliseconds, so I multiply it to get seconds
   
 }

 //foreground is created here and styled by CSS, it is done once per video playback
 const addForeground = () => {
   const block = document.createElement("div");
   block.classList.add("foreground");
   const parent = document.querySelector(".videoContainer");
   parent.appendChild(block);
   const numberBlock = document.createElement("div");
   numberBlock.classList.add("numberBlock");
   parent.appendChild(numberBlock);
 }
 //these two functions are placing and later replacing number within previously created numberBlock
 const countdownNumber = (i) => {
   const numberBlock = document.querySelector(".numberBlock");
   numberBlock.innerHTML = i;
 }
 // after countdown ends - (YT.PlayerState.ENDED) - then this removes background and number
 const removeCountdown = () => {
   const foreground = document.querySelectorAll(".foreground");
   const numberBlock = document.querySelectorAll(".numberBlock");
   foreground.forEach(el => el.remove());
   numberBlock.forEach(el => el.remove());
 }
 //end of func
 //FPrnYtCI9Gs
 //https://youtu.be/IL2cZDIwfms