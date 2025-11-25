"use strict";

function Memory() {



	//let mem = new Uint8Array(65536)
	let mem = []

	for (let i = 0; i < 8; i++)
		mem[i] = new Uint8Array(65536)

	for (let i = 0; i < diskm_rom.length; i++)
		mem[7][i] = diskm_rom[i]

	this.bank = 0

	this.get_memory = function() {
		return mem
	}

	this.read = function(addr) {
		let result;
		//case (Addr and $FF00) of
		switch (addr & 0xff00) {
			// $F000..$F300: Result := RAMPage[$00, Addr];
			case 0xf000:
			case 0xf100:
			case 0xf200:
			case 0xf300:
				result = mem[0][addr];
				break;
			// $F400:        begin
			// if not frmMain.Active then
			// begin
			// //Result := $FF;
			// //Exit;
			// end;
			// if Addr = $F401 then orMainKey;
			// if Addr = $F402 then orShiftKey;
			// PortKbr.ReadData(Addr, Result);
			// end;
			case 0xf400:
				// result = 0xff;
				// if (addr === 0xf401)
				//     result = keyboard._read(addr);
				result = keyboard.read(addr & 0x03);
				break;
			// $F500:        begin
			// PortROMDisk.PortA := ROMDisk[PortROMDisk.PortB or (PortROMDisk.PortC * $100)];
			// PortROMDisk.ReadData(Addr, Result);
			// end;
			case 0xf500:
				result = 0xff;
				break;
			// $F600:        Result := RAMPage[$00, Addr and $03];
			case 0xf600:
				result = 0xff;
				break;
			// $F700:        case (Addr and $00F0) of
			// $00: if (Addr and $04) = 0 then PortFDD.ReadData(Addr, Result);
			// $10: if (Addr and $04) = 0 then PortFDD.ReadData(Addr, Result);
			// else Result := RAMPage[0, Addr];
			// end;
			case 0xf700:
				result = 0xff;
				break;
			// $F800..$FF00: Result :=  ROMMonitor[orPortFC, Addr and $07FF];
			case 0xf800:
			case 0xf900:
			case 0xfa00:
			case 0xfb00:
			case 0xfc00:
			case 0xfd00:
			case 0xfe00:
			case 0xff00:
				result = m2rom[addr & 0x07ff];
				break;
			// $0000..$EF00: Result := RAMPage[orPageRAM, Addr];
			default:
				result = mem[0][addr];
				break;
			// end;
		}
		return result;
	}

	this.write = function(addr, val) {
		mem[addr] = val
	}
}
