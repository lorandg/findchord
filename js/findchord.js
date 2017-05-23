	
	var display ;
	var currentChord=[];
	var pianoKeyboard ;
	var synthe ;
	var midiInput ;

	const PIANOKEY_2_NOTE = {
		"0":"c",
		"1":"c#",
		"2":"d",
		"3":"d#",
		"4":"e",
		"5":"f",
		"6":"f#",
		"7":"g",
		"8":"g#",
		"9":"a",
		"10":"a#",
		"11":"b",
	};
	
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
		
		midiInput = new MidiInput(function(press, pianoKey){
			
			console.log("pianoKey="+pianoKey);
			var octave = Math.floor(pianoKey/12) ;
			var key = pianoKey-(octave*12) ;
			var note = PIANOKEY_2_NOTE[key] ;
			
			console.log("octave="+octave);
			console.log("note="+note);
			
			if(press)
			{
				pianoKeyboard.lightUp(note+"/"+octave) ;
				synthe.noteOn(note,octave) ;
				check() ;
			}
			else
			{
				pianoKeyboard.turnOff(note+"/"+octave) ;
				synthe.noteOff(note,octave) ;
			}
			
		}) ;
		
		
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
