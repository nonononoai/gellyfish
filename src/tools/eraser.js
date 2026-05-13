import Tools from "./tool";

class eraser extends Tools{
    
    mousepath = [];
    index=0;
    ctx = null;
    size = 12;
    color ={
        r:0,
        g:0,
        b:0,
        alp:100
    }
    constructor(startPos, ctx2d){
        this.mousepath = [startPos];
        this.index = 0;
        this.ctx = ctx2d;

        this.sizeselector = document.getElementById('sizeselector');
        if(sizeselector.checkValidity()) this.size = sizeselector.value;
        ctx.lineWidth = this.size;
        
        
        this.colorbtn = document.getElementById('colorbtn');
        this.color = this.hexToRGB(this.colorbtn.value);
        ctx.strokeStyle = `${this.color.r} ${this.color.g} ${this.color.b} / ${this.color.alp}%`;

       
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = "source-overdestination-out";
    }

}