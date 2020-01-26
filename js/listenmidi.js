/**
 * 
 */

var MidiInput = function(listener)
{
	var listener = listener ;
	
	var midiAccess = null; // the MIDIAccess object.

	
	function onMIDIInit(midi) {
		midiAccess = midi;

		var haveAtLeastOneDevice = false;
		var inputs = midiAccess.inputs.values();
		for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
			input.value.onmidimessage = MIDIMessageEventHandler;
			haveAtLeastOneDevice = true;
		}
		if (!haveAtLeastOneDevice)
			console.log("No MIDI input devices present.  You're gonna have a bad time.");
	}

	function onMIDIReject(err) {
		console.log("The MIDI system failed to start.  You're gonna have a bad time.");
	}


	function MIDIMessageEventHandler(event) {
		// Mask off the lower nibble (MIDI channel, which we don't care about)
		switch (event.data[0] & 0xf0) {
		case 0x90:
			if (event.data[2] != 0) { // if velocity != 0, this is a note-on
										// message
				var value = event.data[1];

				listener(true, event.data[1]);

				return;
			}
			// if velocity == 0, fall thru: it's a note-off. MIDI's weird, y'all.
		case 0x80:
			listener(false, event.data[1]);
			return;
		}
	}

	
	function oMidiInput(){
		if (navigator.requestMIDIAccess)
			navigator.requestMIDIAccess().then(onMIDIInit,
					onMIDIReject);
		else
			console.log("No MIDI support present in your browser.  You're gonna have a bad time.") ;
	}
	
	oMidiInput.prototype =
	{
		
	}
	
	return new oMidiInput() ;
	
	
}

