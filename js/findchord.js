
	var display ;
	var currentChord=[];
	var pianoKeyboard ;
	var synthe ;
	var midiInput ;
	var octave = 4 ;
	var clef = "treble" ;
	
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

	function clefSelectionChange(e) {
		clef = e.target.value ;
		console.log("clef selection change = "+clef );
		  
		switch(clef )
		{
			case "treble":
			  octave = 4 ;
			  break ;
		
			case "bass":
			  octave = 3 ;
			  break ;
		}
		$("#score").empty();
		display = new score.Display($("#score")[0], clef) ;
		display.init();
			  
		addChord();
	}

	function init()
	{
		var clefSelection = $("#clefSelection")[0] ;
		clefSelection.addEventListener('input', clefSelectionChange);

		
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
			var midiOctave = Math.floor(pianoKey/12) ;
			var key = pianoKey-(midiOctave*12) ;
			
			// update octave to be compliant with voxflex and classical octave notation
			midiOctave -= 1 ;
			var note = PIANOKEY_2_NOTE[key] ;
			
			console.log("octave="+midiOctave);
			console.log("note="+note);
			
			if(press)
			{
				pianoKeyboard.lightUp(note+"/"+midiOctave) ;
				synthe.noteOn(note,midiOctave) ;
				check() ;
			}
			else
			{
				pianoKeyboard.turnOff(note+"/"+midiOctave) ;
				synthe.noteOff(note,midiOctave) ;
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
			var slashIdx = note.indexOf("/") ;
			var keyOct = octave ;
			
			if(slashIdx>-1)
			{
				key = note.substring(0,slashIdx) ;
				var octChar= note.substring(slashIdx+1,slashIdx+2) ;
				keyOct = parseInt(octChar) ;
			}

			synthe.noteOff(key,keyOct) ;
		}

		currentChord=[] ;
		pianoKeyboard.turnAllOff() ;
	
		
		for (var idx = 0; idx < 3; idx++) {
			var noteIdx = random(0,ui.NOTES_CHAR.length) ;
			var noteChr = ui.NOTES_CHAR[noteIdx]+ "/" + octave ;
			
			while(currentChord.includes(noteChr))
			{
				noteIdx = random(0,ui.NOTES_CHAR.length) ;
				noteChr = ui.NOTES_CHAR[noteIdx]+ "/" + octave ;
			}
			
			currentChord.push(noteChr) ;	
			currentChord.sort() ;
		}
		currentChord.sort() ;
		
		var vexNote = new VF.StaveNote({
            clef: clef,
            keys: currentChord,
            duration: "4",
          });
		display.addNote(vexNote);			

	};

	
	function check()
	{
		var lightenedNotes = pianoKeyboard.lightenedNotes() ;
		
		if(lightenedNotes.length>=currentChord.length)
		{
			var lightenedNotesStr = JSON.stringify(lightenedNotes) ;
			var currentChordStr = JSON.stringify(currentChord) ;
			if(lightenedNotesStr == currentChordStr) 
			{
				$("#result")[0].innerHTML="Good job" ;
				addChord() ;
			}
			else
			{
				$("#result")[0].innerHTML="Try again" ;
				pianoKeyboard.turnAllOff() ;
			}
		}
	}
