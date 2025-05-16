"use strict";

function Keyboard() {

    const key_dictionary =
    {
        //X : 00,  // HOME
        //X : 01,  // СТР
        //X : 02,  // ESCAPE
        112 :  3,  // F1
        113 :  4,  // F2
        114 :  5,  // F3
        115 :  6,  // F4
        116 :  7,  // F5

        //X : 08, // TAB
        //X : 09, // ПС
        13 : 10,  // ENTER
         8 : 11,  // BS
        37 : 12,  // LEFT
        38 : 13,  // UP
        39 : 14,  // RIGHT
        40 : 15,  // DOWN

        48 : 16,  // 0
        49 : 17,  // 1
        50 : 18,  // 2
        51 : 19,  // 3
        52 : 20,  // 4
        53 : 21,  // 5
        54 : 22,  // 6
        55 : 23,  // 7
        56 : 24,  // 8
        57 : 25,  // 9

        65 : 33,  // A
        66 : 34,  // B
        67 : 35,  // C
        68 : 36,  // D
        69 : 37,  // E
        70 : 38,  // F
        71 : 39,  // G
        72 : 40,  // H
        73 : 41,  // I
        74 : 42,  // J
        75 : 43,  // K
        76 : 44,  // L
        77 : 45,  // M
        78 : 46,  // N
        79 : 47,  // O
        80 : 48,  // P
        81 : 49,  // Q
        82 : 50,  // R
        83 : 51, // S
        84 : 52,  // T
        85 : 53,  // U
        86 : 54,  // V
        87 : 55, // W
        88 : 56, // X
        89 : 57,   // Y
        90 : 58,  // Z
        32 : 63,  // SPACE

        16 : 69,  // SHIFT // { Key.LeftShift, Keys.VK_SHIFT },
        17 : 70,  // CTRL // { Key.LeftCtrl, Keys.VK_CONTROL },
        18 : 71,  // ALT

        189 : 29, // - // { Key.OemMinus, Keys.VK_MINUS },
        187 : 27, // = // { Key.OemPlus, Keys.VK_EQUALS },

        190 : 30, // . // { Key.OemPeriod, Keys.VK_PERIOD },
        188 : 28, // , // { Key.OemComma, Keys.VK_COMMA },
        186 : 26, // ; // { Key.OemSemicolon, Keys.VK_SEMICOLON },
        222 : 62, // ' // { Key.OemQuotes, Keys.VK_QUOTE },
        191 : 31, // / // { Key.OemQuestion, Keys.VK_SLASH },
        219 : 59, // [ // { Key.OemOpenBrackets, Keys.VK_OPEN_BRACKET },
        221 : 61, // ] // { Key.OemCloseBrackets, Keys.VK_CLOSE_BRACKET },
        220 : 60, // \ // { Key.OemPipe, Keys.VK_BACK_SLASH },
        192 : 32, // ` // { Key.OemTilde, Keys.VK_BACK_QUOTE },


        // 117 : 7, // Б` на F6
        // 118 : 15, // Ю@ на F7
        // 59 : 22,  // Ж[
        //
        // 115 : 24, // RUS
        // 116 : 25, // LAT
        // 109 : 26, // COP на правый -

        // 111 : 28, // NUM LOCK на правом /*
        // 8 : 29,   // 29 BKSPC
        // 20 : 30,  // CAPS
        //
        // 173 : 44, // -= на -_ (Firefox)
        // 106 : 46, // :* на правой *
        // 110 : 49, // Правая .
        // 107 : 52, // +; на правом +
        // 61 : 54,  // ~^ на += (Firefox)
        // 96 : 55,  // Правый 0
        // 45 : 55,  // Правый 0
        //
        // // : 56, // Неизвестная клавиша!
        //
        // 46 : 60, // 60 DEL
        // 36 : 61,
        // 103 : 61, // 7 HOME
        // 37 : 62,
        // 100 : 62, // 4 LEFT
        // 35 : 63,
        // 97 : 63, // 1 END
        // 9 : 66,   // TAB
        //
        // 38 : 69,
        // 104 : 69, // 8 UP
        // 12 : 70,
        // 101 : 70, // Правая 5
        // 40 : 71,
        // 98 : 71, // 2 DOWN
        //
        // 114 : 72, // F1
        // // : 73, // Неизвестная клавиша!
        // 112 : 74, // F2
        // 113 : 75, // F3
        // 27 : 76,  // ESC
        // 33 : 77,
        // 105 : 77, // 9 PGUP
        // 39 : 78,
        // 102 : 78, // 6 RIGHT
        // 34 : 79,
        // 99 : 79, // 3 PGDN
    };

    let key_matrix = [ 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff ];
    let matrix_row = 0;

    this.reset = function() {
        key_matrix = [ 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff ];
    };

    function key_press(pressed, e) {
        let browser_code = 'which' in e ? e.which : e.keyCode;
        let code = key_dictionary[browser_code];
        if (code === undefined)
            return;

        //let row = code % 16, col = (code - row) / 8;
        let col = code % 8, row = (code - col) / 8;
        if (pressed)
            //key_matrix[col] &= ~(1 << row);
            //key_matrix[col] |= (1 << row);
            //key_matrix[row] &= (1 << col) ^ 0xff;
            key_matrix[row] &= ~(1 << col);
        else
            //key_matrix[col] |= (1 << row);
            //key_matrix[col] &= ~(1 << row);
            key_matrix[row] |= (1 << col);
    }

    this.read = function(addr) {
        if (addr === 0)
            return matrix_row;
        else if (addr === 1)
            return key_matrix[matrix_row];
        else if (addr === 2)
            return key_matrix[8];
        else
            return 0xff;
    };

    this.write = function(value) {
        if ((value & 0x01) === 0) matrix_row = 0;
        if ((value & 0x02) === 0) matrix_row = 1;
        if ((value & 0x04) === 0) matrix_row = 2;
        if ((value & 0x08) === 0) matrix_row = 3;
        if ((value & 0x10) === 0) matrix_row = 4;
        if ((value & 0x20) === 0) matrix_row = 5;
        if ((value & 0x40) === 0) matrix_row = 6;
        if ((value & 0x80) === 0) matrix_row = 7;
    };

    document.onkeydown = function(e) {
        key_press(true, e);
    };

    document.onkeyup = function(e) {
        key_press(false, e);
    };


}
