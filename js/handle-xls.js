 
function xlsworker(data, cb) {
	var worker = new Worker("js/xlsworker.js");
	worker.onmessage = function(e) {
		switch(e.data.t) {
			case 'ready': break;
			case 'e': console.error(e.data.d);
			case 'xls': cb(e.data.d); break;
		}
	};
	worker.postMessage(data);
}

function get_radio_value( radioName ) {
	var radios = document.getElementsByName( radioName );
	for( var i = 0; i < radios.length; i++ ) {
		if( radios[i].checked ) {
			return radios[i].value;
		}
}	
//	return "json";
}

function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		//var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
	var roa =	sheet_to_row_object_array_add_headings(workbook.Sheets[sheetName],["c1","c2","c3","c4","c5","c6","c7","c8","c9","c10"]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});
	return result;
}

function to_csv(workbook) {
	var result = [];
	workbook.SheetNames.forEach(function(sheetName) {
		var csv = XLS.utils.make_csv(workbook.Sheets[sheetName]);
		if(csv.length > 0){
			result.push("SHEET: " + sheetName);
			result.push("");
			result.push(csv);
		}
	});
	return result.join("\n");
}

function to_formulae(workbook) {
	var result = [];
	workbook.SheetNames.forEach(function(sheetName) {
		var formulae = XLS.utils.get_formulae(workbook.Sheets[sheetName]);
		if(formulae.length > 0){
			result.push("SHEET: " + sheetName);
			result.push("");
			result.push(formulae.join("\n"));
		}
	});
	return result.join("\n");
}

var tarea = document.getElementById('b64data');
function b64it() {
	var cfb = XLS.CFB.read(tarea.value, {type: 'base64'});
	var wb = XLS.parse_xlscfb(cfb);
	process_wb(wb);
}

function process_wb(wb) {
	var output = "",
	jsonOut;
	/*switch(get_radio_value("format")) {
		case "json": */  // Forced to json
		jsonOut=to_json(wb);//get JSON object for the whole xls file, multiple sheets
		var activeSheet;
			var jsonOutput;
			activeSheet = getLargestSheetFromObject(jsonOut);	//get shhet name for the largest sheet, assumed to be the important one	
			var newOutput1=rejigColumns(jsonOut[activeSheet]);  //work out which columns are which & move to ColA=number then SurName SurName
			sortOutput1(newOutput1);
			insertBlankMembers(newOutput1);
			padToFullPages(newOutput1,12); //pad pages to multiple of 12
			output = JSON.stringify(newOutput1, 2, 2);
			//output = JSON.stringify(jsonOut[activeSheet], 2, 2);

	if($(".grid-pane").text === undefined) out.textContent = output;
	//else out.innerText = "fred";//output;
	else $(".grid-pane").text(output);
	createCards('show',output);
}

var drop = document.getElementById('drop');
function handleDrop(e) {
	e.stopPropagation();
	e.preventDefault();
	var file = e.dataTransfer.files[0];

//	for (i = 0, f = files[i]; i != files.length; ++i) {
		var reader = new FileReader();
		var name = file.name;
		$('#fileNameText').text(file.name);
		
		reader.onload = function(e) {
			 data = e.target.result;
			fileOnLoad(data);
		};
			reader.readAsBinaryString(file);
		//reader.readAsArrayBuffer(f);
	

}
function fileOnLoad(dta) {
	
	/*			if(typeof Worker !== 'undefined') {
				xlsworker(dta, process_wb);
			} else */ {
				var cfb = XLS.CFB.read(dta, {type: 'binary'});
				//var arr = String.fromCharCode.apply(null, new Uint8Array(data));
				//var cfb = XLS.CFB.read(btoa(arr), {type: 'base64'});
				var wb = XLS.parse_xlscfb(cfb);
				process_wb(wb);
			}
}
   function handleFileSelect(e) {
  // 	e.stopPropagation();
	//e.preventDefault();
 
			var file = fileInput.files[0];
			
		$('#fileNameText').text(file.name);
			//var tempval=fileInput.value;
			//fileInput.value = "C:\fakepath\Freddy 2014 Cards List.xls";
			//var textType = /text.*/;

	
				var reader = new FileReader();
				reader.onload = function(e) {
			 data = e.target.result;
			fileOnLoad(data);

		};
		reader.readAsBinaryString(file);

				

}
function handleallMembers(e) {
var clearDisplay =1;
//if (fileInput.files.length >0) {
if (typeof data!='undefined'){
var file=fileInput.files[0];

			fileOnLoad(data);
}

}
function setFY() {
//var x = document.getElementById("fyText").value;
var x =$( "#spinner" ).spinner( "value" );
 localStorage.storedFY = x;
var toFY = parseInt(x) +1;
document.getElementById("FY").innerHTML="(October "+x+ "- September "+ (toFY) +")";
// ** if both memberList and data are undefined there is nothing to update
// if only data is undefined its a page of blanks to update
// if data is defined then need to perform an update on the cards
	//if (typeof data!='undefined'){
	if (data!=0x0){
	fileOnLoad(data);
	} else {
		if(typeof memberList!='undefined'){ // data is undefined so haven't read a file, only blanks to display
		 createCards("blanks"); 	
		}
	}
}
function sheet_to_row_object_array_add_headings(sheet, headings){ //column headings are an array of strings to be used as the headings i.e. Row 0
	var val, rowObject, range, columnHeaders, emptyRow, C;
	var outSheet = [];
	if (sheet["!ref"]) {
		range = XLS.utils.decode_range(sheet["!ref"]);

		columnHeaders = {};
		if (headings== "undefined") {
		for (C = range.s.c; C <= range.e.c; ++C) {
			val = sheet[encode_cell({
				c: C,
				r: range.s.r
			})];
			if(val){
				switch(val.t) {
					case 's': case 'str': columnHeaders[C] = JSON.parse(val.v); break;
					case 'n': columnHeaders[C] = val.v; break;
				}
			}
		} } else {
		for (C = 0; C <headings.length; ++C) {
		columnHeaders[C] = headings[C];
		
		  }
		}

	//	for (var R = range.s.r + 1; R <= range.e.r; ++R) {
			for (var R = range.s.r ; R < range.e.r; ++R) { //changed to start at 1st row assuming no headers
			emptyRow = true;
			//Row number is recorded in the prototype
			//so that it doesn't appear when stringified.
			rowObject = Object.create({ __rowNum__ : R });
			for (C = range.s.c; C <= range.e.c; ++C) {
				val = sheet[XLS.utils.encode_cell({
					c: C,
					r: R
				})];
				var v = (val || {}).v;
				if(val !== undefined) switch(val.t){
					case 's': case 'str':
						if(v !== undefined) v = JSON.parse(v);
					/* falls through */
					case 'b': case 'n':
						if(v !== undefined) {
							rowObject[columnHeaders[C]] = v;
							emptyRow = false;
						}
						break;
					case 'e': break; /* throw */
					default: throw 'unrecognized type ' + val.t;
				}
			}
			if(!emptyRow) {
				outSheet.push(rowObject);
			}
		}
	}
	return outSheet;
}
function getLargestSheetFromObject(sheets) { 

			var sheetsKeys= new Array();
		var sheetsVals= new Array();
		var sheetsi=0;
		var bigSheet=0;
		var bigSheeti=0;
			$.each(sheets, function(key,val){
			sheetsKeys[sheetsi]=key;
			sheetsVals[sheetsi] =val;
			if(val.length >bigSheet) {bigSheeti = sheetsi;
									bigSheet = val.length;}
			sheetsi++;
			});
var activeSheet=sheetsKeys[bigSheeti];  

return activeSheet;
}

function rejigColumns(sheet){ /* identify columns for membership number, SurName and SurName
****************  Use Allan Edwards ==#1 and Brian Thomas ==#2 as key indicators
  ****            search the sheet looking for any array entry containg Allan and Edwards in any columns 
  ****   		Then rename columns ****/
var newSheet = new Array();

var theRow = {};
var columnMap = {};

 for(var i = 0; i < sheet.length; i++) {
if ((rowContains(sheet[i],"edwards") ) && (rowContains(sheet[i],"allan"))) {
theRow = sheet[i];  // I have found Allan Edwards row, use this to define columns doe membership number, SurName and SurName
	$.each(theRow, function(key,val){ // perform mapping looking at Allan's row
	switch  (val)
		{
		case 1:
		columnMap["MembNum"]=key;
		break;
		case "Allan":
		columnMap["FirstName"]=key;
		break;
		case "Edwards":
		columnMap["SurName"]=key;
		break
		} 

		});
break;  // Found the mapping of the columns from c1, c2 etc to membNum etc
}
}
// *****  now move existing sheet ( c1,c2 etc ) over to newSheet (membNum etc)
for(var i = 0; i < sheet.length; i++) {
newSheet[i]={};
newSheet[i]["MembNum"] = sheet[i][columnMap["MembNum"]];
newSheet[i]["SurName"] = sheet[i][columnMap["SurName"]];
newSheet[i]["FirstName"] = sheet[i][columnMap["FirstName"]];
}

return newSheet;  //Return the re-sorted sheet containing only 3 columns with the correct column names
};

function rowContains(aRow,aString){ // return true if the object aRow contains the relevant string (forced into lowercase), the row is an object with keys c2, c2 etc
var rowKeys= new Array();
var rowVals= new Array();
var foundString = false;
$.each(aRow, function(key,val){
if ((typeof val ==="string"   ) && (val.toLowerCase() == aString)) {
 foundString =true;
 return (false);}
} );
if (foundString) { return true;}
else 
{return false;}
}
function sortOutput1(newOut) {
//*****************before sorting remove any blank rows
for(var i = 0; i < newOut.length; i++) {
	if (newOut[i]["MembNum"]===undefined) {
		newOut.splice(i,1); 
		i--; // if there are multiple blanks lines go back one & try again
		}
	}
newOut.sort(function (a, b) {
   if (a.MembNum > b.MembNum)
      return 1;
    if (a.MembNum < b.MembNum)
      return -1;
   
});
return newOut;
}
function insertBlankMembers(newOut){
var prevNum=0;
var gapSize=0;
for(var i = 0; i < newOut.length; i++) {
gapSize=(newOut[i].MembNum -prevNum );
if (gapSize>1) { //there is a gap, insert a number of blank rows
		for (var j=0; j < gapSize-1;j++) {
			newOut.splice(i+j,0,{"MembNum":prevNum+1+j,"FirstName":"","SurName":""});
			}
		}
		prevNum= newOut[i].MembNum;
	}
	return newOut;
}

function padToFullPages(newOut,cardsPerPage) { // pad out to full pages
var cardsLastPage = newOut.length%cardsPerPage;
var blankCards = cardsPerPage-cardsLastPage;
var firstBlank= newOut.length;
	for (var i=0; i< blankCards;i++) {
//	newOut.splice(i+firstBlank,0,{"MembNum":firstBlank+1+i,"FirstName":"","SurName":""});
newOut.splice(i+firstBlank,0,{"MembNum":"   ","FirstName":" ","SurName":" "});
	}
	return newOut;
}
function useOnlyUnused(newOut) {
	for(var i = 0; i < newOut.length; i++) {
		if (newOut[i].SurName.length>0) {
		newOut.splice(i,1); 
		i--; // if there are multiple blanks lines go back one & try again
		}
	}
return newOut;
}