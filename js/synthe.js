/**
 * 
 */

var sound= new function()
{
	   const NOTE_CHARS =
		 ["c","db","d","eb","e","f","gb","g","ab","a","bb","b"]


	   this.Tone = function(noteNumber, context)
	   {
		   var attack = 0.05; // attack speed
		   var release = 0.5; // release speed
		   var portamento = 0.05; // portamento/glide speed

		   // set up the basic oscillator chain, muted to begin
			// with.
		    this.oscillator = context.createOscillator();
			this.oscillator.frequency.setValueAtTime(110, 0);
			this.envelope = context.createGain();
			this.oscillator.connect(this.envelope);
			this.envelope.connect(context.destination);
			this.envelope.gain.value = 0.0; // Mute the sound
			this.oscillator.start(0); // Go ahead and start up the oscillator
			
			this.oscillator.frequency.cancelScheduledValues(0);
			var frequency = frequencyFromNoteNumber(noteNumber) ;
			this.oscillator.frequency.setTargetAtTime(frequency, 0, portamento);
			this.envelope.gain.cancelScheduledValues(0);
			this.envelope.gain.setTargetAtTime(1.0, 0, attack);

		   function frequencyFromNoteNumber(note) {
				return 440 * Math.pow(2, (note - 69) / 12);
		   }
		   
		   this.mute = function()
		   {
				this.oscillator.frequency.cancelScheduledValues(0);
				this.oscillator.stop(0); // Go ahead and start up the oscillator
				this.envelope.gain.cancelScheduledValues(0);
				this.envelope.gain.setTargetAtTime(0.05, 0, release);
				this.envelope.gain.value = 0.0; // Mute the sound
		   }
		   

	   }

	   this.Synthe = function()
	   {
		   this.activeTones = {}; // the stack of actively-pressed keys
		   
			// patch up prefixes
			window.AudioContext = window.AudioContext
					|| window.webkitAudioContext;

			// the Web Audio "this.context" object
			this.context = new AudioContext();

		   
			this.noteOn= function (noteChar, octave) 
			{
				var value = NOTE_CHARS.indexOf(noteChar) ;
				var noteNumber = octave*12 + value ;
				this.activeTones[noteNumber] = new sound.Tone(noteNumber,this.context) ;
			}

			this.noteOff= function (noteChar, octave) 
			{
				var value = NOTE_CHARS.indexOf(noteChar) ;
  			    var noteNumber = octave*12 + value ;
				 
				var tone = this.activeTones[noteNumber];
				if (tone != undefined) {
					setTimeout(function(){tone.mute();}, 1000) ;
					delete this.activeTones[noteNumber];
				}
			}

			   function noteNumber2Chars(noteNumber)
			   {
				 var octave = parseInt(noteNumber / 12) ;
				 var note = (value - (octave*12)) ;
									
				 console.log("value="+value);
				 console.log("octave="+octave);
				 console.log("note="+note);
				 
				 return noteChar ;
			   }
	   }
	}
