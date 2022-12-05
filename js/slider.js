var isRunning = true;
var isPaused = false;

function updatePlaySlider(){
    document.getElementById("playSlider").value = Math.ceil((current_minute-start_minute)*100 / end_minute);
}

function pausePlayClick(){
    if(isPaused){
        isPaused = false
    } else {
        isPaused = true
    }
    pausePlaySliderImage()
}

function pausePlaySliderImage(){
    if(isPaused){
        document.getElementById("playButton").src = "./images/play.png";
        isRunning = false;
    } else {
        document.getElementById("playButton").src = "./images/pause.png";
        isRunning = true;
        startUpdateData()
    }
}

function sliderChange(){
    val = document.getElementById("playSlider").value;
    current_minute = Math.ceil(start_minute + (val * end_minute) / 100)
    isPaused = true
    pausePlaySliderImage()
    updateData()
}