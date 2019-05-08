//label region and color data set
let coffeeRegion = [    
    {country:"BRAZIL", color:"AntiqueWhite"}, 
    {country:"COSTA RICA", color:"Aqua"},      
    {country:"KENYA", color:"BlueViolet"},
    {country:"ETHIOPIA", color:"Chartreuse"},
    {country:"BOURBON", color:"DarkGoldenRod"},
    {country:"EL SALVADOR", color:"ForestGreen"}
  ];

  var textTitle = "";
  var textEdit = ""; //textTitle without /n character
  var labelColor = "";
  var label = document.getElementById('coffee-label-color'); 
  var spacing = document.getElementById('coffee-label-name');
  var labelSpacing = "-75px";

  //Compare text to region array
document.getElementById('coffee-label-name').addEventListener('keyup', function() {
    textTitle = document.getElementById('coffee-label-name').value.toUpperCase();
    
     if(textTitle != ""){
     //define color
       for (var i = 0; i < coffeeRegion.length; i++) {
         if (textTitle === coffeeRegion[i].country) labelColor = coffeeRegion[i].color; 
         console.log(labelColor); 
         //Set rectangle color
         label.style.background = labelColor;         
       }      
      };    
      
     });

     //If text contains ENTER adjust spacing
document.getElementById('coffee-label-name').addEventListener('keyup', function() {
   if(textTitle != ""){   
     for (var i = 0; i < textTitle.length; i++) {
       if ((textTitle.match(/[\r\n]+/))) labelSpacing = '-58px'; 
       else labelSpacing = '-75px';
       //Set rectangle color
       spacing.style.bottom = labelSpacing;
     }      
    };     
   });

     
//Create list to view already completed names
//Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    e.target.parentElement.removeChild(e.target);    
    }
};

// Create a new list item when clicking on the "Add" button
function newElement() {
  
  var li = document.createElement("li");
  var inputValue = document.getElementById("coffee-label-name").value.toUpperCase();
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    var timeout;
    var errorMessage = document.getElementById("error-message")
    errorMessage.innerHTML = "Kavos be pavadinimo nebūna!";
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      errorMessage.innerHTML = "";
      }, 3000);
      return false;
    
  } else {
    /* document.getElementById("sectionList").style.display = "inline-block"; */
    document.getElementById("label-export-list").appendChild(li);
    
  }
  
  document.getElementById("coffee-label-name").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("delete");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement; 
      //Prepare string for AJAX to send a delete request     
      var stringTemp = div.innerHTML.split("<span ");
      var stringLabelDelete250g = "250g_" + stringTemp[0].replace(/\s/g, "_");
      var stringLabelDelete1kg = "1kg_" + stringTemp[0].replace(/\s/g, "_");

      $.ajax({
        url: 'delete.php',
        type: 'post',
        data: {'filename' : stringLabelDelete1kg, stringLabelDelete250g},
        success: function(data){
           console.log(stringLabelDelete1kg + ' Deleted');         
        
        }
     });
     $.ajax({
      url: 'delete.php',
      type: 'post',
      data: {'filename' : stringLabelDelete250g},
      success: function(data){
         console.log(stringLabelDelete250g + ' Deleted');
         //Remove child from list
      div.parentNode.removeChild(div);
      }
   });
     /* //Remove child from list
      div.parentNode.removeChild(div); */
    }
  }
  
};

function generateScreenshot(){
    html2canvas(document.getElementById('coffee-label-color')).then(function(tempCanvas) {
     document.getElementById('test-result').appendChild(tempCanvas);
      // Get base64URL
      var base64URL = tempCanvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
      var image = tempCanvas.toDataURL("image/png");
      image = image.replace('data:image/png;base64,', '');
      
      // AJAX request
      $.ajax({
         url: 'ajaxfile.php',
         type: 'post',
         data: {image: base64URL, 'imgname': textEdit},
         success: function(data){
            console.log('Upload successfully');
         }
      });
      document.getElementById('test-result').removeChild(tempCanvas);
      textTitle = "";
      document.getElementById('coffee-label-name').value = ""; 
      labelColor = 'lightgray';
      label.style.background = labelColor;
    });
   };
//Create 250g mockup to canvas
   var mergeCanvas = document.getElementById('mergeCanvas');
   var context = mergeCanvas.getContext('2d'); 
//Create 1kg mockup to canvas
   var mergeCanvas2 = document.getElementById('mergeCanvas2');
   var context2 = mergeCanvas2.getContext('2d');
//Declare image holders
   var img; 
   var img1 = new Image(); img1.src = '250g_MockUP.png';
   var img2 = new Image(); img2.src = '1kg_MockUP1.png';
   var img3 = new Image(); img3.src = 'CoffeeLabel.png';
   var img4 = new Image(); 
    

//load 250g coffee bag image on canvas  
img1.onload = function() {
  mergeCanvas.width = img1.width;
  mergeCanvas.height = img1.height; 
  context.drawImage(img1, 0, 0);
};   
//load 1kg coffee bag image on canvas
img2.onload = function() {
  mergeCanvas2.width = img2.width;
  mergeCanvas2.height = img2.height; 
  context2.drawImage(img2, 0, 0);
};


//generate label image from css block
function generateLabel(){
  var a = $.Deferred();
     html2canvas(document.getElementById('coffee-label-color')).then(function(labelPng) {
     document.getElementById('screenshot').appendChild(labelPng);
     img4.src = labelPng.toDataURL("image/png");
     //save canvas as image
     img = document.getElementById("label-img");
     img.src = labelPng.toDataURL("image/png", 1.0);
     a.resolve();
    });        
    return a;
    
  };

document.getElementById('coffee-label-name').addEventListener('keyup', function generateLabel(){    
       html2canvas(document.getElementById('coffee-label-color')).then(function(labelPng) {
       document.getElementById('screenshot').appendChild(labelPng);
       img4.src = labelPng.toDataURL("image/png");
       //save canvas as image
       img = document.getElementById("label-img");
       img.src = labelPng.toDataURL("image/png", 1.0);       
      });              
    });

//Draw generated label on mock up image
function drawLabel() {
  //On 250g mock up
  var a = $.Deferred();      
    context.drawImage(img4, mergeCanvas.width/2-97, 219);
  //On 1kg mock up
  context2.drawImage(img4, mergeCanvas2.width/2-97, 75);
    a.resolve();    
    return a;
  }; 

/* //save merged canvas as image
function saveBagToPng() {  
  img = document.getElementById("img");
  img.src = mergeCanvas.toDataURL("image/png", 1.0);  
  img.style.display = 'inline';
   } */

function sendBag250g() {
  //Remove /n from name
  textEdit = "250g_"
  textEdit += textTitle.replace(/\s/g, "_");  
  var a = $.Deferred();
  // Get base64URL
  var base64URL = mergeCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
  var image = mergeCanvas.toDataURL("image/png");
  image = image.replace('data:image/png;base64,', '');
  $.ajax({
    url: 'ajaxfile.php',
    type: 'post',
    data: {image: base64URL, 'imgname': textEdit},
    success: function(data){
       console.log(textEdit + ' Upload successfully');
    }
 });   
   a.resolve();
   return a;
};

function sendBag1kg() {
  //Remove /n from name
  textEdit = "1kg_"
  textEdit += textTitle.replace(/\s/g, "_");  
  var a = $.Deferred();
  // Get base64URL
  var base64URL = mergeCanvas2.toDataURL('image/png').replace('image/png', 'image/octet-stream');
  var image = mergeCanvas2.toDataURL("image/png");
  image = image.replace('data:image/png;base64,', '');
  $.ajax({
    url: 'ajaxfile.php',
    type: 'post',
    data: {image: base64URL, 'imgname': textEdit},
    success: function(data){
       console.log(textEdit + ' Upload successfully');
    }
 });
   a.resolve();
   return a;
};

function clear() {
  var a = $.Deferred();
  
  textTitle = "";
  document.getElementById('coffee-label-name').value = ""; 
  labelColor = 'lightgray';
  label.style.background = labelColor;
  img.src = "";

  a.resolve();
   return a;
}
 
function initiate() {
  if (newElement() === false) {    
    console.error('Please coffee label name');    
    return false
    
  }
  else {
drawLabel().then(sendBag250g).then(sendBag1kg).then(clear);
  }
}

//zip labels ajax request
function zip() {
  $(document).ready(function(){
    $('#download').click(function(){
      $.ajax({
        url: 'zipArchive.php',
        type: 'post',
        success: function(response){
          window.location = response;
        }
      });
    });
   });

};
