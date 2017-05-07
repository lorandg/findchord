/**
 * 
 */

var ui = new function()
{
	this.NOTES_CHAR =
		 ["c","d","e","f","g","a","b"] ;

	const KEYBOARD_2_NOTE = {
		"q":"c",
		"s":"d",
		"d":"e",
		"f":"f",
		"g":"g",
		"h":"a",
		"j":"b",
	};
		
	this.PianoKeyboard = function(component)
	{
		var component = component ;
		var keyListener ;
		var lightenedNotes = [] ;
		
		this.draw = function()
		{
			var table = document.createElement("table") ;
			var buttonRow = table.insertRow() ;
			var charRow = table.insertRow() ;
			var chars = Object.keys(KEYBOARD_2_NOTE);
			
			for (var celIdx = 0; celIdx < ui.NOTES_CHAR.length; celIdx++) {
				var btCell = buttonRow.insertCell();
				var bt = document.createElement("button") ;
				bt.setAttribute("class", "keypress") ;
				bt.id = ui.NOTES_CHAR[celIdx] ;
				bt.innerHTML = ui.NOTES_CHAR[celIdx].toUpperCase() ;
				btCell.appendChild(bt) ;	
				
				var char = charRow.insertCell();
				char.align = "center" ;
				char.innerHTML = chars[celIdx].toUpperCase() ;
			};
			
			component.appendChild(table) ;
			
		}
		
		this.keyPressed = function(listener)
		{
			this.keyListener=listener ;
			
			$(".keypress").click(
					function()
					{   var event = {
							note:this.id,
							octave:4
						} ;
					
					listener(event) ;
					}
			) ;
			
			$(document).keyup(function(event){
				var char = String.fromCharCode(event.keyCode).toLowerCase();
				var noteChar=(KEYBOARD_2_NOTE[char]);
				
				if(noteChar != undefined)
				{
					$("#"+noteChar).click() ;
					$("#"+noteChar).focus() ;
				}

						
			}) ;
		}
		
		this.lightUp = function(note)
		{
			var key = note ;
			var slashIdx = note.indexOf("/") ;
			
			if(slashIdx>-1)
			{
				key = note.substring(0,slashIdx) ;
			}
			
			$("#"+key)[0].style="color:green" ;
			
			lightenedNotes.push(note);
			lightenedNotes.sort() ;
		}
		
		this.turnAllOff= function()
		{
			for (var int = 0; int < lightenedNotes.length; int++) {
				var note = lightenedNotes[int] ;
				var key = note ;
				var slashIdx = note.indexOf("/") ;
				
				if(slashIdx>-1)
				{
					key = note.substring(0,slashIdx) ;
				}

				$("#"+key)[0].style="color:black" ;
			}
			lightenedNotes=[];
			
		}

		
		this.turnOff = function(note)
		{
			var key = note ;
			var slashIdx = note.indexOf("/") ;
			
			if(slashIdx>-1)
			{
				key = note.substring(0,slashIdx) ;
			}

			$("#"+key)[0].style="color:black" ;

			var index = lightenedNotes.indexOf(note);
			if (index > -1) 
			{
				lightenedNotes.splice(index, 1);
			}
		}
		
		this.lightenedNotes = function()
		{
			return lightenedNotes ;
		}
		
		this.isLightened = function(note)
		{
			return lightenedNotes.includes(note)
		}
	}
	
	
}