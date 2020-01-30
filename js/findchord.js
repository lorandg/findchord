
	var displayScore ;
	var currentChord=[];
	var currentOctave = 4 ;
	var keyboard ;
	var midiInput ;
	var clef = "treble" ;
	var playedNotes = [];
	
	const NOTES_CHAR =
		 ["C","D","E","F","G","A","B"] ;

	
	const MIDI_KEY_2_NOTE = {
		"0":"C",
		"1":"C#",
		"2":"D",
		"3":"D#",
		"4":"E",
		"5":"F",
		"6":"F#",
		"7":"G",
		"8":"G#",
		"9":"A",
		"10":"A#",
		"11":"B",
	};


	function init()
	{
		var clefSelection = $("#clefSelection")[0] ;
		clefSelection.addEventListener('input', clefSelectionChange);

		
		displayScore = new score.Display($("#score")[0]) ;
		displayScore.init();

		class Listener 
		{
			onKeyPressed(note, octave)
			{
				console.log("octave="+octave);
				console.log("note="+note);
				var noteChr = note+ "/" + octave;
				playedNotes.push(noteChr) ;	
				check() ;
			}

			onOctaveChange(octave)
			{
				currentOctave = octave;
				newChord() ;
			}
		};
		
		const listener = new Listener() ;
		
		keyboard = new Keyboard(listener) ;
		keyboard.draw() ;
		
		midiInput = new MidiInput(function(press, pianoKey){
			
			console.log("pianoKey="+pianoKey);
			var octave = Math.floor(pianoKey/12) ;
			var key = pianoKey-(octave*12) ;
			
			// update octave to be compliant with voxflex and classical octave notation
			octave -= 1 ;
			var note = MIDI_KEY_2_NOTE[key] ;
			
			console.log("octave="+octave);
			console.log("note="+note);
			
			if(press)
			{
				keyboard.pressKey(note, octave);
			}
			else
			{
				keyboard.releaseKey(note, octave) ;
			}
			
		}) ;
		
		
		newChord() ;
	}
	

	function random (low, high) {
	    return parseInt(Math.random() * (high - low) + low);
	}

	function newChord()
	{
		displayScore.clean();

		
		currentChord=[] ;
	
		var maxIdx = NOTES_CHAR.length ;
		var lowerOctave = currentOctave -1 ;
		var upperOctave = currentOctave +1 ;
		var note1Idx = random(0,maxIdx) ;
		var octaveShift = 1- random(0,2); // -1, 0, 1
		var note1Octave= lowerOctave + octaveShift ; 
		var note1Chr = NOTES_CHAR[note1Idx]+ "/" + note1Octave ;
		currentChord.push(note1Chr) ;	

		var note2Interval = 3- random(0,2); // 1, 2 ,3
		var note2IdxBase = note1Idx + note2Interval; 
		var note2Idx = note2IdxBase % maxIdx ;
		var note2Octave= note1Octave + (note2IdxBase < maxIdx ? 0:1);
		var note2Chr = NOTES_CHAR[note2Idx]+ "/" + note2Octave ;
		currentChord.push(note2Chr) ;	
		
		var note3Interval = 3 - random(0,2); // 1, 2 ,3
		var note3IdxBase = note2Idx + note3Interval; 
		var note3Idx = note3IdxBase % maxIdx ;
		var note3Octave= note2Octave + ( note3IdxBase < maxIdx ? 0:1);
		var note3Chr = NOTES_CHAR[note3Idx]+ "/" + note3Octave ;
		currentChord.push(note3Chr) ;	

		var vexNote = new VF.StaveNote({
            clef: clef,
            keys: currentChord,
            duration: "4",
          });
		displayScore.addNote(vexNote);			
				
		if(note3Octave>upperOctave)
		{
			newChord() ;
		}

	};

	
	function check()
	{
		console.log(playedNotes+":"+currentChord) ;
		if(playedNotes.length>=currentChord.length)
		{
			var playedNotesStr = JSON.stringify(playedNotes.sort()) ;
			var currentChordStr = JSON.stringify(currentChord.sort()) ;
			if(playedNotesStr == currentChordStr) 
			{
				$("#result")[0].innerHTML="Good job" ;
				newChord() ;
			}
			else
			{
				$("#result")[0].innerHTML="Try again" ;
				playedNotes = [] ;
			}
		}
	}
	
	function clefSelectionChange(e) {
		clef = e.target.value ;
		console.log("clef selection change = "+clef );
		  
		switch(clef )
		{
			case "treble":
		      keyboard.changeOctave(4);
			  break ;
		
			case "bass":
		      keyboard.changeOctave(3);
			  break ;
		}
		$("#score").empty();
		displayScore = new score.Display($("#score")[0], clef) ;
		displayScore.init();
			  
		newChord();
	}

