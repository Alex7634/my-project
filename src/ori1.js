"use strict";

document.addEventListener("DOMContentLoaded", function() {

    //document.getElementById('test_out').value = '';

    // Тайминги
    //const cpuFreq = 19062000 / 9; // = 2118000
    const cpuFreq = 10_000_000 / 4; // = 2_500_000
    //const linePeriod = 68 * 2;
    const linePeriod = 0.000064 / (1 / cpuFreq);
    const framePeriod = linePeriod * 312;

    // Для отрисовки
    let canvas = document.getElementById("screen");

    // Состояние
    //let rg = [ 0, 0, 0, 0, 0, 0, 0 ];

    // Все устройства компьютера
    let my_memory = new Memory();
    let memory = my_memory.get_memory();

    let my_io = new IO();

    let audio = new Audio();

    var keyboard = new Keyboard();
    let video = new Video(canvas);
    video.set_memory(memory);

    let spi_sd = new SpiSD();


    const core = {
        // mem_read  : function(addr)     { return self._mem_read (addr)    ; },
        // mem_write : function(addr,val) {        self._mem_write(addr,val); },
        // io_read   : function(port)     { return self._io_read  (port)    ; },
        // io_write  : function(port,val) {        self._io_write (port,val); },
        mem_read  : function(addr)     { return mem_read(addr)    ; },
        mem_write : function(addr,val) { mem_write(addr,val); },
        io_read   : function(port)     { return my_io.read  (port)    ; },
        io_write  : function(port,val) {        my_io.write (port,val); },
    };

    let cpu = new I8080(core);


    let debugerEnabled = false; // Для оптимизации
    //let debuger = new Debuger(cpu, function() {
    //    debugerEnabled = true;
    //});

    // Привязать меню отладчика
    // document.getElementById("debugerStop").onclick = function() {
    //     debuger.stop();
    // };

    function reset() {
        cpu.iff = 0;
        cpu.jump(0xf800);
        keyboard.reset();
    }

    // document.getElementById('resetButton').addEventListener("click", reset);

    function powerResetInternal(mode) {
        for (let i in memory[0])
            memory[0][i] = 0xAA;
        reset();
    }



    function powerResetExt() {
        powerResetInternal(2);
    }

    let tickCount = 0;

    let mem_read = function(addr, flags) {

        let result;
        //case (Addr and $FF00) of
        switch (addr & 0xff00) {
            // $F000..$F300: Result := RAMPage[$00, Addr];
            case 0xf000:
            case 0xf100:
            case 0xf200:
            case 0xf300:
                result = memory[0][addr];
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
                if ((addr & 0xfffc) === 0xf760)
                    result = spi_sd.read(addr & 0x03)
                else
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
                result = m2o_rom[addr & 0x07ff];
                break;
            // $0000..$EF00: Result := RAMPage[orPageRAM, Addr];
            default:
                result = memory[my_memory.bank][addr];
                break;
        // end;
        }
        return result;


    };

    let mem_write = function(addr, byte) {
        // case (Addr and $FF00) of
        switch (addr & 0xff00) {
            // $F000..$F300: RAMPage[$00, Addr] := Val;
            case 0xf000:
            case 0xf100:
            case 0xf200:
            case 0xf300:
                memory[0][addr] = byte;
                break;
            // $F400:        begin
            // LastPortC := (PortKbr.PortC and $04);
            // PortKbr.WriteData(Addr, Val);
            // if (PortKbr.PortC and $04) <> LastPortC then ChangeLedRus := True;
            // end;
            case 0xf400:
                if ((addr & 0xff03) === 0xf400)
                    keyboard.write(byte);
                break;
            // $F500:        PortROMDisk.WriteData(Addr, Val);
            case 0xf500:
                break;
            // $F700:        case (Addr and $00F0) of
            // $00: if (Addr and $04) = 0 then PortFDD.WriteData(Addr, Val)
            // else PortFDD.WriteRegCR(Val);
            // $10: if (Addr and $04) = 0 then PortFDD.WriteData(Addr, Val)
            // else PortFDD.WriteRegCR(Val);
            // $20: PortFDD.WriteRegCR(Val);
            // end;
            case 0xf700:
                if ((addr & 0xfffc) === 0xf760)
                    spi_sd.write(addr & 0x03, byte)
                break;
            case 0xf800:
                video.set_mode(byte);
                break;
            case 0xf900:
                my_memory.bank = byte & 0x07; // 512kb
                break;
            case 0xfa00:
                video.set_page(byte)
                break;
            case 0xfb00:
            case 0xfc00:
            case 0xfd00:
            case 0xfe00:
            case 0xff00:
                break;
            // $0000..$EF00: RAMPage[orPageRAM, Addr] := Val;
            default:
                memory[my_memory.bank][addr] = byte;
                break;
        // end;
        }

    };

    cpu.readIo = function(addr) {
        let result;
        result = cpu.readMemory((addr * 0x100) | addr);
        return result;

    };

    let tapeOut = false;

    cpu.writeIo = function(addr, byte) {
        switch (addr & 0xff00) {
            //case 0xf4:
            //    keyboard.write(byte);
            //    break;
            // $F8:      orSelectScreenMode(Val);
            case 0xf8:
                break;
            // $F9:      orSelectPage(Val);
            case 0xf9:
                break;
            // $FA:      orSelectScreenPage(Val);
            case 0xfa:
                break;
            // $FB:      orPortFB := Val;
            case 0xfb:
                break;
            // $FC:      if orSandwichROM then orPortFC := Val;
            case 0xfc:
                break;
            case 0xfd:
                break;
            // $FE:      if orZXSound then orZXBeep(Val);
            case 0xfe:
                break;
            // $FF:      if orToggleSound then orToggleBeep(Val);
            case 0xff:
                break;
            // $0000..$EF00: RAMPage[orPageRAM, Addr] := Val;
            default:
                // PokeByte(((LowAddr * $100) or LowAddr), Val);
                //cpu.writeMemory((addr * 0x100) | addr, byte);
                mem_write((addr * 0x100) | addr, byte);
                break;
        }

        
    };

    cpu.beeper = function(value) {
        audio.AudioLevel(value ? 0.1 : -0.1, cpuFreq);
    }

    let lastTime = new Date().getTime();
    let needTickCount = 0;

    function cpuTick() {
        if (debugerEnabled && debuger.paused())
            return;

        // Сколько прошло времени
        const now = new Date().getTime();
        let delta = now - lastTime;
        lastTime = now;

        // Больше 500 мс за раз не работаем
        if (delta > 500)
            delta = 500;

        // До какого такта процессора работаем
        needTickCount += Math.round(delta / 1000 * cpuFreq);

        // Если по тактам получается больше 1 секунды работать, или больше 1
        // секунды бездействовать, то вообще ничего не делаем.
        if (Math.abs(needTickCount - tickCount) > cpuFreq)
            needTickCount = tickCount;

        // Синхронизация звука
        audio.AudioSync(cpuFreq);

        // Работа
        while (tickCount < needTickCount) {
            //const t = cpu.instruction(extensionCard.getInterrupt());
            const t = cpu.instruction(false);
            tickCount += t;
            audio.audioTick += t;
            while (tickCount >= framePeriod && needTickCount >= framePeriod) {
                //extensionCard.horzSync();
                // Не даём переполнится счетчикам
                needTickCount -= framePeriod;
                tickCount -= framePeriod;
            }
            if (debugerEnabled && debuger.cpuTick())
                break;
        }
    }
    window.setInterval(cpuTick, 10);

    function videoTick() {
        video.update();
    }
    window.setInterval(videoTick, 1000 / 50);

    powerResetExt();

});
