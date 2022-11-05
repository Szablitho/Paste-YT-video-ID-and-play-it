# Paste-YT-video-ID-and-play-it
It is site with YT video player where you can paste ID of video or link and play it. I made it with JavaScript and Youtube Embed API. It's responsive(not on phones), but site functionment design isn't fully developed.
Link for live view: https://szablitho.github.io/Paste-YT-video-ID-and-play-it/

## What is it about?
This player is able to handle specific errors and show accurate error response in alert when video ID is wrong. It is specified in onPlayerError event of YT player and in function of the same name.
Nonetheless, function playAnotherVideo() handles phrase convertion from links to ID, but they can't be pasted with video parameters like time of video.

I implemented custom solution for a countdown 10-0 at the end of video. There are 5 cooperating functions at the bottom of code to make it happen. After that, another one - removeCountdown() is clearing all the blocks required for countdown appearance.