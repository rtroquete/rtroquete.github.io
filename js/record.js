let wavesurfer;
window.gravacoes = [];
const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    var audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks = [];
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
const createAudio = ((audio) => {
  gravacoes.push(audio);
  $(`<li data-audio-url="${audio.audioUrl}" data-audio-id="${gravacoes.length - 1}" class="collection-item avatar">
  <i class="material-icons circle blue">play_arrow</i><span></span>
      <p><span class="title">${gravacoes.length}) Treino</span>
      <a href="#!" class="secondary-content"><i class="material-icons ico-darkred">remove_circle_outline</i>
      </a>
      </p>
      </li>`)
      .find('i.blue').click((evt) => { 
       // console.debug('play', evt, audio); 
        $('#play').hide();
        //$('#play').attr("src", audio.audioUrl);        
        wavesurfer.load(audio.audioUrl); 
        wavesurfer.playPause();
        audio.play();
      })
      .end()
      .find('a.secondary-content').click((evt) => { 
        console.debug('deletar', evt, $(evt.target).parent().parent()); 
        const li = $(evt.target).parent().parent().parent();
        wavesurfer.empty();
        $('#play').hide();
        li.hide();
      })
      .end()
      .appendTo('#listartreinos ul.collection');
});
$(document).ready(() => {
  const startButton = $('#start');
  const stopButton = $('#stop');
  const player = $('#play');
  

  wavesurfer = WaveSurfer.create({
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
        player.attr("src", audio.audioUrl);
        createAudio(audio);
        player.show();
        wavesurfer.load(audio.audioUrl);

       

        startButton.show();
      });
    }));
  });
});
