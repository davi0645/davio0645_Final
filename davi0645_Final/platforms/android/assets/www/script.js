// JavaScript Document
document.addEventListener("DOMContentLoaded", function(){
	document.addEventListener("deviceready", function() {
		//Global variables
		var req;
		var radioTop = document.getElementById('radioTop');
    	var radioBottom = document.getElementById('radioBottom');
    	var takePhoto = document.getElementById("takeBtn");
    	var listPhoto = document.getElementById("listBtn");
    	var delPho = document.querySelectorAll("deleteBtn");
    	var context;
    	var processedImage;
    	var pictureCanvas;
    	var workingThumb;

		//Add listeners
		var pages = document.querySelectorAll(".tab");
		for(var i = 0; i < pages.length; i++) {
			pages[i].addEventListener("click", handleTap);
		}

		takePhoto.addEventListener("click", function(){navigator.camera.getPicture(picSuccess, picFail, {quality: 100,
        targetWidth: 100,
        targetHeight: 100,
        destinationType: Camera.DestinationType.FILE_URI});},false);
		//listPhoto.addEventListener("click", function(){displayThumbnails();});
		for (var i = 0; i < delPho.length; i++){
			delPho[i].addEventListener("click", function(ev){deletePhoto(ev);});
		}

    	//Returns an instance of a valid object to use for AJAX
		function createAJAXObj() {
		    try {
		        return new XMLHttpRequest();
		    } catch (er1) {
		       try {
		            return new ActiveXObject("Msxml3.XMLHTTP");
		        } catch (er2) {
		            try {
		                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
		            } catch (er3) {
		                try {
		                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
		                } catch (er4) {
		                    try {
		                        return new ActiveXObject("Msxml2.XMLHTTP");
		                    } catch (er5) {
		                        try {
		                            return new ActiveXObject("Microsoft.XMLHTTP");
		                        } catch (er6) {
		                            return false;
		                        }
		                    }
		                }
		            }
		        }
		    }
		}

		function sendRequest(url, callback, postData) {
		    req = createAJAXObj(), method = (postData) ? "POST" : "GET";
		    if (!req) {
		        return;
		    }
		    req.open(method, url, true);
		    //req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
		    if (postData) {
		        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		    }
		    req.onreadystatechange = function () {
		        if (req.readyState !== 4) {
		            return;
		        }
		        if (req.status !== 200 && req.status !== 304) {
		            return;
		        }
		        callback(req);
		    }
		    req.send(postData);
		}

		function handleTap(e) {
			if(e.target.id == "campage" || e.target.id == "camerapic") {
				var a = document.querySelector("#cameraPage");
				a.className = "active";
				a.display = "block";
				var b = document.querySelector("#gridview")
				b.className = "inactive";
				b.display = "none";
			} else {
				var a = document.querySelector("#gridview");
				a.className = "active";
				a.display = "block";
				var b = document.querySelector("#cameraPage")
				b.className = "inactive";
				b.display = "none";
				getThumbnails();
			}
		}

		function picSuccess(imageURI) {
		    drawImage(imageURI);
		}

		function picFail(message) {
		    alert('Camera Error: ' + message);
		}

		function drawImage(imageURI){
		    processedImage = document.createElement("img");
		  	pictureCanvas = document.getElementById('fullImg');
		  	context = pictureCanvas.getContext('2d');
		  	processedImage.addEventListener("load", function(ev){
			    var imgWidth = ev.currentTarget.width;
			    var imgHeight = ev.currentTarget.height;
			    var aspectRatio = imgWidth / imgHeight;
		  		pictureCanvas.height = 400 / aspectRatio;
			    ev.currentTarget.height = pictureCanvas.height;
			    ev.currentTarget.width = pictureCanvas.height * aspectRatio;
			    var w = processedImage.width;
			    var h = processedImage.height;
			    pictureCanvas.width = w;
			    pictureCanvas.style.width = w + "px";
			    context.drawImage(processedImage, 0, 0, w, h);
			    saveThumb();
		  	});
		    processedImage.crossOrigin = "Anonymous";
		    processedImage.src = imageURI;
		    document.getElementById("addText").addEventListener("click", addTextToImage);
		    document.getElementById("addText").addEventListener("submit", function(ev){
		        ev.preventDefault;
		        addTextToImage(ev);
		    });
		}

		function CloneObject(inObj) 
		{
		    for (i in inObj) 
		    {
		        this[i] = inObj[i];
		    }
		}

		function getThumbnails() {
			var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/list.php?dev=234234";
			sendRequest(url, thunmbnailReturned, null);
		}

		function thunmbnailReturned(xhr){
			var json = JSON.parse(xhr.responseText);
			var div = document.querySelector("[data-role=listview]");
			div.innerHTML="";
			for (var i = 0; i < json.thumbnails.length; i++){
				//Create thumbnail block
				var x = document.createElement("div");
				x.setAttribute("data-ref", json.thumbnails[i].id);
				x.style.display = "block";
				//Create thumbnail image
				var img = document.createElement("img");
				img.src = json.thumbnails[i].data;
				//Variables for width/height
				var w = img.width;
				var h = img.height;
				//Create delete button
				var btn = document.createElement("div");
				btn.setAttribute("class", "deleteBtn");
				var p = document.createElement("p");
		        btn.style.width = "100%";
				p.innerHTML = "Delete";
				p.style.textAlign = "center";
				//Append everything together
				x.appendChild(img);
				btn.appendChild(p);
				x.appendChild(btn);
				div.appendChild(x);
			}
		}

		function saveThumb(){
		  	var imgWidth = processedImage.width;
		  	var imgHeight = processedImage.height;
		  	var aspectRatio = imgWidth / imgHeight;
		  	var h = 200;
		  	var w = 200 * aspectRatio;
		  	var i = document.createElement("img");
		  	i.height = h;
		  	i.width = h * aspectRatio;
		  	i.src = processedImage.src;		        
		    workingThumb = i;
		}

		function saveImage(ev){
			var fullImg = document.getElementById("fullImg");
			var thumb = workingThumb;

			var fullpng = fullImg.toDataURL("image/png");
			var thumbpng = fullImg.toDataURL("image/png");
			fullpng = encodeURIComponent(fullpng);
			thumbpng = encodeURIComponent(thumbpng);
			var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/save.php";
			var postData = "dev=234234&thumb=" + thumbpng + "&img=" + fullpng;
			sendRequest(url, imgSaved, postData);
		}

		function deletePhoto(ev){
			var id = ev.target.parentNode.parentNode.getAttribute("data-ref");
			var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/delete.php?dev=234234&img_id="+id;
			sendRequest(url, function(){confirm("Are you sure you would like to delete it?"); var json = JSON.parse(xhr.responseText); getThumbnails();}, null);
		}

		function imgSaved(xhr){
			//Successful execution
		}

		function addTextToImage(ev){
		  	var txt = document.getElementById("textInput").value;
		    document.getElementById("textInput").innerHTML = "";
		  	if(txt != ""){
			    context.clearRect(0, 0, pictureCanvas.w, pictureCanvas.h);
			   	var w = processedImage.width;
			    var h = processedImage.height;
			    context.drawImage(processedImage, 0, 0, w, h);
			      
			    var bottom = pictureCanvas.height - 50;
			    if(radioTop.checked == true){
			        var bottom = 30;
			    }

			    var middle = pictureCanvas.width / 2;
			    context.font = "18px sans-serif";
			    context.fillStyle = "black";
			    context.strokeStyle = "white";
			    context.textAlign = "center";
			    context.fillText(txt, middle, bottom);
			    context.strokeText(txt, middle, bottom);
		  	}
		}
	});
});