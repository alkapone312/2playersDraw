//-----networking-----
var socket = io();

//canvas
var c = document.createElement('canvas');
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
var ctx = c.getContext('2d');

//script on page
var ready = 0;
var main = document.getElementsByTagName('main')[0];
main.style.display="none";
var time = document.getElementsByTagName('h1')[0];
time.style.top = "0px";
var drawA= document.getElementsByTagName('h1')[1];
drawA.style.bottom = '0px';
drawA.style.display = "none";
socket.on('question',function(x){
	drawA.innerHTML="Rysujesz " + x;
	ready++;
	if(ready==2)
		start();
	});

socket.on('result',function(result)
{
	main.style.display = "none";
	time.style.display = "none";
	drawA.style.display= "none";
	c.style.display = "none";
	var img = new Image();
	img.onload=start;
	img.src=result;
	function start(){
	    document.body.appendChild(img);
	}
});

function send()
{
	//swap interface to drawing and send question to friends
	main.style.display="block";
	document.getElementsByTagName('footer')[0].style.display='none';
	var question = document.getElementsByTagName('input')[0].value;
	socket.emit('question',question);
	ready++;
	if(ready==2)
		start();
}

function start()
{
	drawA.style.display="block";

//colors
var colors = new Array('red','green','blue','yellow','orange','black','white','purple','brown','pink');
var divs = document.getElementsByTagName('div');
for(let i = 0; i < divs.length; i++)
{
	divs[i].style.backgroundColor=colors[i];
	divs[i].addEventListener('click',function(){ctx.fillStyle=colors[i];})
}


//mouse
var mouseX;
var mouseY;
var mouseDown;
document.body.addEventListener('mousemove',function(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
});
document.body.addEventListener('mousedown',function(e){mouseDown=true;});
document.body.addEventListener('mouseup',function(e){mouseDown=false;});


//timer stuff
var timer = 100;
var seconds = 180;

socket.on('timer', function(x){seconds = x;time.innerHTML = seconds;})

//drawing stuff
function frame()
{
	setTimeout(function() {

	if(mouseDown)
	{
		ctx.fillRect(mouseX,mouseY,10,10);
	}

	//timer stuff cd
	// if(timer == 0) {timer = 100;seconds--;}
	// timer--;
	// time.innerHTML=seconds;

	if(seconds != 0)
	{
		requestAnimationFrame(frame);
	}
	else
	{
		socket.emit('result',c.toDataURL());
	}
	},1);
}

	frame();

}