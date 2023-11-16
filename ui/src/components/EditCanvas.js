import {useRef, forwardRef, useEffect, useMemo, useImperativeHandle} from 'react';

const [MAX_CANV_WIDTH, MAX_CANV_HEIGHT] = [8000, 8000];

function resizeCanvasToDisplaySize(canvas, newDims={width: MAX_CANV_WIDTH, height: MAX_CANV_HEIGHT}, offset={width: 0, height: 0}) {
    newDims.width += offset.width;
    newDims.height += offset.height;

    const { width, height } = newDims;
    const deltaWidth = newDims.width - canvas.width;
    const deltaHeight = newDims.height - canvas.height;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    return {deltaWidth: deltaWidth, deltaHeight: deltaHeight}; 
}

function drawGrid(ctx) {
    const width = ctx.canvas.width, height = ctx.canvas.height;
    const widthSpacing = width / 100, heightSpacing = height / 100;
    for (var x = 0; x <= width; x += widthSpacing) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, height);
    }
    for (var y = 0; y <= height; y += widthSpacing) {
        ctx.moveTo(0, 0.5 + y);
        ctx.lineTo(width, 0.5 + y);
    }

    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function draw(ctx, src) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        resizeCanvasToDisplaySize(ctx.canvas, img, {width: MAX_CANV_WIDTH - img.width, height: MAX_CANV_HEIGHT - img.height});
        drawGrid(ctx);
        ctx.drawImage(img, MAX_CANV_WIDTH / 2, MAX_CANV_HEIGHT / 2);
    }
}

function init(canvasDomNode) {
    if (!canvasDomNode) return null;

    const context = canvasDomNode.getContext('2d');

    if (context === null) {
        alert(
          "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }
  
    resizeCanvasToDisplaySize(canvasDomNode);
    drawGrid(context);

    return context;
}

export default forwardRef(function EditCanvas(props, ref) {

    useEffect(() => {
        const ctx = init(ref.current);
        if (props.src)
            draw(ctx, props.src);
    }, [props.src]);

    return props.src
    ?   <canvas ref={ref} {...props}/> 
    :   (
        <>
            <h1>Drag an Image here to begin editing!</h1>
            <canvas ref={ref} {...props}/>
        </>
    );
});

