function SpiSD() {

    let ctrl_rd = 0b11111101;
    let ctrl_wr = 0xff;

    let disk

    //load_hdd("hdd.ima")
    load_hdd("hdd16.img")
    let sd_card = new SdCard()
    sd_card.set_disk(disk)

    function load_hdd(url) {
        let req = new XMLHttpRequest();
        req.overrideMimeType('text/plain; charset=x-user-defined');
        req.addEventListener('load', function() {
            if (this.status !== 200) {
                console.error('load remote file: error ' + this.status + ' while trying to read url ' + url);
                return;
            }
            let filestream = this.response;
            disk = new Uint8Array(filestream.length)
            for (let n = 0; n < filestream.length; n++)
                disk[n] = filestream.charCodeAt(n) & 0xff; // Throw away high-order byte
        })
        req.open('get', url, false);
        req.send();
    }


    function toHex2(num) {
        if (num === null || num === undefined) return num;
        var res = num.toString(16);
        if (num >= 0 && (res.length % 2)) return "0" + res;
        else return res;
    }

    function log(str) {
        var args = [ ">> wmsx:" ];
        Array.prototype.push.apply(args, arguments);
        console.log.apply(console, args);
        //console.log(str);
        // this.logs.push(str);
    }

    this.read = function(port) {
        let result;
        if (port === 0)
            return ctrl_rd;
        else if (port === 1) {
            result = sd_card.read();
            //System.out.println("In : "+ Util.hex((byte)result));
            return result;
        }
        else
            return 0xff;
    }

    this.write = function(port, val) {
        if (port === 0)
            return ctrl_wr = val;
        else if (port === 1) {

            // if (value == 0x51) {
            //     cmd17_on = true;
            //     cnt_cmd = 6;
            // }
            // if (cmd17_on) {
            //     cnt_cmd--;
            // }

            //System.out.println("Out: "+ Util.hex((byte)value));
            sd_card.write(val);
        }
    }


}