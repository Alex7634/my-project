"use strict";

function Video(canvas, memory, palette) {
    let ctx = canvas.getContext("2d");
    canvas.width = 384;
    canvas.height = 256;

    let canvasData = ctx.getImageData(0, 0, 384, 256);

    for (let i = 0, is = canvas.width * canvas.height * 4; i < is; i++)
        canvasData.data[i] = 255;

    let mode = 0;

    this.init = function() {

    };

    this.setMode = function(m) {
        mode = m;
    };

    const palette16 = [
        [ 0xFF, 0xFF, 0xFF ], [ 0x00, 0xFF, 0xFF ],
        [
            0xFF,
            0x00,
            0xFF,
        ],
        [
            0x00,
            0x00,
            0xFF,
        ],
        [
            0xFF,
            0xFF,
            0x00,
        ],
        [
            0x00,
            0xFF,
            0x00,
        ],
        [
            0xFF,
            0x00,
            0x00,
        ],
        [
            0x00,
            0x00,
            0x00,
        ],
        [
            0x90,
            0x90,
            0x90,
        ],
        [
            0x00,
            0x90,
            0x90,
        ],
        [
            0x90,
            0x00,
            0x90,
        ],
        [
            0x00,
            0x00,
            0x90,
        ],
        [
            0x90,
            0x90,
            0x00,
        ],
        [
            0x00,
            0x90,
            0x00,
        ],
        [
            0x90,
            0x00,
            0x00,
        ],
        [
            0x00,
            0x00,
            0x00,
        ],
    ];

    this.update = function() {
        let va = 0;
        for (let y = 0; y < 256; y += 1) {
            for (let x = 0xc0; x < 0xf0; x += 1) {
                let b = memory[(x * 0x100) | y];
                let c = 0;
                //let c = (mode === 2) ? 0 : memory[mc];
                for (let j = 8; j--; b <<= 1, c <<= 1) {
                    //const color4 = ((b & 0x80) ? 2 : 0) | ((c & 0x80) ? 1 : 0);
                    const color4 = ((b & 0x80) ? 1 : 0)
                    const color16 = palette16[palette[color4]];
                    canvasData.data[va + 0] = color16[0];
                    canvasData.data[va + 1] = color16[1];
                    canvasData.data[va + 2] = color16[2];
                    va += 4;
                }
            }
        }
        ctx.putImageData(canvasData, 0, 0);
    };
}
