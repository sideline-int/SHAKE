/* global console */

/**
 * Vibrates at a given intensity. 
 * @customfunction
 * @param intensity {number} Vibration intensity level, between 0 and 1.
 * @param [device] {number} Index of the device to be vibrated.
 * @param [vibrator] {number} Index of the vibrator within the device to be vibrated.
 * @return {number} intensity.
 */
function vibrate(intensity, device, vibrator) {
	console.log("Manual vibrate at "+intensity);
	if(!(window.deviceMap instanceof Map)) {
		throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, "Something went wrong with the SHAKE setup");
	}
	if(window.deviceMap.size == 0) {
		throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, "No devices are connected!");
	}
	if(intensity < 0) { intensity = 0; }
	if(intensity > 1) { intensity = 1; }
	if(device != undefined) {
		const dev = window.deviceMap.values().filter(d => d.index == device).toArray()[0];
		if(dev == undefined) {
			throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, "The chosen device isn't connected!");
		}
		if(vibrator != undefined) {
			const feat = dev.features.values().filter((f) => f._feature.FeatureIndex == vibrator).toArray()[0];
			if(feat == undefined) {
				throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, "The chosen vibrator doesn't exist!");
			} else {
				feat.runOutput(buttplug.DeviceOutput.Vibrate.percent(intensity));
			}
		} else {
			// Vibrate all
			dev.runOutput(buttplug.DeviceOutput.Vibrate.percent(intensity));
		}
	} else {
		// Run all devices
		console.log("Run all");
		for(const dev of deviceMap.values()) {
			dev.runOutput(buttplug.DeviceOutput.Vibrate.percent(intensity));
		}
	}
	return intensity;
}

/**
 * Returns the current device IDs.
 * @customfunction
 * @returns {number[][]} device IDs.
 */
function devices() {
	console.log("Requested devices");
	if(!window.deviceMap || window.deviceMap.size == 0) {
		throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, "No devices connected.");
	}
	let retv = Array.from(window.deviceMap.values()).map(d => [d.index]);
	return retv;
}

/**
 * Returns the vibrator IDs for a given device.
 * @customfunction
 * @param device {number} Index of the device.
 * @returns {number[][]} vibrator IDs.
 */
function vibrators(device) {
	console.log("Requested vibrators");
	if(!window.deviceMap || window.deviceMap.size == 0) {
		throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, "No devices connected.");
	}
	let dev = window.deviceMap.values().filter(d => d.index == device).toArray()[0]
	let vibes = dev.features.values().filter((f) => f.hasOutput(buttplug.OutputType.Vibrate)).toArray();
	let retv = vibes.map(k => [k._feature.FeatureIndex]);
	console.log(retv);
	return retv;
}

console.log("Set up functions!");