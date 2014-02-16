
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
	var output = "";
	switch(get_radio_value("format")) {
		case "json":
		jsonOut=to_json(wb);//get JSON object for the whole xls file, multiple sheets
		var activeSheet;
			var jsonOutput;
			activeSheet = getLargestSheetFromObject(jsonOut);	//get shhet name for the largest sheet, assumed to be the important one	
			var newOuput1=rejigColumns(jsonOut[activeSheet]);  //work out which columns are which & move to ColA=number then firstname surname
			output = JSON.stringify(newOuput1, 2, 2);
			//output = JSON.stringify(jsonOut[activeSheet], 2, 2);
			break;
		case "form":
			output = to_formulae(wb);
			break; 
		default:
			output = to_csv(wb);
	}
	if(out.innerText === undefined) out.textContent = output;
	//else out.innerText = "fred";//output;
	else out.innerText = output;
}

var drop = document.getElementById('drop');
function handleDrop(e) {
	e.stopPropagation();
	e.preventDefault();
	var files = e.dataTransfer.files;
	var i,f;
	for (i = 0, f = files[i]; i != files.length; ++i) {
		var reader = new FileReader();
		var name = f.name;
		reader.onload = function(e) {
			var data = e.target.result;
			if(typeof Worker !== 'undefined') {
				xlsworker(data, process_wb);
			} else {
				var cfb = XLS.CFB.read(data, {type: 'binary'});
				//var arr = String.fromCharCode.apply(null, new Uint8Array(data));
				//var cfb = XLS.CFB.read(btoa(arr), {type: 'base64'});
				var wb = XLS.parse_xlscfb(cfb);
				process_wb(wb);
			}
		};
		reader.readAsBinaryString(f);
		//reader.readAsArrayBuffer(f);
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
			for (var R = range.s.r ; R <= range.e.r; ++R) { //changed to start at 1st row assuming no headers
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

function rejigColumns(sheet){ /* identify columns for membership number, firstname and surname
****************  Use Allan Edwards ==#1 and Brian Thomas ==#2 as key indicators
  ****            search the sheet looking for any array entry containg Allan and Edwards in any columns 
  ****   		Then rename columns ****/
var newSheet = new Array();

var theRow = {};
var columnMap = {};

 for(var i = 0; i < sheet.length; i++) {
if ((rowContains(sheet[i],"edwards") ) && (rowContains(sheet[i],"allan"))) {
theRow = sheet[i];  // I have found Allan Edwards row, use this to define columns doe membership number, firstname and Surname
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
newSheet[i]["FirstName"] = sheet[i][columnMap["FirstName"]];
newSheet[i]["SurName"] = sheet[i][columnMap["SurName"]];
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