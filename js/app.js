class MetronomeApp {
    /**
    Metronome App con 6 parámetros:
     * @param soundsPath La ruta utilizada para obtener los archivos de sonido
     * @param sounds Un Array de nombre de archivos de sonidos 
     * @param visSettings Configuración para la visualización
     * @param soundSelectId ID del HTML para así selecccionar el control para los sonidos
     * @param visTypeSelectId El ID del control de selección HTML para los tipos de visualización
     * @param startStopId El ID del botón HTML para iniciar y detener el metrónomo
     */
    constructor(soundsPath, sounds, visSettings, soundSelectId, visTypeSelectId, startStopId) {
        this.visSettings = visSettings;
        this.soundSelectId = soundSelectId || 'metroSound';
        this.visTypeSelectId = visTypeSelectId || 'visType';
        this.startStopId = startStopId || 'metronome';

        const metroSoundListener = {
            setTempo: (t) => visSettings.tempoBpm = t,
            setStartTime: (t) => visSettings.startTime = t
        };
        this.metroSound = new MetronomeSound(soundsPath, sounds, metroSoundListener);

        visSettings.getTime = () => this.metroSound.audioContext.currentTime;

        const soundSelect = $('#' + this.soundSelectId);
        for (const name of sounds) {
            const fileExtension = /\..*/;
            const optionText = name.replace('_', ' ').replace(fileExtension, '');
            soundSelect.append(`<option>${optionText}</option>`);
        }

        const visTypeSelect = $('#' + this.visTypeSelectId);
        visTypeSelect.append('<option>None</option>');
        visSettings.names.map((visTypeName, index) => {
            const sel = index === 0 ? ' selected' : '';
            visTypeSelect.append(`<option${sel}>${visTypeName}</option>`);
        });
    }

    /**
     * Seteo del tempo.
     * @param bpm tempo en golpes por minuto
     */
    setTempo(bpm) {
        this.metroSound.setTempo(bpm);
    }

    /**
     * Seteo del sonido del metronomo
     * @param number 
     */
    setSound(number) {
        this.metroSound.setSound(number);
    }

    /**
     * Seteo del tipo de visualización
     * @param index un número basado en 0 que especifica la visualización a usar
     */
    setVisualization(index) {
        this.visSettings.visualizationType = index;
    }

    /** Inicia el metrónomo si está parado y viceversa */
    toggle() {
        this.metroSound.toggle();
        $('#' + this.startStopId).val(this.metroSound.running ? 'Stop' : 'Start')
    }
}

// Con la constante y le damos un string y el array con los nombres de los archivos de sonido //

const metronomeApp = new MetronomeApp('assets/audio/',
    ['High_Woodblock.wav', 'Low_Woodblock.wav', 'High_Bongo.wav',
        'Low_Bongo.wav', 'Claves.wav', 'Drumsticks.wav'],
    VisSettings);

// AGREGO UN TITULO DE ADVERTENCIA: LA LIBRERIA ELEGIDA FUE SWEET ALERT YA QUE PERMITE CREAR ALERTAS PERSONALIZADAS CUSTOMIZABLES, AMIGABLES, INTERACTIVAS Y VINCULABLES.

    Swal.fire({
        title: 'Estimado Músico!',
        text: 'Debe amigarse con el metrónomo y no tener miedo a dicha herramienta. Desea continuar?',
        icon: 'warning',
        confirmButtonText: 'Sí, continuar'
    })
