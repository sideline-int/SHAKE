Office.onReady((info) => {
	console.log(info.host);
	
	const connectView = document.getElementById('connect-view');
	const portInput = document.getElementById('port-input');
	const controlView = document.getElementById('control-view');
	const connectBtn = document.getElementById('connect-btn');
	const errorView = document.getElementById('error-popup');
	const errorList = document.getElementById('error-list');
	const closeBtn = document.getElementById('error-close');
	const stopBtn = document.getElementById('stop-btn');
	const disconnectBtn = document.getElementById('disconnect-btn');
	const lingerInput = document.getElementById('linger-input');
	const lingerValue = document.getElementById('linger-value');
	
	// Error handling
	function showError(err) {
		name = err instanceof Event ? err.type : err.name;
		message = err instanceof Event ? err.target : err.message;
		classP = document.createElement('p');
		classP.textContent = name;
		errP = document.createElement('p');
		errP.textContent = message;
		errorList.append(classP, errP);
		errorView.classList.add('active');
	}
	
	errorView.addEventListener('click', (e) => {
		if(e.target == errorView || e.target == closeBtn) {
			errorView.classList.remove('active');
			errorList.innerHTML = '';
		}
	});
	
	var connector;
	var client = new buttplug.ButtplugClient('SHAKE');
	
	var features = [];
	var linger = 30;
	intensity = 0;
	timeoutList = [];
	
	function disconnectDOM() {
		controlView.classList.remove('active');
		connectView.classList.add('active');
		Array.from(document.getElementsByClassName('device-controls')).forEach((e) => {
			if(e.hasAttribute("bpidx")) {
				e.remove();
			}
		});
		features.length = 0;
	}
	
	// Run these functions whenever the vibration intensity might need to change
	async function updateVibes() {
		if(!client.connected) {
			disconnectDOM();
			return;
		}
		console.log("Vibing at "+intensity);
		for(feat of features) {
			if(feat.type == 'vibe') {
				featInt = feat.active ? feat.amp*intensity : 0;
				feat.feature.runOutput(buttplug.DeviceOutput.Vibrate.percent(featInt)).catch(e => showError(e));
			}
		}
	}
	
	function stop() {
		console.log("Stopping!")
		for(a of timeoutList) {
			clearTimeout(a);
		}
		timeoutList = [];
		intensity = 0;
		updateVibes();
	}
	
	function addIntensity(frac, duration) {
		intensity += frac;
		if(intensity > 1) {
			intensity = 1;
		}
		updateVibes();
		timeoutList.push(setTimeout(() => {
			intensity -= frac;
			if(intensity < 0.000001) {
				stop(); // For cleanup and rounding purposess
			} else {
				updateVibes();
			}
		}, duration*1000));
	}
	
	// Connect button attempts to connect, switch to control view
	async function connect() {
		const port = portInput.value;
		connector = new buttplug.ButtplugBrowserWebsocketClientConnector('ws://localhost:'+port);
		try {
			await client.connect(connector);
			console.log("Client connected");
			connectView.classList.remove('active');
			controlView.classList.add('active');
		} catch (e) {
			showError(e);
		} 
	}
	
	// Handle connection inputs
	connectBtn.addEventListener('click', connect);
	portInput.addEventListener('keypress', async () => {
		if(event.key == 'Enter') {
			connect();
		}
	});

	// Disconnect button attempts to disconnect, switch to connect view
	disconnectBtn.addEventListener('click', async () => {
		console.log("Disconnecting");
		try {
			stop();
			await client.disconnect();
			disconnectDOM();
		} catch (e) {
			showError(e);
		}
	});
	
	// E-Stop button
	stopBtn.addEventListener('click', async() => {
		// Don't await, send as many commands as quickly as possible
		for(feat of features) {
			if(feat.type == 'vibe' && feat.active) {
				feat.feature.runOutput(buttplug.DeviceOutput.Vibrate.percent(0));
			}
		}
		// Now run regular stop commands for cleanup
		stop();
	});
	
	// Linger slider
	lingerInput.addEventListener('input', (e) => {
		linger = e.target.value;
		lingerValue.textContent = e.target.value;
	});
	
	client.addListener('deviceadded', (device) => {
		console.log('Device added!');
		console.log(device);
		
		let ctrlsDiv = document.createElement('div');
		ctrlsDiv.setAttribute('bpidx', device.index);
		ctrlsDiv.classList.add('device-controls');
		let ch2 = document.createElement('h2');
		ch2.textContent = device.displayName || device.name;
		ctrlsDiv.append(ch2);
		
		vibes = device.features.values().filter((f) => f.hasOutput(buttplug.OutputType.Vibrate));
		idx = 0;
		for(vibe of vibes) {
			const vibeObj = {'type': 'vibe', 'amp': 0, 'active': true, 'feature': vibe}
			features.push(vibeObj);
			let vibeDiv = document.createElement('div');
			vibeDiv.classList.add('control-group');
			
			// Create toggle switch
			let togDiv = document.createElement('div');
			togDiv.classList.add('toggle-div');
			let togSwitch = document.createElement('label');
			togSwitch.classList.add('toggle-switch');
			let cb = document.createElement('input');
			cb.setAttribute('type', 'checkbox');
			cb.setAttribute('checked', true);
			let togSlider = document.createElement('span');
			togSlider.classList.add('toggle-slider');
			let togStatus = document.createElement('span');
			togStatus.textContent = 'Enabled';
			togStatus.classList.add('toggle-label');
			cb.addEventListener('change', async (e) => {
				vibeObj.active = e.target.checked;
				togStatus.textContent = e.target.checked ? 'Enabled' : 'Disabled';
				updateVibes();
			});
			togSwitch.append(cb, togSlider);
			togDiv.append(togSwitch, togStatus);
			
			// Create slider bar
			let slideInp = document.createElement('input');
			slideInp.setAttribute('type', 'range');
			slideInp.setAttribute('min', 0);
			slideInp.setAttribute('max', 100);
			slideInp.setAttribute('step', 1);
			slideInp.setAttribute('value', 0);
			let slideVal = document.createElement('span');
			slideVal.classList.add('slider-value');
			slideVal.textContent = '0';
			slideVal.setAttribute('title', 'Maximum intensity. Intensity will be scaled from 0 to this number out of 100.');
			slideInp.addEventListener('input', (e) => {
				vibeObj.amp = e.target.value/100;
				if(vibeObj.active) {
					vibe.runOutput(buttplug.DeviceOutput.Vibrate.percent(vibeObj.amp*intensity));
				}
				slideVal.textContent = e.target.value;
				updateVibes();
			});
			
			vibeDiv.append(togDiv, slideInp, slideVal);
			ctrlsDiv.append(vibeDiv);
			
			idx++;
		}
		
		controlView.append(ctrlsDiv);
	});
	
	client.addListener('deviceremoved', (device) => {
		for(let i = features.length-1; i >= 0; i--) {
			if(features[i].feature._deviceIndex = device.index) {
				features.splice(i, 1);
			}
		}
		for(ctrlsDiv of controlView.children) {
			if(ctrlsDiv.getAttribute('bpidx') == device.index) {
				ctrlsDiv.remove();
			}
		}
	});
	
	if(info.host === Office.HostType.Word) {
		// Update when the document updates (roughly once/second on desktop, very inconsistent online)
		Word.run(async (context) => {
			context.document.onParagraphChanged.add(async (e) => {
				addIntensity(1/linger, linger)
			});
			await context.sync();
		});
	}
	
	if(info.host === Office.HostType.Excel) {
		//OfficeRuntime.storage.setItem("deviceMap", deviceMap);
		Excel.run(async (context) => {
			let sheets = context.workbook.worksheets;
			sheets.load("items/name");
			await context.sync();
			sheets.onChanged.add(async (e) => {
				addIntensity(1/linger, linger)
			});
		});
	}
});