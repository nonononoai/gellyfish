const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let lines = [];
let snake = [{x:600, y:400}];
let angle =0;
let line_length =1;
let foods =[];
ctx.fillStyle =  '#111';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let mouse ={x:600, y:400};

function catchmouse(e){
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
}



canvas.addEventListener('mousemove', e=>{
            const rect = canvas.getBoundingClientRect();
            const mouseStartPos={x:e.clientX - rect.left, y:e.clientY - rect.top};

            let instance = new line(mouseStartPos);
            lines.push(instance);

            canvas.addEventListener('mousemove', instance.drawlineBound = instance.drawline.bind(instance));
        }, false);

canvas.addEventListener('mouseup', e=>{
    const last = lines[lines.length-1];
    canvas.removeEventListener('mousemove', last.drawlineBound, false);
});

function calc_angle(mousepath, index){
    let dx = mousepath[index+1].x - mousepath[index].x;
    let dy = mousepath[index+1].y - mousepath[index].y;
    angle = Math.atan2(dy,dx); 
    return angle;
}

class line{

    index = 0;
    mousepath = [];

    constructor(mousePos){
        this.mousepath.push(mousePos);
        this.index = 0;

        ctx.strokeStyle = 'rgb(0, 0, 0, 0%)';
        ctx.lineWidth = 15;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    
    draw_dxdyline(){
        angle = calc_angle(this.mousepath, this.index);
        ctx.beginPath();
        if(this.index === 0) ctx.moveTo(this.mousepath[this.index].x, this.mousepath[this.index].y);
        else ctx.lineTo(this.mousepath[this.index-1].x + Math.cos(angle)*line_length, this.mousepath[this.index-1].y+Math.sin(angle)*line_length);     
        ctx.stroke();   
    }

    drawline(mmEvent){
        catchmouse(mmEvent);
        let pos = {x:mmEvent.clientX, y:mmEvent.clientY};
        this.mousepath.push(pos);
        this.draw_dxdyline();
        this.index++;
    }
}


