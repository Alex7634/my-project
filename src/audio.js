"use strict";

function Audio() {

	let audioContext = new (window.AudioContext || window.webkitAudioContext)();
	const filter = audioContext.createBiquadFilter();
	filter.type = "highpass";
	filter.frequency.value = 50;
	filter.Q.value = 0.7;
	filter.gain.value = 0;
	filter.connect(audioContext.destination);
	let audioGain = audioContext.createGain();
	audioGain.connect(filter);
	audioGain.gain.value = 0;
	let audioConst = audioContext.createConstantSource(1);
	audioConst.connect(audioGain);
	let audioStarted = false;
	let audioTime = 0;
	let audioResyncCounter = 0;
	const audioDelaySec = 0.2;

	function AudioStart() {
		if (audioStarted)
			return;
		audioConst.start();
		audioStarted = true;
		audioTime = audioContext.currentTime + audioDelaySec;
		//this.audioTick = 0;
		removeEventListener("click", AudioStart);
	}

	document.addEventListener("click", AudioStart);

	this.audioTick = 0;

	//function AudioSync() {
	this.AudioSync = function(cpuFreq) {
		if (!audioStarted)
			return;

		// Не даём переполнится счетчику audioTick
		while (this.audioTick >= cpuFreq) {
			this.audioTick -= cpuFreq;
			audioTime += 1;
		}

		// Считаем разбег реального времени аудио и внутреннего
		// Если мы обогнали на 1 секунду или нет запаса 0.2, то синхронизируемся
		const audioNow = audioContext.currentTime;
		const audioDelta = audioTime + this.audioTick / cpuFreq - audioNow;
		if (audioDelta <= 0 || audioDelta > audioDelaySec * 2) {
			audioTime = audioNow + audioDelaySec;
			this.audioTick = 0;
			audioResyncCounter++;
		}
		// debug: document.title = audioResyncCounter + " " + audioDelta;
	}

	//function AudioLevel(level) {
	this.AudioLevel = function(level, cpuFreq) {
		if (!audioStarted)
			return;
		audioGain.gain.setValueAtTime(level, audioTime + this.audioTick / cpuFreq);
	}
}
