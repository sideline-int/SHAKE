## Stimulating Haptics Add-in for Kinematic Enhancement 

SHAKE is an Add-in for Microsoft Word and Excel to interface with [buttplug](https://buttplug.io/). With SHAKE, each time you type, your device will gradually ramp up its vibration. Keep typing to keep it going!

You'll need to have [Intiface Central](https://intiface.com/central/) installed and running. In SHAKE, type in the port that Intiface Central's running on (typically 12345), and click Connect. You can then change the maximum intensity for each vibrator on each of your devices, as well as the "linger" (which will spread out the response to your typing over a longer time).

https://github.com/user-attachments/assets/bedbf547-ffbf-4bee-9564-355dbe58fbc9

You can also use the `SHAKE.VIBRATE()` function in Excel to control your devices. See also `SHAKE.DEVICES()` and `SHAKE.VIBRATORS()` for some basic helpers.

### Important limitations
* Word and Excel are available on approximately too many platforms. I haven't tested on all of them, so some (looking at you iPad) might not work, even if you manage to load it. If you run into problems feel free to open an issue and I might look into it.
* We can only detect your typing in Word (very roughly) about once per second, so you'll always have a second or so of latency. The Word APIs just weren't designed for live updates.
* Linger was designed around Word, so it may be less intuitive on Excel. Still, it should work generally fine.
* Non-vibrating modes of operation (such as strokers) are not currently supported. I don't have the hardware to test these with, so for now I won't be adding support.

### Installation
Instllation is relatively difficult for now, as it has to be [sideloaded](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/test-debug-office-add-ins#sideload-an-office-add-in-for-testing). Here's the short version:
* Word and Excel on the web are relatively easy. First, download the [manifest file](https://sideline-int.github.io/SHAKE/manifest.xml). Open a Word/Excel document, click Add-ins in the ribbon, click More Add-ins in the popup, switch to the My Add-ins tab in the new popup, click Upload My Add-in, and click browse and select the manifest file you jsut downloaded. You can then upload it and use SHAKE.
* On Windows, clone or download the repository. Change `app_to_debug` in `package.json` to either "word" or "excel" depending on which you want to use. Make sure Node is installed on your computer. Then, from a command prompt window in the SHAKE repository folder, run `npm install` and `npm run start`. This will pop up a Word/Excel window with SHAKE installed.
* For MacOS, there's [instructions](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-mac) that look straightforward, but I haven't tried them because I don't have a Mac. There's also [a thing for iPads](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-ipad) that I doubt will work but would be interested if anyone gets it working.

### Future goals
* Add support for other Microsoft Add-in platforms. It looks like some (notably, PowerPoint) simply don't support us listening to user changes directly, so it'd be a big mess to figure out some poorly-documented and probably unstable APIs to let us do it. There's also Outlook, but Outlook Add-ins have a unique set of requirements that makes it a bit more difficult for now. Microsoft is working on improving the situation though, so maybe in the future.
* Get it on the Microsoft Marketplace so it can be more easily installed, if possible.
