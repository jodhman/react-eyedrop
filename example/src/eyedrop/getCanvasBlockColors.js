// returns an array of rgb objects [{r:10, g:10, b:10}]
export const getCanvasBlockColors = (canvas, sx, sy, sw, sh) => {
    if (!canvas.getContext) {
        throw new Error("Input element is not a canvas")
    }

    const width = canvas.width;
    const height = canvas.height;

    const ctx = canvas.getContext('2d');

    // do not compute data if they're out of canvas area
    if (sx < 0) { sx = 0 }
    if (sy < 0) { sy = 0 }
    if (sx + sw > width) { sw = width - sx }
    if (sy + sh > height) { sh = height - sy }

    const imageData = ctx.getImageData(sx, sy, sw, sh).data

    let colorBlock = []
    for (var i = 0; i < imageData.length; i += 4) {
        const [r, g, b, a] = imageData.slice(i, i + 4)
        colorBlock.push({ r: r, g: g, b: b });
    }
    return colorBlock;
}