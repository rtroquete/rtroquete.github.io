const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

$(document).ready(() => {
  const startButton = $('#start');
  const stopButton = $('#stop');
  const downloadLink = $('#download');
  const player = $('#player');

  var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple'
  });

  recordAudio().then(recorder => {
    startButton.on('click', (() => {
      recorder.start();
      startButton.hide();
      stopButton.show();
    }));
    stopButton.on('click', (() => {
      recorder.stop().then(audio => {
        stopButton.hide();

        downloadLink.attr('href', audio.audioUrl);
		    downloadLink.attr('download', 'treinamento.wav');
        downloadLink.show();

        player.attr("src", audio.audioUrl);
        player.show();

        wavesurfer.load(audio.audioUrl);
      });
    }));
  });
});
