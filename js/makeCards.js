
/********************************createCards  *****/
function createCards(option) {
var FY="(October 2013 - September 2014)";
var MEMBNAME  = "LAURIE YATES", MEMBNUM="001";

var doc = new jsPDF("portrait", "mm","a4",true);

// We'll make our own renderer to skip this editor
/*var specialElementHandlers = {
        '#editor': function(element, renderer){
                return true;
        }
};*/
var fontlist = doc.getFontList();
var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAlAD4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1XU9Yh00orozswLHDBQo6ZJNUV8VQuGKW+4KMtiZDge/NQ+JADd4IBH2ZuD9a43wCq/2HJ8o5uGzx7LXlYrFVaUas429xxW2/Mr9zenCMpQi/tX/A7G88c6dp9i93cwy7AdqeUVfe393g8HvzWSnxY0uQEppeoPjrtVTj9a5vxUqr4StgqhR9oHAGP71Y2hXxkl0+0aWCBba4Mi4BEkpP8OenPTkivUwc3UwbryjdptdtF9/9anDXk4V1TTtdL8T0Gz+Kui3V1HA9reQiQ7Q7KpAPboc1uN4jCgsbGRVAyS0ijA9+a8c1HzD4tLS2htGa4Q+UcccjnjjnrxXe68ss+nS2VuwWa5VlBPoBk/4fjXJmWIlRlQVKyU1d31tt1XY2widSNTn15Xp0udMPEgIDfYZCpGcq6nI9ua2IZUnhSaM5SRQyn2Neb+EdQ+3aBErHMlt+6b8On6Y/KvQdL/5BNp/1wT/0EVnha1eVerRrWvB20+ZvOMPZwnD7SMzXraaS7ilWCSWMxFG2KWIOe4FctpGhajokU1tbRPJA8hdDJbuGTIxg4GD09q7u9jv32mxuIoiAciVNwJ7dPxqCWHWm8sRXVquFActGTk9yK1qYGFVybk7StdaW026EKq42str2+e/U4bxH4f1O/wDD6WtjYzyvburtuTaWHIOM9TznFYKaJrLRaes3hm8U2JzmGIAzc5G49R0969TaDX8ki9s+v3fKOP5/WpWg1cQEJeQGUkYLRcAc56de3612YelChSVJa2bd7u93o9rdzmqp1J8+2iX3HlMugeKdc8RRXc+izQfOv3htVFU56muubTrqa/M1xZPJEE2ojWzErzkn054/Kuomg1fcvkXlvtwu4PF19cYPGfxps8GtGRvs97bLGWJUPCSQOw61jisLSxChH4VFWVu2ndPsaUZSpOT3bd3c4rSfDt/pWpXVxHHI0N0cmBbZxtOcjBP1NegWETwafbwyDDxxKrDPcCqcsWuFEEN1aBguHLRk5bJ5+mMflWlGHEaCQguFG4joT3ohQUJuo5XbsunTRbJFKV0opWS/X5jqKKK1AKKKKACiiigAooooA//Z'

doc.addImage(imgData, 'JPEG', -10,-10, 16, 10,'u3aLogo');
makeLines(doc);
// All units are in the set measurement for the document
// This can be changed to "pt" (points), "mm" (Default), "cm", "in"
/*var stringSize=0;
doc.setFontSize(10);
doc.cellInitialize();
doc.cell(10,10, 60, 10, ["MEMBERSHIP CARD"], 1, 'right');   */

 horizonMove=81,vertMove= 42;//
var cardSize = {wd:80,ht:41};
var firstCard = {x:24,y:20};
var cardGaps = {x:1,y:1};
var nextCard=new Object();
//doc.addImage(imgData, 'JPEG', nextCard.x+(cardSize.wd/2)-8, nextCard.y+0.5, 16, 10);
for (cardPage=1;cardPage<51;cardPage++) {
nextCard.x=firstCard.x,nextCard.y =firstCard.y-vertMove;
//doc.rect(nextCard.x,nextCard.y,cardSize.ht,cardSize.wd);
if (cardPage!=1) doc.addPage();
for (i=0;i<12;i++) {
if (i%2 !=1)
{// left side so move down
nextCard.x = firstCard.x;
nextCard.y += vertMove;
}
else
{// right side so move across
nextCard.x += horizonMove;
}
doc.rect(nextCard.x,nextCard.y,cardSize.wd,cardSize.ht);

//doc.addImage(imgData, 'JPEG', nextCard.x+(cardSize.wd/2)-8, nextCard.y+0.5, 16, 10);
doc.addImage('u3aLogo', 'JPEG', nextCard.x+(cardSize.wd/2)-8, nextCard.y+0.5, 16, 10);
/*doc.setFontSize(12);
var textSize = doc.getStringUnitWidth("(Marbella & Inland)") * 12;
textSize=40;*/
centreText(doc, "(Marbella & Inland)", (nextCard.x),cardSize.wd,(nextCard.y)+18, 'times', 12,'bold') ;

//var textLoc= nextCard.x+(cardSize.wd/2)-(textSize/2);
//doc.text("(Marbella & Inland)", nextCard.x+(cardSize.wd/2)-(textSize/2),(nextCard.y)+13);
/*textSize=36;

doc.setFontSize(10);
stringSize= doc.getTextDimensions("MEMBERSHIP CARD");
doc.text("MEMBERSHIP CARD", nextCard.x+(cardSize.wd/2)-(textSize/2),(nextCard.y)+18.5); */
centreText(doc, "MEMBERSHIP CARD", nextCard.x,cardSize.wd,(nextCard.y)+23, 'times', 10,'bold') ;
centreText(doc, FY, nextCard.x,cardSize.wd,(nextCard.y)+26, 'times', 8,'normal') ;
centreText(doc, MEMBNAME, nextCard.x,cardSize.wd,(nextCard.y)+36, 'times', 12,'bold') ;
doc.text(MEMBNUM,nextCard.x+(cardSize.wd*0.8),(nextCard.y)+36);
}


}

if (option==="show") {
var string = doc.output('datauristring');
//doc.output('datauri');
$('.preview-pane').attr('src', string); }
else
{

doc.save('Test.pdf');}
}
/******************************  makeLines *********/
function makeLines(doc) {
doc.setLineWidth(0.1)
doc.setDrawColor(0);

doc.lines([[-8,0],[15,0]], 10,19.7, [1,1]); 
doc.lines([[4,0],[-15,0]], 205,19.7, [1,1]); 
doc.lines([[0,-8],[0,15]], 23.7,10, [1,1]); 
doc.lines([[0,-8],[0,15]], 104.55,10, [1,1]);  
doc.lines([[0,-8],[0,15]], 185.5,10, [1,1]); 
}

/*************** centreText **********/
/***** puts the text  onto the page, params the doc, the text, the LHS location x,the  card width, location y  , font, fontSize, fontStyle  ****   */
function centreText(doc, txt, xLeft, wd,y,font, fontSize,fontStyle) {
doc.setFontSize(fontSize);
doc.setFont(font,fontStyle);
//doc.setFontStyle('italic');
var txtLen=doc.getTextDimensions(txt);

        var canvas = document.createElement('canvas');
		canvas.width = 	wd;
	    canvas.height = 100;
		var ctx = canvas.getContext('2d');
		ctx.font=fontSize+"px "+font	;

txtLen= ctx.measureText(txt).width;
doc.text(txt, xLeft+(wd/2)-(txtLen*25.4/144) ,y);

}