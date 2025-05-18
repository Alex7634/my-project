package jemu.system.msx1fpga.sdcard;

import jemu.core.Util;
import jemu.core.device.*;

public class SD extends Device {

    protected int ctrl_rd = 0b11111101;
    protected int ctrl_wr = 0xff;

    protected SdCard sdCard = new SdCard();




    public SD() {
        super("Sd Card");
    }

    public void addDisk(byte[] disk) {
        sdCard.addDisk(disk);
    }

    public int readPort(int port) {
        if ((port & 0xff) == 0x9e)
            return ctrl_rd;
        else {
            int result = sdCard.read();
            System.out.println("In : "+ Util.hex((byte)result));
            return result;
        }
    }

    public void writePort(int port, int value) {
        if ((port & 0xff) == 0x9e)
            ctrl_wr = value;
        else {
            //if (value == 0x51)
            //    System.out.println("CMD?");
            System.out.println("Out: "+ Util.hex((byte)value));
            sdCard.write(value);
        }
    }
}
