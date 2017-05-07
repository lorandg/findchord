
	
	var display ;
	var selectedNote="";
	var currentNote="";

	function init()
	{
		display = new score.Display($("#score")[0]) ;
		display.init();

		addChord() ;

		var pianoKeyboard = new ui.PianoKeyboard($("#keyboard")[0]) ;
		pianoKeyboard.draw() ;
		
		var synthe = new sound.Synthe() ;

		pianoKeyboard.keyPressed(function(event){
			var note = event.note ;
			selectedNote= note ;
			synthe.noteOn(note,4) ;
			setTimeout(function(){
				synthe.noteOff(note,4)
				}, 100)
			check() ;

		});
		


	}

	function random (low, high) {
	    return parseInt(Math.random() * (high - low) + low);
	}

	function addChord()
	{
		display.deleteNote();
		
		var noteIdx = random(0,ui.NOTES_CHAR.length) ;
		currentNote= ui.NOTES_CHAR[noteIdx] ;	
		
		var vexNote = new VF.StaveNote({
             clef: "treble",
             keys: [currentNote+"/4"],
             duration: "4",
           });
		display.addNote(vexNote);			
	};

	
	function check()
	{
		if(selectedNote==currentNote) 
		{
			$("#result")[0].innerHTML="Bien joué" ;
			addChord() ;
		}
		else
		{
			$("#result")[0].innerHTML="Essai encore" ;
		}
	}
