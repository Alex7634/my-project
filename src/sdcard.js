"use strict";
let SdCommand = new function() {
    ////INVALID = -1,
    //static final int INVALID = -1;
    this.INVALID = -1
    ////CMD0 = 0,
    //static final int CMD0 = 0;
    this.CMD0 = 0
    ////GO_IDLE_STATE = CMD0,
    //static final int GO_IDLE_STATE = CMD0;
    this.GO_IDLE_STATE = this.CMD0;
    ////CMD1 = 1,
    //static final int CMD1 = 1;
    this.CMD1 = 1
    ////SEND_OP_COND = CMD1,
    //static final int SEND_OP_COND = CMD1;
    this.SEND_OP_COND = this.CMD1
    ////CMD8 = 8,
    //static final int CMD8 = 8;
    this.CMD8 = 8
    ////SEND_IF_COND = CMD8,
    //static final int SEND_IF_COND = CMD8;
    this.SEND_IF_COND = this.CMD8
    ////CMD9 = 9,
    //static final int CMD9 = 9;
    this.CMD9 = 9
    ////SEND_CSD = CMD9,
    //static final int SEND_CSD = CMD9;
    this.SEND_CSD = this.CMD9
    ////CMD10 = 10,
    //static final int CMD10 = 10;
    this.CMD10 = 10
    ////SEND_CID = CMD10,
    //static final int SEND_CID = CMD10;
    this.SEND_CID = this.CMD10
    ////CMD12 = 12,
    //static final int CMD12 = 12;
    this.CMD12 = 12
    ////STOP_TRANSMISSION = CMD12,
    //static final int STOP_TRANSMISSION = CMD12;
    this.STOP_TRANSMISSION = this.CMD12
    ////CMD16 = 16,
    //static final int CMD16 = 16;
    this.CMD16 = 16
    ////SET_BLOCKLEN = CMD16,
    //static final int SET_BLOCKLEN = CMD16;
    this.SET_BLOCKLEN = this.CMD16
    ////CMD17 = 17,
    //static final int CMD17 = 17;
    this.CMD17 = 17
    ////READ_SINGLE_BLOCK = CMD17,
    //static final int READ_SINGLE_BLOCK = CMD17;
    this.READ_SINGLE_BLOCK = this.CMD17
    ////CMD18 = 18,
    //static final int CMD18 = 18;
    this.CMD18 = 18
    ////READ_MULTIPLE_BLOCK = CMD18,
    //static final int READ_MULTIPLE_BLOCK = CMD18;
    this.READ_MULTIPLE_BLOCK = this.CMD18
    ////CMD24 = 24,
    ////WRITE_BLOCK = CMD24,
    ////CMD25 = 25,
    ////WRITE_MULTIPLE_BLOCK = CMD25,
    ////CMD55 = 55,
    //static final int CMD55 = 55;
    this.CMD55 = 55
    ////APP_CMD = CMD55,
    //static final int APP_CMD = CMD55;
    this.APP_CMD = this.CMD55
    ////CMD58 = 58,
    //static final int CMD58 = 58;
    this.CMD58 = 58
    ////READ_OCR = CMD58,
    //static final int READ_OCR = CMD58;
    this.READ_OCR = this.CMD58
    ////CMD59 = 59,
    //static final int CMD59 = 59;
    this.CMD59 = 59
    ////CRC_ON_OFF = CMD59,
    //static final int CRC_ON_OFF = CMD59;
    this.CRC_ON_OFF = this.CMD59
    ////ACMD41 = 41,
    //static final int ACMD41 = 41;
    this.ACMD41 = 41
    ////SD_SEND_OP_COND = ACMD41,
    //static final int SD_SEND_OP_COND = ACMD41;
    this.SD_SEND_OP_COND = this.ACMD41
}

////public class SdCard {
//public class SdCard {
function SdCard() {

    const SdState = {
        IDLE:               0,
        RD_ARG:             1,
        RD_CRC:             2,
        R1:                 3,
        R1b:                4,
        R2:                 5,
        R3:                 6,
        R7:                 7,
        STARTBLOCK:         8,
        DELAY_S:            9,
        WR_DATA:            10,
        WR_CRC16_1:         11,
        WR_CRC16_2:         12,
        RD_DATA_SIG:        13,
        RD_DATA:            14,
        RD_DATA_MUL:        15,
        RD_CRC16_1:         16,
        RD_CRC16_2:         17,
        WR_DATA_RESP:       18,
        RD_DATA_SIG_MUL:    19
    }

    //
    ////private readonly byte[] cid;
    //private byte[] cid;
    let cid
    ////private readonly byte[] csd;
    //private byte[] csd;
    let csd
    ////private readonly byte[] buff;
    //private byte[] buff;
    let buff
    //
    ////private SdState currState;
    //private SdState currState;
    let currState
    ////private SdCommand cmd;
    //private int cmd;
    let cmd
    //
    ////private UInt32 argCnt;
    //private int argCnt;
    let argCnt
    ////private UInt32 ocrCnt;
    //private int ocrCnt;
    let ocrCnt
    ////private UInt32 r7_Cnt;
    //private int r7_Cnt;
    let r7_Cnt
    //
    ////private UInt32 cidCnt;
    //private int cidCnt;
    let cidCnt
    ////private UInt32 csdCnt;
    //private int csdCnt;
    let csdCnt
    //
    ////private bool appCmd;
    //private boolean appCmd;
    let appCmd = false
    //
    ////private int dataBlockLen;
    //private int dataBlockLen;
    let dataBlockLen
    ////private UInt32 dataCnt;
    //private int dataCnt;
    let dataCnt
    ////private UInt32 wrPos;
    //
    ////private UInt32 arg;
    //private int[] arg = new int[1];
    let arg = [0];
    //
    ////private FileStream fstream;
    //protected byte[] disk;
    let disk
    //
    ////public SdCard() {
    //public SdCard() {
        ////cid = new byte[16] { 0x00, (byte)'U', (byte)'S', (byte)'U', (byte)'S', (byte)'3', (byte)'7', (byte)'6', 0x03, 0x12, 0x34, 0x56, 0x78, 0x00, 0xC1, 0x0F };
        //cid = new byte[] { 0x00, (byte)'U', (byte)'S', (byte)'U', (byte)'S', (byte)'3', (byte)'7', (byte)'6', 0x03, 0x12, 0x34, 0x56, 0x78, 0x00, (byte) 0xC1, 0x0F };
        ////csd = new byte[16] { 0x00, 0x0E, 0x00, 0x32, 0x5B, 0x59, 0x03, 0xFF, 0xED, 0xB7, 0xBF, 0xBF, 0x06, 0x40, 0x00, 0xF5 };
        //csd = new byte[] { 0x00, 0x0E, 0x00, 0x32, 0x5B, 0x59, 0x03, (byte) 0xFF, (byte) 0xED, (byte) 0xB7, (byte) 0xBF, (byte) 0xBF, 0x06, 0x40, 0x00, (byte) 0xF5 };
        //
        ////buff = new byte[4096];
        //buff = new byte[4096];
        //
        //reset();
    //}
    cid = new Uint8Array(16)
    csd = new Uint8Array(16)
    buff = new Uint8Array(4096)
    reset()
    //
    //public void addDisk(byte[] disk) {
    this.set_disk = function(value) {
        //this.disk = new byte[disk.length];
        //System.arraycopy(disk,0, this.disk,0, disk.length);
        disk = value;
    }
    //
    ////public void Open(string fname) {
    ////    if (fstream != null)
    ////        Close();
    ////
    ////    if (File.Exists(fname)) {
    ////        fstream = File.Open(fname, FileMode.Open, FileAccess.ReadWrite);
    ////        Reset();
    ////    }
    ////}
    //
    ////public void Close() {
    ////    if (fstream != null) {
    ////        fstream.Flush();
    ////        fstream.Close();
    ////        fstream.Dispose();
    ////        fstream = null;
    ////    }
    ////}
    //
    ////public void Reset() {
    //public void reset() {
    //this.reset = function() {
    function reset() {
        ////currState = SdState.IDLE;
        //currState = SdState.IDLE;
        currState = SdState.IDLE;
        ////argCnt = 0;
        //argCnt = 0;
        argCnt = 0;
        ////cmd = SdCommand.INVALID;
        //cmd = SdCommand.INVALID;
        cmd = SdCommand.INVALID;
        ////dataBlockLen = 512;
        //dataBlockLen = 512;
        dataBlockLen = 512;
        ////dataCnt = 0;
        //dataCnt = 0;
        dataCnt = 0;
        //
        ////csdCnt = 0;
        //csdCnt = 0;
        csdCnt = 0;
        ////cidCnt = 0;
        //cidCnt = 0;
        cidCnt = 0;
        ////ocrCnt = 0;
        //ocrCnt = 0;
        ocrCnt = 0;
        ////r7_Cnt = 0;
        //r7_Cnt = 0;
        r7_Cnt = 0;
        //
        ////appCmd = false;
        //appCmd = false;
        appCmd = false;
        ////wrPos = UInt32.MaxValue;
    }
    //
    ////public void Wr(byte val) {
    //public void write(int val) {
    this.write = function(val) {
        ////SdState NextState = SdState.IDLE;
        //SdState NextState = SdState.IDLE;
        let NextState = SdState.IDLE
        //
        ////if (fstream == null)
              ////return;
        //
        ////switch (currState) {
        //switch (currState) {
        switch (currState) {
            ////case SdState.IDLE:
            //case IDLE:
            case SdState.IDLE:
                ////if ((val & 0xC0) != 0x40)
                //if ((val & 0xC0) != 0x40)
                if ((val & 0xC0) !== 0x40)
                    //break;
                    break;
                //
                ////cmd = (SdCommand)(val & 0x3F);
                //cmd = val & 0x3F;
                cmd = val & 0x3F;
                ////if (!appCmd) {
                //if (!appCmd) {
                if (!appCmd) {
                    ////switch (cmd) {
                    //switch (cmd) {
                    switch (cmd) {
                        ////case SdCommand.SEND_CSD:
                        //case SdCommand.SEND_CSD:
                        case SdCommand.SEND_CSD:
                            ////csdCnt = 0;
                            //csdCnt = 0;
                            csdCnt = 0;
                            //break;
                            break;
                        ////case SdCommand.SEND_CID:
                        //case SdCommand.SEND_CID:
                        case SdCommand.SEND_CID:
                            ////cidCnt = 0;
                            //cidCnt = 0;
                            cidCnt = 0;
                            //break;
                            break;
                        ////case SdCommand.READ_OCR:
                        //case SdCommand.READ_OCR:
                        case SdCommand.READ_OCR:
                            ////ocrCnt = 0;
                            //ocrCnt = 0;
                            ocrCnt = 0;
                            //break;
                            break;
                        ////case SdCommand.SEND_IF_COND:
                        //case SdCommand.SEND_IF_COND:
                        case SdCommand.SEND_IF_COND:
                            ////r7_Cnt = 0;
                            //r7_Cnt = 0;
                            r7_Cnt = 0;
                            //break;
                            break;
                    }
                }
                ////NextState = SdState.RD_ARG;
                //NextState = SdState.RD_ARG;
                NextState = SdState.RD_ARG;
                ////argCnt = 0;
                //argCnt = 0;
                argCnt = 0;
                //break;
                break;
                //
            ////case SdState.RD_ARG:
            //case RD_ARG:
            case SdState.RD_ARG:
                ////NextState = SdState.RD_ARG;
                //NextState = SdState.RD_ARG;
                NextState = SdState.RD_ARG
                ////SetByte(ref arg, 3 - argCnt++, val);
                //SetByte(arg, 3 - argCnt++, (byte) val);
                SetByte(arg, 3 - argCnt++, val)
                //
                ////if (argCnt == 4) {
                //if (argCnt == 4) {
                if (argCnt === 4) {
                    ////if (!appCmd) {
                    //if (!appCmd) {
                    if (!appCmd) {
                        ////switch (cmd) {
                        //switch (cmd) {
                        switch (cmd) {
                            ////case SdCommand.SET_BLOCKLEN:
                            //case SdCommand.SET_BLOCKLEN:
                            case SdCommand.SET_BLOCKLEN:
                                ////if (arg <= 4096) dataBlockLen = (int)arg;
                                //if (arg[0] <= 4096) dataBlockLen = arg[0];
                                if (arg[0] <= 4096) dataBlockLen = arg[0];
                                //break;
                                break;
                                //
                            ////case SdCommand.READ_SINGLE_BLOCK:
                            //case SdCommand.READ_SINGLE_BLOCK:
                            case SdCommand.READ_SINGLE_BLOCK:
                                ////fstream.Seek(arg, SeekOrigin.Begin);
                                ////fstream.Read(buff, 0, dataBlockLen);
                                //System.arraycopy(disk, arg[0], buff,0, dataBlockLen);
                                for (let i = 0; i < dataBlockLen; i++)
                                    buff[i] = disk[arg[0]+i]
                                //break;
                                break;
                                //
                            ////case SdCommand.READ_MULTIPLE_BLOCK:
                            //case SdCommand.READ_MULTIPLE_BLOCK:
                            case SdCommand.READ_MULTIPLE_BLOCK:
                                ////fstream.Seek(arg, SeekOrigin.Begin);
                                ////fstream.Read(buff, 0, dataBlockLen);
                                //System.arraycopy(disk, arg[0], buff,0, dataBlockLen);
                                for (let i = 0; i < dataBlockLen; i++)
                                    buff[i] = disk[arg[0]+i]
                                //break;
                                break;
                                //
                            ////case SdCommand.WRITE_BLOCK:
                                ////break;
                                //
                            ////case SdCommand.WRITE_MULTIPLE_BLOCK:
                                ////wrPos = arg;
                                ////break;
                        }
                    }
                    //
                    ////NextState = SdState.RD_CRC;
                    //NextState = SdState.RD_CRC;
                    NextState = SdState.RD_CRC;
                    ////argCnt = 0;
                    //argCnt = 0;
                    argCnt = 0;
                }
                //break;
                break;
                //
            ////case SdState.RD_CRC:
            //case RD_CRC:
            case SdState.RD_CRC:
                ////NextState = GetRespondType();
                //NextState = GetRespondType();
                NextState = GetRespondType();
                //break;
                break;
                //
            ////case SdState.RD_DATA_SIG:
            //case RD_DATA_SIG:
            case SdState.RD_DATA_SIG:
                ////if (val == 0xFE) { // Проверка сигнатуры данных
                //if (val == 0xFE) { // Проверка сигнатуры данных
                if (val === 0xfe) { // Проверка сигнатуры данных
                    ////dataCnt = 0;
                    //dataCnt = 0;
                    dataCnt = 0;
                    ////NextState = SdState.RD_DATA;
                    //NextState = SdState.RD_DATA;
                    NextState = SdState.RD_DATA;
                }
                ////else
                //else
                else
                    ////NextState = SdState.RD_DATA_SIG;
                    //NextState = SdState.RD_DATA_SIG;
                    NextState = SdState.RD_DATA_SIG
                //break;
                break;
                //
            ////case SdState.RD_DATA_SIG_MUL:
            //case RD_DATA_SIG_MUL:
            case SdState.RD_DATA_SIG_MUL:
                ////switch (val) {
                    ////case 0xFC: // Проверка сигнатуры данных
                    ////
                    ////    dataCnt = 0;
                    ////    NextState = SdState.RD_DATA_MUL;
                    ////    break;
                    ////case 0xFD: // Окончание передачи
                    ////
                    ////    dataCnt = 0;
                    ////    NextState = SdState.IDLE;
                    ////    break;
                    ////default:
                    ////    NextState = SdState.RD_DATA_SIG_MUL;
                    ////    break;
                ////}
                //break;
                break;
                //
            ////case SdState.RD_DATA: // Прием данных в буфер
            //case RD_DATA:
            case SdState.RD_DATA:
                ////{
                ////    buff[dataCnt++] = val;
                ////    NextState = SdState.RD_DATA;
                ////    if (dataCnt == dataBlockLen) // Запись данных в SD карту
                ////    {
                ////        dataCnt = 0;
                ////        fstream.Seek(arg, SeekOrigin.Begin);
                ////        fstream.Write(buff, 0, dataBlockLen);
                ////
                ////
                ////        NextState = SdState.WR_DATA_RESP;
                ////    }
                ////}
                //break;
                break;
                //
            ////case SdState.RD_DATA_MUL: // Прием данных в буфер
            //case RD_DATA_MUL:
            case SdState.RD_DATA_MUL:
                ////{
                ////    buff[dataCnt++] = val;
                ////    NextState = SdState.RD_DATA_MUL;
                ////    if (dataCnt == dataBlockLen) // Запись данных в SD карту
                ////    {
                ////        dataCnt = 0;
                ////
                ////        fstream.Seek(wrPos, SeekOrigin.Begin);
                ////        fstream.Write(buff, 0, dataBlockLen);
                ////
                ////
                ////        wrPos += (uint)dataBlockLen;
                ////        NextState = SdState.RD_DATA_SIG_MUL;
                ////    }
                ////}
                //break;
                break;
                //
            ////case SdState.RD_CRC16_1: // Чтение старшего байта CRC16
            //case RD_CRC16_1:
            case SdState.RD_CRC16_1:
                ////NextState = SdState.RD_CRC16_2;
                //break;
                break;
                //
            ////case SdState.RD_CRC16_2: // Чтение младшего байта CRC16
            //case RD_CRC16_2:
            case SdState.RD_CRC16_2:
                ////NextState = SdState.WR_DATA_RESP;
                //break;
                break;
                //
            //default:
            default:
                //return;
                return;
        }
        ////currState = NextState;
        //currState = NextState;
        currState = NextState;
    }
    //
    ////private SdState GetRespondType() {
    //private SdState GetRespondType() {
    function GetRespondType() {
        ////if (!appCmd) {
        //if (!appCmd) {
        if (!appCmd) {
            ////switch (cmd) {
            //switch (cmd) {
            switch (cmd) {
                ////case SdCommand.APP_CMD:
                //case SdCommand.APP_CMD:
                case SdCommand.APP_CMD:
                    ////appCmd = true;
                    //appCmd = true;
                    appCmd = true;
                    ////return SdState.R1;
                    //return SdState.R1;
                    return SdState.R1;
                ////case SdCommand.GO_IDLE_STATE:
                //case SdCommand.GO_IDLE_STATE:
                case SdCommand.GO_IDLE_STATE:
                ////case SdCommand.SEND_OP_COND:
                //case SdCommand.SEND_OP_COND:
                case SdCommand.SEND_OP_COND:
                ////case SdCommand.SET_BLOCKLEN:
                //case SdCommand.SET_BLOCKLEN:
                case SdCommand.SET_BLOCKLEN:
                ////case SdCommand.READ_SINGLE_BLOCK:
                //case SdCommand.READ_SINGLE_BLOCK:
                case SdCommand.READ_SINGLE_BLOCK:
                ////case SdCommand.READ_MULTIPLE_BLOCK:
                //case SdCommand.READ_MULTIPLE_BLOCK:
                case SdCommand.READ_MULTIPLE_BLOCK:
                ////case SdCommand.CRC_ON_OFF:
                //case SdCommand.CRC_ON_OFF:
                case SdCommand.CRC_ON_OFF:
                ////case SdCommand.STOP_TRANSMISSION:
                //case SdCommand.STOP_TRANSMISSION:
                case SdCommand.STOP_TRANSMISSION:
                ////case SdCommand.SEND_CSD:
                //case SdCommand.SEND_CSD:
                case SdCommand.SEND_CSD:
                ////case SdCommand.SEND_CID:
                //case SdCommand.SEND_CID:
                case SdCommand.SEND_CID:
                    ////return SdState.R1;
                    //return SdState.R1;
                    return SdState.R1;
                ////case SdCommand.READ_OCR:
                //case SdCommand.READ_OCR:
                case SdCommand.READ_OCR:
                    ////return SdState.R3;
                    //return SdState.R3;
                    return SdState.R3;
                ////case SdCommand.SEND_IF_COND:
                //case SdCommand.SEND_IF_COND:
                case SdCommand.SEND_IF_COND:
                    ////return SdState.R7;
                    //return SdState.R7;
                    return SdState.R7;
                ////case SdCommand.WRITE_BLOCK:
                    ////return SdState.RD_DATA_SIG;
                ////case SdCommand.WRITE_MULTIPLE_BLOCK:
                    ////return SdState.RD_DATA_SIG_MUL;
            }
        }
        ////} else {
        //} else {
        else {
            ////appCmd = false;
            //appCmd = false;
            appCmd = false;
            ////switch (cmd) {
            //switch (cmd) {
            switch (cmd) {
                ////case SdCommand.SD_SEND_OP_COND:
                //case SdCommand.SD_SEND_OP_COND:
                case SdCommand.SD_SEND_OP_COND:
                    ////return SdState.R1;
                    //return SdState.R1;
                    return SdState.R1;
            }
        }
        //
        ////cmd = SdCommand.INVALID;
        //cmd = SdCommand.INVALID;
        cmd = SdCommand.INVALID;
        ////return SdState.R1;
        //return SdState.R1;
        return SdState.R1
    }
    //
    //////ArgArr[3 - ArgCnt++] = Val;
    ////private void SetByte(ref uint arg, uint bnum, byte val) {
    //private void SetByte(int[] arg, int bnum, byte val) {
    function SetByte(arg, bnum, val) {
        ////UInt32 mask = (UInt32)((0x000000FF << (byte)(bnum * 8)) ^ 0xFFFFFFFF);
        ////arg &= mask;
        ////arg |= (UInt32)(val << (byte)(bnum * 8));
        //int mask = ~(0x000000FF << (bnum * 8));
        let mask = ~(0x000000ff << (bnum * 8));
        //arg[0] &= mask;
        arg[0] &= mask;
        //mask = 0x000000FF << (bnum * 8);
        mask = 0x000000ff << (bnum * 8);
        ////int val_t = (val << (bnum * 8)) & mask;
        //arg[0] |= (val << (bnum * 8)) & mask;
        arg[0] |= (val << (bnum * 8)) & mask;
    }
    //
    ////public byte Rd() {
    //public int read() {
    this.read = function() {
        ////if (fstream == null) return 0xFF;
        //
        ////switch (cmd) {
        //switch (cmd) {
        switch (cmd) {
            ////case SdCommand.GO_IDLE_STATE:
            //case SdCommand.GO_IDLE_STATE:
            case SdCommand.GO_IDLE_STATE:
                ////if (currState == SdState.R1) {
                //if (currState == SdState.R1) {
                if (currState === SdState.R1) {
                    //////Cmd = CMD.INVALID;
                    ////currState = SdState.IDLE;
                    //currState = SdState.IDLE;
                    currState = SdState.IDLE;
                    ////return 1;
                    //return 1;
                    return 1;
                }
                //break;
                break;
                //
            ////case SdCommand.SEND_OP_COND:
            //case SdCommand.SEND_OP_COND:
            case SdCommand.SEND_OP_COND:
                ////if (currState == SdState.R1) {
                //if (currState == SdState.R1) {
                if (currState === SdState.R1) {
                    //////Cmd = CMD.INVALID;
                    ////currState = SdState.IDLE;
                    //currState = SdState.IDLE;
                    currState = SdState.IDLE;
                    ////return 0;
                    //return 0;
                    return 0;
                }
                //break;
                break;
                //
            ////case SdCommand.SET_BLOCKLEN:
            //case SdCommand.SET_BLOCKLEN:
            case SdCommand.SET_BLOCKLEN:
                ////if (currState == SdState.R1) {
                //if (currState == SdState.R1) {
                if (currState === SdState.R1) {
                    //////Cmd = CMD.INVALID;
                    ////currState = SdState.IDLE;
                    //currState = SdState.IDLE;
                    currState = SdState.IDLE;
                    ////return 0;
                    //return 0;
                    return 0;
                }
                //break;
                break;
                //
            ////case SdCommand.SEND_IF_COND:
            //case SdCommand.SEND_IF_COND:
            case SdCommand.SEND_IF_COND:
                ////if (currState == SdState.R7) {
                //if (currState == SdState.R7) {
                if (currState === SdState.R7) {
                    ////switch (r7_Cnt++) {
                    //switch (r7_Cnt++) {
                    switch (r7_Cnt++) {
                        ////case 0: return 0x01; // R1
                        //case 0: return 0x01; // R1
                        case 0: return 0x01; // R1
                        ////case 1: return 0x00;
                        //case 1: return 0x00;
                        case 1: return 0x00;
                        ////case 2: return 0x00;
                        //case 2: return 0x00;
                        case 2: return 0x00;
                        ////case 3: return 0x01;
                        //case 3: return 0x01;
                        case 3: return 0x01;
                        ////default:
                        //default:
                        default:
                            ////currState = SdState.IDLE;
                            //currState = SdState.IDLE;
                            currState = SdState.IDLE;
                            ////r7_Cnt = 0;
                            //r7_Cnt = 0;
                            r7_Cnt = 0;
                            ////return (byte)(arg & 0xFF); // echo-back
                            //return arg[0] & 0xFF;
                            return arg[0] & 0xff;
                    }
                }
                //break;
                break;
                //
            ////case SdCommand.READ_OCR:
            //case SdCommand.READ_OCR:
            case SdCommand.READ_OCR:
                ////if (currState == SdState.R3) {
                //if (currState == SdState.R3) {
                if (currState === SdState.R3) {
                    ////switch (ocrCnt++) {
                    //switch (ocrCnt++) {
                    switch (ocrCnt++) {
                        ////case 0: return 0x00; // R1
                        //case 0: return 0x00;
                        case 0: return 0x00;
                        ////case 1: return 0x80;
                        //case 1: return 0x80;
                        case 1: return 0x80;
                        ////case 2: return 0xFF;
                        //case 2: return 0xFF;
                        case 2: return 0xFF;
                        ////case 3: return 0x80;
                        //case 3: return 0x80;
                        case 3: return 0x80;
                        ////default:
                        //default:
                        default:
                            ////currState = SdState.IDLE;
                            //currState = SdState.IDLE;
                            currState = SdState.IDLE;
                            ////ocrCnt = 0;
                            //ocrCnt = 0;
                            ocrCnt = 0;
                            ////return 0x00;
                            //return 0x00;
                            return 0x00;
                    }
                }
                //break;
                break;
                //
            ////case SdCommand.APP_CMD:
            //case SdCommand.APP_CMD:
            case SdCommand.APP_CMD:
                ////if (currState == SdState.R1) {
                //if (currState == SdState.R1) {
                if (currState === SdState.R1) {
                    ////currState = SdState.IDLE;
                    //currState = SdState.IDLE;
                    currState = SdState.IDLE;
                    ////return 0;
                    //return 0;
                    return 0;
                }
                //break;
                break;
                //
            ////case SdCommand.SD_SEND_OP_COND:
            //case SdCommand.SD_SEND_OP_COND:
            case SdCommand.SD_SEND_OP_COND:
                ////if (currState == SdState.R1) {
                //if (currState == SdState.R1) {
                if (currState === SdState.R1) {
                    ////currState = SdState.IDLE;
                    //currState = SdState.IDLE;
                    currState = SdState.IDLE;
                    ////return 0;
                    //return 0;
                    return 0;
                }
                //break;
                break;
                //
            ////case SdCommand.CRC_ON_OFF:
            //case SdCommand.CRC_ON_OFF:
            case SdCommand.CRC_ON_OFF:
                ////if (currState == SdState.R1) {
                //if (currState == SdState.R1) {
                if (currState === SdState.R1) {
                    ////currState = SdState.IDLE;
                    //currState = SdState.IDLE;
                    currState = SdState.IDLE;
                    ////return 0;
                    //return 0;
                    return 0;
                }
                //break;
                break;
                //
            ////case SdCommand.STOP_TRANSMISSION:
            //case SdCommand.STOP_TRANSMISSION:
            case SdCommand.STOP_TRANSMISSION:
                ////switch (currState) {
                //switch (currState) {
                switch (currState) {
                    ////case SdState.R1:
                    //case R1:
                    case SdState.R1:
                        ////dataCnt = 0;
                        //dataCnt = 0;
                        dataCnt = 0;
                        ////currState = SdState.R1b;
                        //currState = SdState.R1b;
                        currState = SdState.R1b;
                        ////return 0;
                        //return 0;
                        return 0;
                    ////case SdState.R1b:
                    //case R1b:
                    case SdState.R1b:
                        ////currState = SdState.IDLE;
                        //currState = SdState.IDLE;
                        currState = SdState.IDLE;
                        ////return 0xFF;
                        //return 0xFF;
                        return 0xff;
                }
                //break;
                break;
                //
            ////case SdCommand.READ_SINGLE_BLOCK:
            //case SdCommand.READ_SINGLE_BLOCK:
            case SdCommand.READ_SINGLE_BLOCK:
                ////switch (currState) {
                //switch (currState) {
                switch (currState) {
                    ////case SdState.R1:
                    //case R1:
                    case SdState.R1:
                        ////currState = SdState.DELAY_S;
                        //currState = SdState.DELAY_S;
                        currState = SdState.DELAY_S;
                        ////return 0;
                        //return 0;
                        return 0;
                    ////case SdState.DELAY_S:
                    //case DELAY_S:
                    case SdState.DELAY_S:
                        ////currState = SdState.STARTBLOCK;
                        //currState = SdState.STARTBLOCK;
                        currState = SdState.STARTBLOCK;
                        ////return 0xFF;
                        //return 0xFF;
                        return 0xff;
                    ////case SdState.STARTBLOCK:
                    //case STARTBLOCK:
                    case SdState.STARTBLOCK:
                        ////currState = SdState.WR_DATA;
                        //currState = SdState.WR_DATA;
                        currState = SdState.WR_DATA;
                        ////dataCnt = 0;
                        //dataCnt = 0;
                        dataCnt = 0;
                        ////return 0xFE;
                        //return 0xFE;
                        return 0xfe;
                    ////case SdState.WR_DATA:
                    //case WR_DATA:
                    case SdState.WR_DATA:
                        ////byte Val = buff[dataCnt++];
                        //byte Val = buff[dataCnt++];
                        let val = buff[dataCnt++];
                        ////if (dataCnt == dataBlockLen) {
                        //if (dataCnt == dataBlockLen) {
                        if (dataCnt === dataBlockLen) {
                            ////dataCnt = 0;
                            //dataCnt = 0;
                            dataCnt = 0;
                            ////currState = SdState.WR_CRC16_1;
                            //currState = SdState.WR_CRC16_1;
                            currState = SdState.WR_CRC16_1;
                        }
                        ////return Val;
                        //return Val;
                        return val;
                    ////case SdState.WR_CRC16_1:
                    //case WR_CRC16_1:
                    case SdState.WR_CRC16_1:
                        ////currState = SdState.WR_CRC16_2;
                        //currState = SdState.WR_CRC16_2;
                        currState = SdState.WR_CRC16_2;
                        ////return 0xFF; // crc
                        //return 0xFF;
                        return 0xff; // crc
                    ////case SdState.WR_CRC16_2:
                    //case WR_CRC16_2:
                    case SdState.WR_CRC16_2:
                        ////currState = SdState.IDLE;
                        //currState = SdState.IDLE;
                        currState = SdState.IDLE;
                        ////cmd = SdCommand.INVALID;
                        //cmd = SdCommand.INVALID;
                        cmd = SdCommand.INVALID;
                        ////return 0xFF; // crc
                        //return 0xFF;
                        return 0xff; // crc
                }
                //////Cmd = CMD.INVALID;
                //break;
                break;
                //
            ////case SdCommand.READ_MULTIPLE_BLOCK:
            //case SdCommand.READ_MULTIPLE_BLOCK:
            case SdCommand.READ_MULTIPLE_BLOCK:
                ////switch (currState) {
                //switch (currState) {
                switch (currState) {
                    ////case SdState.R1:
                    //case R1:
                    case SdState.R1:
                        ////currState = SdState.DELAY_S;
                        //currState = SdState.DELAY_S;
                        currState = SdState.DELAY_S;
                        ////return 0;
                        //return 0;
                        return 0;
                    ////case SdState.DELAY_S:
                    //case DELAY_S:
                    case SdState.DELAY_S:
                        ////currState = SdState.STARTBLOCK;
                        //currState = SdState.STARTBLOCK;
                        currState = SdState.STARTBLOCK;
                        ////return 0xFF;
                        //return 0xFF;
                        return 0xff;
                    ////case SdState.STARTBLOCK:
                    //case STARTBLOCK:
                    case SdState.STARTBLOCK:
                        ////currState = SdState.IDLE;
                        //currState = SdState.IDLE;
                        currState = SdState.IDLE;
                        ////dataCnt = 0;
                        //dataCnt = 0;
                        dataCnt = 0;
                        ////return 0xFE;
                        //return 0xFE;
                        return 0xfe;
                    ////case SdState.IDLE:
                    //case IDLE:
                    case SdState.IDLE:
                        ////if (dataCnt < dataBlockLen) {
                        //if (dataCnt < dataBlockLen) {
                        if (dataCnt < dataBlockLen) {
                            ////byte Val = buff[dataCnt++];
                            //byte Val = buff[dataCnt++];
                            let val = buff[dataCnt++];
                            ////if (dataCnt == dataBlockLen)
                            //if (dataCnt == dataBlockLen)
                            if (dataCnt === dataBlockLen)
                                ////fstream.Read(buff, 0, dataBlockLen);
                                //arg[0] += dataBlockLen;
                                arg[0] += dataBlockLen;
                            //System.arraycopy(disk, arg[0], buff,0, dataBlockLen);
                            for (let i = 0; i < dataBlockLen; i++)
                                buff[i] = disk[arg[0]+i]
                            ////return Val;
                            //return Val;
                            return val;
                        }
                        ////else if (dataCnt > (dataBlockLen + 8)) {
                        //else if (dataCnt > (dataBlockLen + 8)) {
                        else if (dataCnt > (dataBlockLen + 8)) {
                            ////dataCnt = 0;
                            //dataCnt = 0;
                            dataCnt = 0;
                            ////return 0xFE; // next startblock
                            //return 0xFE; // next startblock
                            return 0xfe; // next startblock
                        }
                        ////else {
                        //else {
                        else {
                            ////dataCnt++;
                            //dataCnt++;
                            dataCnt++;
                            ////return 0xFF; // crc & pause
                            //return 0xFF; // crc & pause
                            return 0xff; // crc & pause
                        }
                }
                //break;
                break;
                //
            ////case SdCommand.SEND_CSD:
            //case SdCommand.SEND_CSD:
            case SdCommand.SEND_CSD:
                ////switch (currState) {
                //switch (currState) {
                switch (currState) {
                    ////case SdState.R1:
                    //case R1:
                    case SdState.R1:
                        ////currState = SdState.DELAY_S;
                        //currState = SdState.DELAY_S;
                        currState = SdState.DELAY_S;
                        ////return 0;
                        //return 0;
                        return 0;
                    ////case SdState.DELAY_S:
                    //case DELAY_S:
                    case SdState.DELAY_S:
                        ////currState = SdState.STARTBLOCK;
                        //currState = SdState.STARTBLOCK;
                        currState = SdState.STARTBLOCK;
                        ////return 0xFF;
                        //return 0xFF;
                        return 0xff;
                    ////case SdState.STARTBLOCK:
                    //case STARTBLOCK:
                    case SdState.STARTBLOCK:
                        ////currState = SdState.WR_DATA;
                        //currState = SdState.WR_DATA;
                        currState = SdState.WR_DATA;
                        ////return 0xFE;
                        //return 0xFE;
                        return 0xfe;
                    ////case SdState.WR_DATA:
                    //case WR_DATA:
                    case SdState.WR_DATA:
                        ////byte Val = csd[csdCnt++];
                        //byte Val = csd[csdCnt++];
                        let val = csd[csdCnt++];
                        ////if (csdCnt == 16) {
                        //if (csdCnt == 16) {
                        if (csdCnt === 16) {
                            ////csdCnt = 0;
                            //csdCnt = 0;
                            csdCnt = 0;
                            ////currState = SdState.IDLE;
                            //currState = SdState.IDLE;
                            currState = SdState.IDLE;
                            ////cmd = SdCommand.INVALID;
                            //cmd = SdCommand.INVALID;
                            cmd = SdCommand.INVALID;
                        }
                        ////return Val;
                        //return Val;
                        return val;
                }
                //////Cmd = CMD.INVALID;
                //break;
                break;
                //
            ////case SdCommand.SEND_CID:
            //case SdCommand.SEND_CID:
            case SdCommand.SEND_CID:
                ////switch (currState) {
                //switch (currState) {
                switch (currState) {
                    ////case SdState.R1:
                    //case R1:
                    case SdState.R1:
                        ////currState = SdState.DELAY_S;
                        //currState = SdState.DELAY_S;
                        currState = SdState.DELAY_S;
                        ////return 0;
                        //return 0;
                        return 0;
                    ////case SdState.DELAY_S:
                    //case DELAY_S:
                    case SdState.DELAY_S:
                        ////currState = SdState.STARTBLOCK;
                        //currState = SdState.STARTBLOCK;
                        currState = SdState.STARTBLOCK;
                        ////return 0xFF;
                        //return 0xFF;
                        return 0xff;
                    ////case SdState.STARTBLOCK:
                    //case STARTBLOCK:
                    case SdState.STARTBLOCK:
                        ////currState = SdState.WR_DATA;
                        //currState = SdState.WR_DATA;
                        currState = SdState.WR_DATA;
                        ////return 0xFE;
                        //return 0xFE;
                        return 0xfe;
                    ////case SdState.WR_DATA:
                    //case WR_DATA:
                    case SdState.WR_DATA:
                        ////byte Val = cid[cidCnt++];
                        //byte Val = cid[cidCnt++];
                        let val = cid[cidCnt++];
                        ////if (cidCnt == 16) {
                        //if (cidCnt == 16) {
                        if (cidCnt === 16) {
                            ////cidCnt = 0;
                            //cidCnt = 0;
                            cidCnt = 0;
                            ////currState = SdState.IDLE;
                            //currState = SdState.IDLE;
                            currState = SdState.IDLE;
                            ////cmd = SdCommand.INVALID;
                            //cmd = SdCommand.INVALID;
                            cmd = SdCommand.INVALID;
                        }
                        ////return Val;
                        //return Val;
                        return val;
                }
                //////Cmd = CMD.INVALID;
                //break;
                break;
                //
            ////case SdCommand.WRITE_BLOCK:
            ////    //printf(__FUNCTION__" cmd=0x%X, St=0x%X\n", Cmd, CurrState);
            ////    switch (currState) {
            ////        case SdState.R1:
            ////            currState = SdState.RD_DATA_SIG;
            ////            return 0xFE;
            ////
            ////        case SdState.WR_DATA_RESP:
            ////            {
            ////                currState = SdState.IDLE;
            ////                byte Resp = (((byte)SdStatus.DATA_ACCEPTED) << 1) | 1;
            ////                return Resp;
            ////            }
            ////    }
            ////    break;
            //
            ////case SdCommand.WRITE_MULTIPLE_BLOCK:
            ////    switch (currState) {
            ////        case SdState.R1:
            ////            currState = SdState.RD_DATA_SIG_MUL;
            ////            return 0xFE;
            ////        case SdState.WR_DATA_RESP:
            ////            {
            ////                currState = SdState.RD_DATA_SIG_MUL;
            ////                byte Resp = (((byte)SdStatus.DATA_ACCEPTED) << 1) | 1;
            ////                return Resp;
            ////            }
            ////    }
            ////    break;
        }
        //
        ////if (currState == SdState.R1) { // CMD.INVALID
        //if (currState == SdState.R1) { // CMD.INVALID
        if (currState === SdState.R1) { // CMD.INVALID
            ////currState = SdState.IDLE;
            //currState = SdState.IDLE;
            currState = SdState.IDLE;
            ////return 0x05;
            //return 0x05;
            return 0x05;
        }
        //
        ////return 0xFF;
        //return 0xff;
        return 0xff;
    }
}
