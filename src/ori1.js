"use strict";

document.addEventListener("DOMContentLoaded", function() {

    // Тайминги
    const cpuFreq = 19062000 / 9; // = 2118000
    const linePeriod = 68 * 2;
    const framePeriod = linePeriod * 312;

    // Звук
    // let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // const filter = audioContext.createBiquadFilter();
    // filter.type = "highpass";
    // filter.frequency.value = 50;
    // filter.Q.value = 0.7;
    // filter.gain.value = 0;
    // filter.connect(audioContext.destination);
    // let audioGain = audioContext.createGain();
    // audioGain.connect(filter);
    // audioGain.gain.value = 0;
    // let audioConst = audioContext.createConstantSource(1);
    // audioConst.connect(audioGain);
    // let audioStarted = false;
    // let audioTime = 0;
    // let audioTick = 0;
    // let audioResyncCounter = 0;
    // const audioDelaySec = 0.2;

    // function AudioStart() {
    //     if (audioStarted)
    //         return;
    //     audioConst.start();
    //     audioStarted = true;
    //     audioTime = audioContext.currentTime + audioDelaySec;
    //     audioTick = 0;
    //     removeEventListener("click", AudioStart);
    // }

    // document.addEventListener("click", AudioStart);

    // function AudioSync() {
    //     if (!audioStarted)
    //         return;
    //
    //     // Не даём переполнится счетчику audioTick
    //     while (audioTick >= cpuFreq) {
    //         audioTick -= cpuFreq;
    //         audioTime += 1;
    //     }
    //
    //     // Считаем разбег реального времени аудио и внутреннего
    //     // Если мы обогнали на 1 секунду или нет запаса 0.2, то синхронизируемся
    //     const audioNow = audioContext.currentTime;
    //     const audioDelta = audioTime + audioTick / cpuFreq - audioNow;
    //     if (audioDelta <= 0 || audioDelta > audioDelaySec * 2) {
    //         audioTime = audioNow + audioDelaySec;
    //         audioTick = 0;
    //         audioResyncCounter++;
    //     }
    //     // debug: document.title = audioResyncCounter + " " + audioDelta;
    // }

    // function AudioLevel(level) {
    //     if (!audioStarted)
    //         return;
    //     audioGain.gain.setValueAtTime(level, audioTime + audioTick / cpuFreq);
    // }

    // Для отрисовки
    let canvas = document.getElementById("iskra1080canvas");

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
    let cpmMode = false;
    let rightPortL = 0;
    let rightPortH = 0;

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
        rightPortL = 0;
        rightPortH = 0;
        cpmMode = (mode == 1);
        for (let i in memory[0])
            memory[0][i] = 0xAA;
        // for (let i in palette)
        //     palette[i] = 0;
        //for (let i in rg)
        //    rg[i] = 0;
        //extensionCard.romEnable(mode == 2);
        //extensionCard.powerReset();
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


        // if (addr < 0xC800) {
        //     if (flags & 1)
        //         memory_map = 0; // m1
        //     if (memory_map === 0)
        //         waitRam();
        //     return memory_map === 0 ? memory[addr] : iskra1080Rom[addr - (rg[2] ? romStart2 : romStart)];
        // }
        //
        // if (addr < 0xD000) {
        //     if (flags & 1)
        //         memory_map = 1; // m1
        //     if (memory_map !== 1)
        //         waitRam();
        //     return memory_map !== 1 ? memory[addr] : iskra1080Rom[addr - (rg[2] ? romStart2 : romStart)];
        // }
        //
        // if (flags & 1)
        //     memory_map = 2;
        //
        // if (memory_map !== 2)
        //     waitRam();
        // return memory_map !== 2 ? memory[addr] : iskra1080Rom[addr - romStart];
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
                if (addr === 0xf400)
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
                break;
            case 0xf800:
                video.set_mode(byte);
                break;
            case 0xf900:
                my_memory.bank = byte & 0x07; // 512kb
                break;
            // $FA00:        orSelectScreenPage(Val);
            case 0xfa00:
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

        // if (extensionCard.write(addr, byte))
        //     return;
        // waitRam();
        // memory[addr] = byte;
    };

    cpu.readIo = function(addr) {
        let result;
        result = cpu.readMemory((addr * 0x100) | addr);
        return result;

        // let result = extensionCard.readIo(addr);
        // if (result !== undefined)
        //     return result;
        // if ((addr & 0xF8) == 0xC0)
        //     return keyboard.read(addr);
        // switch (addr & 0xB8) {
        // case 0x98:
        //     if (cpmMode)
        //         return floppyController.read(addr & 1);
        //     return (addr & 1) ? rightPortH : rightPortL;
        // }
        // return 0;
    };

    let tapeOut = false;

    cpu.writeIo = function(addr, byte) {
        switch (addr & 0xff00) {
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

        // if (extensionCard.writeIo(addr, byte))
        //     return;
        // if ((addr & 0xF8) == 0xC0) {
        //     setLeds(byte >> 4);
        //     return keyboard.write(addr, byte);
        // }
        // switch (addr & 0xB8) {
        // case 0x80:
        //     break; // UART
        // case 0x88:
        //     if (cpmMode)
        //         floppyController.write(byte ^ 0xFF);
        //     break;
        // case 0x90:
        //     palette[addr & 3] = byte;
        //     break;
        // case 0x98:
        //     if (cpmMode)
        //         floppyController.write(addr & 1, byte);
        //     break;
        // case 0xA0:
        //     for (let i = 0; i < 8; i++)
        //         cpu.writeIo(0xB8 + i, 0);
        //     break;
        // case 0xA8:
        //     rom0000 = (byte & 0x80) == 0;
        //     break;
        // case 0xB8:
        //     rg[addr & 7] = (addr & 0x40) != 0;
        //     if ((addr & 7) <= 1)
        //         video.setMode((rg[0] ? 1 : 0) | (rg[1] ? 2 : 0));
        //     if (cpmMode)
        //         floppyController.writeControl((rg[5] ? 1 : 0) | (rg[7] ? 2 : 0));
        //     break;
        // case 0xB0: // 0B0h - 0B7h, 0F0h - 0F7h
        //     tapeOut = !tapeOut;
        //     AudioLevel(tapeOut ? 1 : -1);
        //     break;
        // }
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

    // let fileInUrl = (document.URL + "").split("?");
    // if (fileInUrl.length === 2)
    //     include("file." + fileInUrl[1] + ".js");
});
