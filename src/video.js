"use strict";

function Video(canvas) {
    let ctx = canvas.getContext("2d");
    canvas.width = 384;
    canvas.height = 256;
    let image = ctx.getImageData(0, 0, 384, 256);

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

    const palette41 = [
        [ 0x00, 0x00, 0x00 ], //  0 - черный
        [ 0xc0, 0x00, 0x00 ], //  1 - красный
        [ 0x00, 0xc0, 0x00 ], //  2 - зеленый
        [ 0x00, 0x00, 0xc0 ]  //  3 - синий
    ]

    const palette42 = [
        [ 0x00, 0xc0, 0xc0 ], //  0 - бирюзовый
        [ 0xc0, 0xc0, 0xc0 ], //  1 - светло-серый
        [ 0xc0, 0xc0, 0x00 ], //  2 - коричневый
        [ 0xc0, 0x00, 0xc0 ]  //  3 - пурпурный
    ]

    let memory
    let color2
    let palette
    let map
    let mode = 0;
    let page = 0;
    let base = 0xc0

    for (let i = 0, is = canvas.width * canvas.height * 4; i < is; i++)
        image.data[i] = 255;

    let map16 = new Array(65536)
    for (let i = 0; i < 65536; i++)
        map16[i] = new Array(8)
    for (let attr = 0; attr < 256; attr++) {
        let fg = attr & 0x0f
        let bg = (attr & 0xf0) >> 4
        for (let val = 0; val < 256; val++) {
            let index = (attr << 8) + val
            for (let pix = 0; pix < 8; pix++) {
                let mask = (val & (0x80 >> pix))
                map16[index][pix] = mask === 0 ? bg : fg
            }
        }
    }

    let map4 = new Array(65536)
    for (let i = 0; i < 65536; i++)
        map4[i] = new Array(8)
    for (let bp1 = 0; bp1 < 256; bp1++) {
        for (let bp0 = 0; bp0 < 256; bp0++) {
            let index = (bp1 << 8) + bp0
            let pix0 = bp0
            let pix1 = bp1
            for (let pix = 0; pix < 8; pix++, pix1<<=1, pix0<<=1)
                map4[index][pix] = ((pix0 & 0x80) >> 6) | ((pix1 & 0x80) >> 7)
        }
    }


    this.set_memory = function(value) {
        memory = value;
    }

    this.set_mode = function(value) {
        mode = value & 0x07
        switch (mode) {
            case 0x0: // монохромный режим, палитра 1 (зеленый/черный)
                color2 = 0x02
                map = map16
                palette = palette16
                break
            case 0x1: // монохромный режим, палитра 2 (желтый/голубой)
                color2 = 0x36
                map = map16
                palette = palette16
                break
            case 0x2: // гашение изображения
            case 0x3: // --------//---------
                color2 = 0x00
                map = map16
                palette = palette16
                break
            case 0x4: // 4-цветный режим, палитра 1
                map = map4
                palette = palette41
                break
            case 0x5: // 4-цветный режим, палитра 2
                map = map4
                palette = palette42
                break
            case 0x6: // 16-цветный режим
            case 0x7: // -------//-------
                map = map16
                palette = palette16
                break
        }
    }

    this.set_page = function(value) {
        // c000...efff - экран 0
        // 8000...afff - экран 1
        // 4000...6fff - экран 2
        // 0000...2fff - экран 3
        page = value & 0x03;
        base = (~page & 0x03) << 6
    }

    this.update = function() {
        let va = 0
        let color
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 48; x++) {
                let b = memory[0][(base+x << 8) | y]
                let c = memory[1][(base+x << 8) | y]
                if (mode < 4)
                    color = map[b | color2 << 8]
                else
                    color = map[b | c << 8]
                for (let p = 0; p < 8; p++) {
                    image.data[va++] = palette[color[p]][0] // R
                    image.data[va++] = palette[color[p]][1] // G
                    image.data[va++] = palette[color[p]][2] // B
                    va++                                    // A
                }
            }
        }
        ctx.putImageData(image, 0, 0);
    }
}
