/* Se crea una class con un constructor para saber donde buscar el sonido, el tipo de sonido (el nombre del archivo) y el listener que actúa como un callback para el metrónomo. También se crea el audio context en el constructor con el método de la web audio API con una propiedad Current Time */

class MetronomeSound {
    constructor(soundsPath, sounds, listener) {
        this.soundsPath = soundsPath;
        const dummyListener = { setTempo: (t) => { }, setStartTime: (t) => { } };
        this.listener = listener || dummyListener;
        this.running = false;
        this.tempoBpm = 60;
        this.soundNum = 1;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const urls = sounds.map(name => this.soundsPath + name);
        this.soundFiles = new SoundFiles(this.audioContext, urls);
    }

    /**
     * Seteo del tempo del metronomo
     * @param bpm tempo en golpes por minuto
     */
    setTempo(bpm) {
        this.tempoBpm = bpm;
    }

    /**
     * Seteo del sonido del metronomo 
     * @param number
     */
    setSound(number) {
        this.soundNum = number;
    }

    /* Para alternar la ejecución del metronomo. Ejecutar (que comience) o que se detenga el sonido.   */
    toggle() {
        const ms = this;

        function playMetronome() {
            let nextStart = ms.audioContext.currentTime;

            function schedule() {
                if (!ms.running) return;

                ms.listener.setStartTime(nextStart);
                ms.listener.setTempo(ms.tempoBpm);
                const bufIndex = ms.soundNum - 1;
                if (bufIndex >= ms.soundFiles.buffers.length) {
                    alert('Sound files are not yet loaded')
                } else if (ms.tempoBpm) {
                    nextStart += 60 / ms.tempoBpm;
                    ms.source = ms.audioContext.createBufferSource();
                    ms.source.buffer = ms.soundFiles.buffers[bufIndex];
                    ms.source.connect(ms.audioContext.destination);
                    ms.source.onended = schedule;
                    ms.source.start(nextStart);
                }
            }

            schedule();
        }

        if (this.running = !this.running) {
            playMetronome();
        } else {
            this.listener.setTempo(0);
            if (this.source) {
                this.source.disconnect();
                this.source = undefined;
            }
        }
    }
}

class SoundFiles {
    constructor(context, urlList) {
        this.buffers = [];
        const self = this;

        urlList.forEach((url, index) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.onload = () => context.decodeAudioData(xhr.response,
                (buffer) => self.buffers[index] = buffer,
                (error) => console.error('decodeAudioData error', error));
            xhr.open("GET", url);
            xhr.send();
        });
    }
}
