"use strict";

function Video(canvas) {
    let ctx = canvas.getContext("2d");
    canvas.width = 384;
    canvas.height = 256;
    let canvasData = ctx.getImageData(0, 0, 384, 256);

    const palette16 = [
        // R     G     B
        [ 0x00, 0x00, 0x00 ], //  0 - черный
        [ 0x00, 0x00, 0xc0 ], //  1 - синий
        [ 0x00, 0xc0, 0x00 ], //  2 - зеленый
        [ 0x00, 0xc0, 0xc0 ], //  3 - бирюзовый
        [ 0xc0, 0x00, 0x00 ], //  4 - красный
        [ 0xc0, 0x00, 0xc0 ], //  5 - пурпурный
        [ 0xc0, 0xc0, 0x00 ], //  6 - коричневый
        [ 0xc0, 0xc0, 0xc0 ], //  7 - светло-серый
        [ 0x00, 0x00, 0x00 ], //  8 - черный
        [ 0x00, 0x00, 0xff ], //  9 - голубой
        [ 0x00, 0xff, 0x00 ], // 10 - светло-зеленый
        [ 0x00, 0xff, 0xff ], // 11 - светло-бирюзовый
        [ 0xff, 0x00, 0x00 ], // 12 - розовый
        [ 0xff, 0x00, 0xf0 ], // 13 - светло-пурпурный
        [ 0xff, 0xff, 0x00 ], // 14 - желтый
        [ 0xff, 0xff, 0xff ]  // 15 - белый
    ];

    let memory;
    let mode = 0;
    let page = 0;
    let base = 0xc0;

    for (let i = 0, is = canvas.width * canvas.height * 4; i < is; i++)
        canvasData.data[i] = 255;

    this.set_memory = function(value) {
        memory = value;
    }

    this.set_mode = function(value) {
        // 00 - монохромный режим, палитра 1 (зеленый/черный)
        // 01 - --------//-------- палитра 2 (желтый/голубой)
        // 02 - гашение изображения
        // 03 - --------//---------
        // 04 - 4-цветный режим, палитра 1
        // 05 - -------//------- палитра 2
        // 06 - 16-цветный режим
        // 07 - -------//-------
        mode = value & 0x07;
    }

    this.set_page = function(value) {
        // C000-EFFFH - экран 1
        // 8000-AFFFH - экран 2
        // 4000-6FFFH - экран 3
        // 0000-2FFFH - экран 4
        page = value & 0x03;
    }

    this.update = function() {
        let va = 0
        let color;
        let color16;
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 48; x++) {
                let b = memory[0][(base+x << 8) | y]
                let c = color = memory[1][(base+x << 8) | y]
                //let c = (mode === 2) ? 0 : memory[mc];
                for (let j = 8; j--; b <<= 1, c <<= 1) {
                    //const color4 = ((b & 0x80) ? 2 : 0) | ((c & 0x80) ? 1 : 0);
                    //const color4 = ((b & 0x80) ? 1 : 0)
                    //const color16 = palette16[palette[color4]];
                    switch (mode) {
                        case 0x0: // монохромный режим, палитра 1 (зеленый/черный)
                            color16 = palette16[(b & 0x80) ? 2 : 0]
                            break
                        case 0x1: // монохромный режим, палитра 2 (желтый/голубой)
                            break
                        case 0x2: // гашение изображения
                        case 0x3: // --------//---------
                            break
                        case 0x4: // 4-цветный режим, палитра 1
                            break
                        case 0x5: // 4-цветный режим, палитра 2
                            break
                        case 0x6: // 16-цветный режим
                        case 0x7: // -------//-------
                            color16 = palette16[(b & 0x80) ? color & 0x0f : color >> 4]
                            break
                    }
                    canvasData.data[va++] = color16[0]; // R
                    canvasData.data[va++] = color16[1]; // G
                    canvasData.data[va++] = color16[2]; // B
                    va++;                               // A
                }
            }
        }
        ctx.putImageData(canvasData, 0, 0);
    }
}
