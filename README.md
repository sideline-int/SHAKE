## SHAKE
### Stimulating Haptics Add-in for Kinematic Enhancement 

SHAKE is an Add-in for Microsoft Word and Excel to interface with [buttplug](https://buttplug.io/). With SHAKE, each time you type, your device will gradually ramp up its vibration. Keep typing to keep it going!

You'll need to have [Intiface Central](https://intiface.com/central/) installed and running. In SHAKE, type in the port that Intiface Central's running on (typically 12345), and click Connect. You can then change the maximum intensity for each vibrator on each of your devices, as well as the "linger" (which will spread out the response to your typing over a longer time).

Important limitations:
* Word and Excel are available on approximately too many platforms. I haven't tested on all of them, so some (looking at you iPad) might not work, even if you manage to load it. If you run into problems feel free to open an issue and I might look into it.
* We can only detect your typing in Word (very roughly) about once per second, so you'll always have a second or so of latency. The Word APIs just weren't designed for live updates.
* Linger was designed around Word, so it may be less intuitive on Excel. Still, it should work generally fine.
* Non-vibrating modes of operation (such as strokers) are not currently supported. I don't have the hardware to test these with, so for now I won't be adding support.

Future goals:
* Add support for updating the vibration with a custom Excel function. Shouldn't be too hard, just need to figure out how to wire it in.
* Add support for other Microsoft Add-in platforms. It looks like some (notably, PowerPoint) simply don't support us listening to user changes directly, so it'd be a big mess to figure out some poorly-documented and probably unstable APIs to let us do it. There's also Outlook, but Outlook Add-ins have a unique set of requirements that makes it a bit more difficult for now. Microsoft is working on improving the situation though, so maybe in the future.