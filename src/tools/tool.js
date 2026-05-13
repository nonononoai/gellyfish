
class Tools{

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
        ctx.globalCompositeOperation = "source-over";
    }

    static hexToRGB(hex){
        const r = parseInt(hex.slise(1,3),16);
        const g = parseInt(hex.slise(3,5),16);
        const b = parseInt(hex.slise(5,7),16);
        const alp = 100;

        return{r, g, b, alp};
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
        const pos = toCanvasCoord(e);
        this.mousepath.push(pos);
        this.draw_dydxline();
        this.index++;
    }
}

export default Tools;