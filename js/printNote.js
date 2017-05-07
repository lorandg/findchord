/**
 * 
 */

	const KEYBOARD_2_NOTE = {
		"q":"c",
		"s":"d",
		"d":"e",
		"f":"f",
		"g":"g",
		"h":"a",
		"j":"b",
	};
	
	function init()
	{
		var display = new score.Display($("#score")[0]) ;
		display.init();

		var pianoKeyboard = new ui.PianoKeyboard($("#keyboard")[0]) ;
		pianoKeyboard.draw() ;
		
		pianoKeyboard.keyPressed(function(event){
			display.deleteNote();
			var vexNote = new VF.StaveNote({
	             clef: "treble",
	             keys: [event.note+"/"+event.octave],
	             duration: "4",
	           });
			display.addNote(vexNote);
			synthe.noteOn(event.note,event.octave) ;
			setTimeout(function(){
				synthe.noteOff(event.note,event.octave)
				}, 100)
		});
		
	}