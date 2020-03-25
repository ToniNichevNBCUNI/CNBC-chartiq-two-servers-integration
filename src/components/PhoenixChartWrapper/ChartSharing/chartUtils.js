const chartUtils = {
    loadImages: (sources, callback) => {
        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        // get num of sources
        for(var src in sources) {
            numImages++;
        }
        for(var src in sources) {
            images[src] = new Image();
            images[src].setAttribute('crossOrigin', 'anonymous')
            images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback(images);
            }
            };
            images[src].src = sources[src];
        }        
        return images;
    },

    drawText: (dest_ctx, txt, x, y, color, font) => {
        color = color || "#737373";
        font = font || "12px Arial";

        dest_ctx.fillStyle = color;
        dest_ctx.font = font;
        dest_ctx.fillText(txt, x, y);
    }
}

export default chartUtils;