const html = document.querySelector("html");
const canvascontainer = document.querySelector(".container .canvas");
const canvas = document.getElementById('game');
const tools = document.querySelector("body .container .tools")
const ctx = canvas.getContext('2d');
const sizespecifer = document.getElementById('sizespecifer');
const btnZoomIn = document.getElementById("zoomIn");
const btnZoomOut = document.getElementById("zoomOut");
const timer = document.getElementById("timer");
const timeBar = document.getElementById("timeBar");
const btnEraser = document.getElementById("eraserbtn");

let lines = [];
let canvases = [];
let currentLine = null;
let toolsWidth = tools.style.width;
let width = originalWidth = 1900;
let height = originalHeight = 1080;  
let magnificationRatio = 100;
let scaler = 1;
let time = 0;
let mode = 0;

canvas.width = width;
canvas.height = height;
canvas.style.width = width+"px";
canvas.style.height = height+"px";




let leftVal = (canvascontainer.offsetWidth/2) - width/2;
let topVal = (canvascontainer.offsetHeight/2)-height/2;
canvas.style.position = "absolute";
canvas.style.zIndex = `-10`;
canvas.style.left = (canvascontainer.offsetWidth/2 - width/2) + "px";
canvas.style.top =  (canvascontainer.offsetHeight/2 - height/2) + "px";

btnEraser.addEventListener('mousedown', e=>{
    if(mode == 0){
        mode = 1;
    }else{
        mode = 0;
    }
});

btnZoomIn.addEventListener('mousedown', e=>{
    scaler += 0.1;
    width = originalWidth * scaler;
    height = originalHeight * scaler;
    canvas.style.width = width+"px" ;
    canvas.style.height = height + "px";

    canvas.style.left = (canvascontainer.offsetWidth/2 - width/2) + "px";
    canvas.style.top =  (canvascontainer.offsetHeight/2 - height/2) + "px";
});

btnZoomOut.addEventListener('mousedown', e =>{
    scaler -= 0.1;
    width = originalWidth * scaler;
    height = originalHeight * scaler;
    canvas.style.width = width+"px" ;
    canvas.style.height = height + "px";

    canvas.style.left = (canvascontainer.offsetWidth/2 - width/2) + "px";
    canvas.style.top =  (canvascontainer.offsetHeight/2 - height/2) + "px";
});

timeBar.addEventListener('change', e=>{
    time = timeBar.value;
    console.log(timeBar.value);
    timer.textContent = time;
});


html.addEventListener('mousedown', e=>{
    const rect = canvas.getBoundingClientRect();
    const startPos = {x: originalWidth * (e.clientX - rect.left)/width, y: originalHeight * (e.clientY - rect.top)/height};

    if(mode == 0){
        currentLine = new Line(startPos);
        lines.push(currentLine);
        currentLine._moveHandler = currentLine.drawline.bind(currentLine);
        canvas.addEventListener('mousemove', currentLine._moveHandler);
    }else{
        currentLine = new eraser(startPos);
        lines.push(currentLine);
        currentLine._moveHandler = currentLine.drawline.bind(currentLine);
        canvas.addEventListener('mousemove', currentLine._moveHandler);
    }
});

html.addEventListener('mouseup', e=>{
    if (!currentLine) return;
    canvas.removeEventListener('mousemove', currentLine._moveHandler);
    currentLine = null;
});

window.onbeforeunload = function () {
  return "";
};

indexe = 1;
class Line{

    color = "rgb(0 0 0 / 100%)";
    alp = 100;
    size = 12;
    constructor(startPos){
        this.mousepath = [startPos];
        this.index = 0;

        this.sizespecifer = document.getElementById('sizespecifer');
        if(sizespecifer.checkValidity()) this.size = sizespecifer.value;
        ctx.lineWidth = this.size;
        
        
        this.colorbtn = document.getElementById('colorbtn');
        this.color ="rgb( " + parseInt(this.colorbtn.value.substr(1,2), 16)+" "+parseInt(this.colorbtn.value.substr(3,2), 16)+" "+parseInt(this.colorbtn.value.substr(5,2), 16)+" / "+ this.alp +"% )";
        console.log(this.color);
        ctx.strokeStyle =this.color;
        
        
       
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = "source-over";
    }
    draw_dydxline(){
        if(this.index === 0){
            ctx.beginPath();
            ctx.moveTo(this.mousepath[0].x, this.mousepath[0].y);
            return;
        }

        const prev = this.mousepath[this.index-1];
        const curr = this.mousepath[this.index];

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();
    }

    drawline(e){
        const rect = canvas.getBoundingClientRect();
        const pos = {x: originalWidth * (e.clientX - rect.left)/width, y: originalHeight * (e.clientY - rect.top)/height};
        //console.log(e.clientY - rect.top);
        this.mousepath.push(pos);
        this.draw_dydxline();
        this.index++;
    }
}

class eraser{
    constructor(startPos){
        this.mousepath = [startPos];
        this.index = 0;

        
        ctx.strokeStyle = "rgb(0 0 0 / 100%)";
        
        this.sizespecifer = document.getElementById('sizespecifer');
        if(sizespecifer.checkValidity()) this.size = sizespecifer.value;
        ctx.lineWidth = this.size;
       
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.globalCompositeOperation = "destination-out";
            
    }
    
    draw_dydxline(){
        if(this.index === 0){
            ctx.beginPath();
            ctx.moveTo(this.mousepath[0].x, this.mousepath[0].y);
            return;
        }

        const prev = this.mousepath[this.index-1];
        const curr = this.mousepath[this.index];

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();
    }

    drawline(e){
        const rect = canvas.getBoundingClientRect();
        const pos = {x: originalWidth * (e.clientX - rect.left)/width, y: originalHeight * (e.clientY - rect.top)/height};
        this.mousepath.push(pos);
        this.draw_dydxline();
        this.index++;
    }
}

class AniMaker{
    fps = 24;
    duration = 1/24 * 1000;
    tsindex = 0;

    chunks = [];
    constructor(canvases){
        this.encoder = new VideoEncoder({
            output: chunk => chunks.push(chunk),
            error: e => console.log(e)
        });

        this.encoder.configure({
            codec: "vp9",
            width: canvas.width,
            height:canvas.height,
            framerate:24
        });
        for(let c in canvases) {
            VFrame = new VideoFrame(c, {
                duration: this.duration,
                timestamp:this.tsindex*this.duration,
            });
            this.tsindex++;
        }   
    }

    async addFrame(){
        const bitmap = await createImageBitmap(canvas);
        const frame = new VideoFrame(bitmap, {
            timestamp: frameIndex*(1000000 / 24)
        });
        this.encoder.encode(frame);
        frame.close();
        frameIndex++;
    }

    async finish(){
        await this.encoder.flush();

        const webmBlog = new Blog(this.chunks.map(c => c.byteL 
            ? c.copyTo(new ArrayBuffer(c.byteLenght)) 
            : null
        ), {type: "video/webm"});

        return webmBlob;
    }
}
