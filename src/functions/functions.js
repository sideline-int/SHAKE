/**
 * @customfunction
 * @description Vibrates at a given intensity. 
 * @param {number} intensity Vibration intensity level, between 0 and 1.
 * @param {number} [device] Index of the device to be vibrated.
 * @param {number} [vibrator] Index of the vibrator within the device to be vibrated.
 */
function Vibrate(intensity, device, vibrator) {
	//deviceMap = OfficeRuntime.storage.getItem("deviceMap");
	deviceMap = undefined;
	if(!(deviceMap instanceof Map)) {
		throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, "Something went wrong with the SHAKE setup");
	}
	if(deviceMap.size == 0) {
		throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, "No devices are connected!");
	}
	if(intensity < 0) { intensity = 0; }
	if(intensity > 1) { intensity = 1; }
	if(device != undefined) {
		device = deviceMap.get(device);
		if(device == undefined) {
			throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, "The chosen device isn't connected!");
		}
		if(vibrator != undefined) {
			
		}
	}
	return;
}

CustomFunctions.associate("VIBRATE", Vibrate);