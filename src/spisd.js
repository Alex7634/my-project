function SpiSD() {

    let ctrl_rd = 0b11111101;
    let ctrl_wr = 0xff;

    let disk

    //let zip1 = new JSZip();

    //load_hdd("hdd.ima")
    //load_hdd("hdd16.img")
    load_hdd('hdd16.zip')


    // decompressZip(disk)

    //decompressZip(disk)

    //let content1 = new Uint8Array(5)


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
            //disk = new Uint8Array(filestream.length)
            let content = new Uint8Array(filestream.length)
            for (let n = 0; n < filestream.length; n++)
                //disk[n] = filestream.charCodeAt(n) & 0xff; // throw away high-order byte
                content[n] = filestream.charCodeAt(n) & 0xff; // throw away high-order byte
            let zip = util.check_content_is_zip(content); // zip file?
            if (zip) {
                let files = util.get_zip_files(zip);
                for (let f in files)
                    disk = files[f].asUint8Array();
            }
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



    async function synchronousFetch(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }

    async function example() {
        try {
            const result = await synchronousFetch('settings.json');
            console.log(result);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    //async function decompressZip(uint8Array) {
    // function decompressZip(uint8Array) {
    //     try {
    //         // const zip = await zip1.load(uint8Array);
    //         // const fileNames = Object.keys(zip.files);
    //         //
    //         // const filesData = await Promise.all(
    //         //     fileNames.map(async (fileName) => {
    //         //         //const fileData = await zip.file(fileName).async("uint8array");
    //         //         const fileData = await zip.file(fileName).asUint8Array();
    //         //         return { fileName, data: fileData };
    //         //     })
    //         // );
    //         //
    //         // return filesData;
    //
    //         const zip = zip1.load(uint8Array);
    //         const fileNames = Object.keys(zip.files);
    //         const fileName = fileNames[0];
    //
    //
    //         for (let name in zip.files) {
    //
    //             let fileData = zip.file(name).async('blob');
    //
    //         }
    //
    //
    //         let fileData = zip.file(fileName).asUint8Array();
    //
    //         // fileNames.map((fileName) => {
    //         //     const fileData = zip.file(fileName).asUint8Array();
    //         //     return { fileName, data: fileData };
    //         // })
    //
    //         return fileData;
    //
    //     } catch (error) {
    //         console.error("Error decompressing zip:", error);
    //         throw error;
    //     }
    // }



    // async function decompressZip(uint8Array) {
    //     try {
    //         const zip = await JSZip.loadAsync(uint8Array);
    //         const fileNames = Object.keys(zip.files);
    //
    //         const filesData = await Promise.all(
    //             fileNames.map(async (fileName) => {
    //                 const fileData = await zip.file(fileName).async("uint8array");
    //                 return { fileName, data: fileData };
    //             })
    //         );
    //
    //         return filesData;
    //     } catch (error) {
    //         console.error("Error decompressing zip:", error);
    //         throw error;
    //     }
    // }



    function checkFileHasValidImages(file, hardDisk, anyContent, stopRecursion) {
        // Zip File?
        if (!stopRecursion) {
            var zip = wmsx.Util.checkContentIsZIP(file.content);
            if (zip) {
                try {
                    var files = wmsx.Util.getZIPFilesSorted(zip);
                    for (var f in files) {
                        files[f].content = files[f].asUint8Array();
                        var res = checkFileHasValidImages(files[f], hardDisk, anyContent, true);
                        if (res) return res;
                    }
                } catch (ez) {
                    wmsx.Util.error(ez);      // Error decompressing files. Abort
                }
                return null;
            }
        }
    }


    let disk_hdd;

    function decompressZip(content) {
        // Zip File?
        let zip = util.checkContentIsZIP(content);
        if (zip) {
            try {
                //const fileNames = Object.keys(zip.files);



                // for (let name in zip.files) {
                //
                //     let fileData = zip.file(name).async('blob');
                //
                // }


                // let res
                // const fileNames = Object.keys(zip.files(/.+/));
                // for (let f in fileNames) {
                //     res = fileNames[f].asUint8Array();
                //
                // }
                // if (res) return res;


                let files = util.get_zip_files(zip);
                for (let f in files) {
                    let res = files[f].asUint8Array();
                    if (res) return res;
                }
            } catch (ez) {
                //wmsx.Util.error(ez);      // Error decompressing files. Abort
            }
            return null;
        }
    }

}