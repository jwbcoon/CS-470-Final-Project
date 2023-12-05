import { forwardRef, useEffect } from 'react';

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
    const {width, height} = ctx.canvas;
    const widthSpacing = width / 100, heightSpacing = height / 100;
    for (var x = 0; x <= width; x += widthSpacing) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, height);
    }
    for (var y = 0; y <= height; y += heightSpacing) {
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

        const viewport = window.visualViewport;
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const resizedW = img.width / 3 < viewport.width ? viewport.width / 3 : img.width / 3; // resizing conditions

        const imWidth = resizedW;
        const imHeight = resizedW * aspectRatio;
        const magicOffset = { // offset to center image in initial viewport
            width: imWidth / 2 + ((-1 * (img.width <= viewport.width))
                                 * (aspectRatio * img.width * img.width / MAX_CANV_WIDTH))
                               + ((img.width > viewport.width)
                                 * (aspectRatio * img.width * img.width / MAX_CANV_WIDTH)),
            height: imHeight / 2 + (-1 * ((img.height <= viewport.height))
                                 * (aspectRatio * img.height * img.height / MAX_CANV_HEIGHT))
                               + ((img.height > viewport.height)
                                 * (aspectRatio * img.height * img.height / MAX_CANV_HEIGHT))
        }

        resizeCanvasToDisplaySize(ctx.canvas, img, {width: MAX_CANV_WIDTH - imWidth, height: MAX_CANV_HEIGHT - imHeight});
        drawGrid(ctx);
        ctx.drawImage(img,
            MAX_CANV_WIDTH / 2 + magicOffset.width,
            MAX_CANV_HEIGHT / 2 + magicOffset.height,
            imWidth, imHeight);
    }

}

export default forwardRef(function EditCanvas(props, ref) {

    const {src, editorState, ...rest} = props;

    useEffect(() => {

        if (!ref.current) { console.log('cannot render canvas before ref is mounted'); return; }
        if (!editorState.saveImage && !editorState.applyChanges) return;

        const canvas = ref.current;
        const ctx = canvas.getContext('2d');

        if (ctx === null) {
            alert(
              "Unable to initialize WebGL. Your browser or machine may not support it.",
            );
            return;
        }

        resizeCanvasToDisplaySize(canvas);
        drawGrid(ctx, src);

        if (src)
            draw(ctx, src);

    }, [src, editorState]);

    return src
    ?   <canvas ref={ref} {...rest}/> 
    :   (
        <>
            <h1>Drag an Image here to begin editing!</h1>
            <canvas ref={ref} {...rest}/>
        </>
    );

});

