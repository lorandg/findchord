	
	var display ;
	var currentChord=[];
	var pianoKeyboard ;
	var synthe ;
	
	function init()
	{
		display = new score.Display($("#score")[0]) ;
		display.init();

		pianoKeyboard = new ui.PianoKeyboard($("#keyboard")[0]) ;
		pianoKeyboard.draw() ;
		
		synthe = new sound.Synthe() ;
		
		pianoKeyboard.keyPressed(function(event){
			var note = event.note ;
			if(pianoKeyboard.isLightened(event.note+"/"+event.octave))
			{
				pianoKeyboard.turnOff(event.note+"/"+event.octave) ;
				synthe.noteOff(note,event.octave) ;
			}
			else
			{
				pianoKeyboard.lightUp(event.note+"/"+event.octave) ;
				synthe.noteOn(note,event.octave) ;
				check() ;
			}
		});
		
		addChord() ;
	}

	function random (low, high) {
	    return parseInt(Math.random() * (high - low) + low);
	}

	function addChord()
	{
		display.clean();
		
		for (var idx = 0; idx < currentChord.length; idx++) 
		{
			var note = currentChord[idx] ;
			var key =  note ;
			var octave = 4 ;
			var slashIdx = note.indexOf("/") ;
			
			if(slashIdx>-1)
			{
				key = note.substring(0,slashIdx) ;
				var octChar= note.substring(slashIdx+1,slashIdx+2) ;
				octave = parseInt(octChar) ;
			}

			synthe.noteOff(key,octave) ;
		}
		currentChord=[] ;
		pianoKeyboard.turnAllOff() ;
	
		
		for (var idx = 0; idx < 3; idx++) {
			var noteIdx = random(0,ui.NOTES_CHAR.length) ;
			var noteChr = ui.NOTES_CHAR[noteIdx]+ "/4" ;
			
			while(currentChord.includes(noteChr))
			{
				noteIdx = random(0,ui.NOTES_CHAR.length) ;
				noteChr = ui.NOTES_CHAR[noteIdx]+ "/4"  ;
			}
			
			currentChord.push(noteChr) ;	
			currentChord.sort() ;
			
		}
		
		var vexNote = new VF.StaveNote({
            clef: "treble",
            keys: currentChord,
            duration: "4",
          });
		display.addNote(vexNote);			

	};

	
	function check()
	{
		if(pianoKeyboard.lightenedNotes().length==currentChord.length)
		{
			if(JSON.stringify(pianoKeyboard.lightenedNotes())==JSON.stringify(currentChord)) 
			{
				$("#result")[0].innerHTML="Bien joué" ;
				addChord() ;
			}
			else
			{
				$("#result")[0].innerHTML="Essai encore" ;
			}
		}
	}
