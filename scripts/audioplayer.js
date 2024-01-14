window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var analyser = audioContext.createAnalyser();
var sources = {};

function connectAndPlay(playerId) {
  var audioElement = document.getElementById(playerId);

  if (!sources[playerId]) {
    sources[playerId] = audioContext.createMediaElementSource(audioElement);
    sources[playerId].connect(analyser);
  }
  analyser.connect(audioContext.destination);

  audioContext.resume().then(() => {
    audioElement.play();
    renderFrame();
  });
}

function playPauseHandler(playerId) {
  var audio = document.getElementById(playerId);
  if (audio.paused) {
    connectAndPlay(playerId);
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
}

["1", "2", "3"].forEach(function (number) {
  var playButtonId = "playButton" + number;
  var audioPlayerId = "myAudio" + number;
  var volumeControlId = "volumeControl" + number;

  document.getElementById(playButtonId).addEventListener("click", function () {
    playPauseHandler(audioPlayerId);
  });

  document
    .getElementById(volumeControlId)
    .addEventListener("input", function () {
      var audio = document.getElementById(audioPlayerId);
      audio.volume = this.value;
    });
});

var canvas = document.getElementById("audioVisualizer");
var canvasContext = canvas.getContext("2d");

function renderFrame() {
  requestAnimationFrame(renderFrame);
  var freqData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqData);
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  var barWidth = (canvas.width / analyser.frequencyBinCount) * 4;
  var barHeight;
  var x = 0;
  var scaleFactor = 0.35;

  for (var i = 0; i < freqData.length; i++) {
    barHeight = freqData[i] * scaleFactor;
    canvasContext.fillStyle = "rgb(0, 0, 0)";
    canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}
