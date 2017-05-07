VF = Vex.Flow ;

var score = new function()
{
	
	this.Display = function (canvas)
	{
		
		var canvas = canvas; 
		
		var notes = new Array();

		var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.SVG);
		
		var ctx = renderer.getContext();
		
		var formatter, 
		voice, 
		noteIndex = 0, 
		numBeats = 4, 
		beatValue = 4;
		
		const MAX_STAVE_WIDTH = 550 ;
		
		var stave = new VF.Stave(10, 40, MAX_STAVE_WIDTH) ;

		this.init = function()
		{
			processStave();
			drawStave();
		};

		function processStave() {
			stave = new Vex.Flow.Stave(10, 20, MAX_STAVE_WIDTH);
			stave.addClef("treble");
			stave.addTimeSignature(numBeats + "/" + beatValue);
			stave.addKeySignature("C");
		}
		
		function processNotes() {

			// create a voice in 4/4
			voice = new Vex.Flow.Voice({
				num_beats: numBeats,
				beat_value: beatValue,
				resolution: Vex.Flow.RESOLUTION
			});
			
			// turn off tick counter
			voice.setStrict(false);
			
			// Add notes to voice
			voice.addTickables(notes);
					
			// Format and justify the notes
			var voiceSize = notes.length * 85 - 50;
			formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], voiceSize);
		}


		function drawStave() {
			stave.setContext(ctx).draw();
		}
		
		function drawNotes() {
			voice.draw(ctx, stave);
		}
		
		this.addNote = function(staveNoteObj) 
		{
			var noteWidth = (notes.length+1) * 180;
			if (noteWidth<=stave.width) {
				notes.splice(notes.length, 1, new Vex.Flow.StaveNote(staveNoteObj));
			}
			else 
			{
				alert("Cannot add anymore notes!" );
			}
				
			ctx.clear();
			processStave();
			processNotes();
			drawStave();
			drawNotes();
		}

		this.clean = function() 
		{
			while(notes.length > 0)
			{
				this.deleteNote() ;
			}
		}
		
		this.deleteNote = function() 
		{
			notes.splice(noteIndex, 1);
			
			ctx.clear();
			processStave();
			drawStave();
			if (notes.length > 0) {
				processNotes();
				drawNotes();
			}
		}

	};
	
};