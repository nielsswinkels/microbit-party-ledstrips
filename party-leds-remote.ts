let strip: neopixel.Strip = neopixel.create(DigitalPin.P1, 8, NeoPixelMode.RGB)
radio.setGroup(22)
radio.setTransmitPower(7)
let HOLD_DELAY_MAX = 450
let holdDelay = HOLD_DELAY_MAX // TODO implement minimal hold delay
let randomDelay = 30 // seconds
let RANDOM_MAX = 120 // seconds
let randomSwitchTimestamp = 0
let X_THRESHOLD = 100

let mode = 0
let MODE_OFF = 0
let MODE_ON = 1
let MODE_PARTY = 2

let currentOnSetting = 0
let onSettings = [
    "H",
    "S",
    "L",
    "Z"
]
let onSettingsValues = [
    [0, 0, 359],
    [0, 0, 99],
    [99, 0, 99],
    [5, 0, 20]
]

let currentPartyMode = 0
let partyModes = [
    "SNOWFLAKE",
    "FADE COLORS",
    "SPARKLE",
    "RAINBOW",
    "CAROUSEL",
    "SINGLE FLASH",
    "SPOTLIGHTS",
    "ANIMATED SEPARATED",
]

let remoteModeIndex = 0
let remoteModesNames = [
    [   // let MODE_OFF = 0

    ],
    [	// let MODE_SEPARATED = 1
        "separatedColor-r",
        "separatedColor-g",
        "separatedColor-b",
        "separatedSpace"
    ],
    [	// MODE_SNOWFLAKE = 2
        "snowflakeLength",
        "snowflakeCounter"
    ],
    [	// let MODE_FADE_COLORS = 3
        "currentColor-r",
        "currentColor-g",
        "currentColor-b",
        "targetColorIndex"
    ],
    [	// let MODE_SPARKLE = 4
        "sparkleColor-r",
        "sparkleColor-g",
        "sparkleColor-b",
        "sparkleDecay",
        "sparkleDelay"
    ],
    [	// let MODE_RAINBOW = 5
        "rainbowCounter",
        "rainbowRange"
    ],
    [	// let MODE_CAROUSEL = 6
        "carouselCounter",
        "carouselDelay"
    ],
    [	// let MODE_DROPLET = 7
        "dropletCounter",
        "dropletPeriod",
        "dropletColor-r",
        "dropletColor-g",
        "dropletColor-b",
        "dropletDelay",
        "dropletDecay"
    ],
    [	// let MODE_SINGLE_FLASH = 8
        "singleFlashDelay",
        "singleFlashCounter",
        "singleFlashPeriod",
        "singleFlashColor-r",
        "singleFlashColor-g",
        "singleFlashColor-b",
        "singleFlashStepsize"
    ],
    [	// let MODE_SPOTLIGHTS = 9
        "spotlightSize",
        "spotlightDelay",
        "spotlightCounter",
        "spotlightPeriod"
    ],
    [	// let MODE_ANIMATED_SEPARATED = 10
        "aniSeparatedColor-r",
        "aniSeparatedColor-g",
        "aniSeparatedColor-b",
        "aniSeparatedSpace",
        "aniSeparatedDelay",
        "aniSeparatedDirection"
    ]
]
// mode [default min max]
let remoteModesValues = [
    [   // let MODE_OFF = 0
    ],
    [	// let MODE_SEPARATED = 1
        [100, 0, 255],
        [100, 0, 255],
        [100, 0, 255],
        [5, 0, 200]
    ],
    [	// MODE_SNOWFLAKE = 2
        [128, 1, 255],
        [0, 0, 1000]
    ],
    [	// let MODE_FADE_COLORS = 3
        [0, 0, 255],
        [0, 0, 255],
        [0, 0, 255],
        [0, 0, 0]
    ],
    [	// let MODE_SPARKLE = 4
        [255, 0, 255],
        [255, 0, 255],
        [255, 0, 255],
        [3, 1, 100],
        [5, 0, 5000]
    ],
    [	// let MODE_RAINBOW = 5
        [0, 0, 1000],
        [60, 0, 720]
    ],
    [	// let MODE_CAROUSEL = 6
        [0, 0, 1000],
        [400, 0, 5000]
    ],
    [	// let MODE_DROPLET = 7
        [0, 0, 1000],
        [35, 0, 1000],
        [255, 0, 255],
        [200, 0, 255],
        [255, 0, 255],
        [1, 0, 5000],
        [10, 0, 100]
    ],
    [	// let MODE_SINGLE_FLASH = 8
        [1, 0, 5000],
        [0, 0, 1000],
        [510, 0, 5000],
        [30, 0, 255],
        [100, 0, 255],
        [30, 0, 255],
        [1, 0, 100]
    ],
    [	// let MODE_SPOTLIGHTS = 9
        [8, 1, 200],
        [1, 0, 5000],
        [0, 0, 1000],
        [25, 0, 500]
    ],
    [	// let MODE_ANIMATED_SEPARATED = 10
        [240, 0, 255],
        [230, 0, 255],
        [220, 0, 255],
        [1, 0, 200],
        [100, 0, 5000],
        [1, -1, 1]
    ]
]



input.onButtonPressed(Button.A, () => {
    led.stopAnimation()
})

input.onButtonPressed(Button.B, () => {
    led.stopAnimation()
})
radio.onDataPacketReceived(({ receivedString: name, receivedNumber: value }) => {

})
input.onGesture(Gesture.Shake, () => {
    if (input.buttonIsPressed(Button.B)) {
        syncAllStrips()
    }
})


basic.forever(() => {
    if(mode != MODE_ON) {
        strip.clear()
        strip.show()
    }
    if (mode == MODE_PARTY && input.runningTime() - randomSwitchTimestamp > randomDelay * 1000
        && isScreenUp()) {
        // we switch to a random mode
        randomSwitchTimestamp = input.runningTime()
        // making sure we change to a new mode by adding at least 1,
        // and max not enough to come back to the same mode.
        currentPartyMode = (currentPartyMode + 1 + Math.random(partyModes.length - 2)) % partyModes.length
        radio.sendValue("mode", currentPartyMode + 2) // +2 because we skip modes off and separated
        strip.clear()
        strip.setPixelColor(0, neopixel.rgb(50,0,50))
        strip.show()
        basic.pause(100)
        radio.sendValue("mode", currentPartyMode + 2) // send it again
        strip.clear()
        strip.show()
    }

    // if a is pressed down
    //  if upside down change mode
    //  else change var
    // if b is pressed change value

    //showColorLeds()

    if (input.buttonIsPressed(Button.A)) {
        if (input.buttonIsPressed(Button.B)) {
            if (isLogoDown()) {
                if (mode == MODE_PARTY) {
                    radio.sendValue("mode", currentPartyMode + 2)
                } else {
                    radio.sendValue("mode", mode)
                }
                basic.showIcon(IconNames.Square)
                basic.pause(100)
            } else {
                //radio.sendValue(clip12(remoteModesNames[mode][remoteModeIndex]), remoteModesValues[mode][remoteModeIndex][0])
                //basic.showString(remoteModesNames[mode][remoteModeIndex] + "=", 80)
                //basic.showNumber(remoteModesValues[mode][remoteModeIndex][0], 80)
                basic.pause(500)
            }
        }
        else if (isLogoDown()) { // only button a pressed and upside down
            mode = (mode + 1) % 3
            if (mode == MODE_PARTY) {
                radio.sendValue("mode", currentPartyMode + 2)
            } else {
                radio.sendValue("mode", mode)
            }
            basic.clearScreen()
            plotLedAt(24 - mode)
            basic.pause(400)
            if (mode == MODE_PARTY) {
                radio.sendValue("mode", currentPartyMode + 2)
            } else {
                radio.sendValue("mode", mode)
            }
        }
        else { // only button a pressed and straight up
            if (mode == MODE_OFF) {

            } else if (mode == MODE_ON) {    // change the current On setting
                let pitch = input.rotation(Rotation.Pitch)
                pitch = Math.min(85, Math.max(0, pitch))
                onSettingsValues[currentOnSetting][0] =
                    pins.map(
                        pitch,
                        85,
                        0,
                        onSettingsValues[currentOnSetting][1],
                        onSettingsValues[currentOnSetting][2]
                    )
                
                switch (currentOnSetting) {
                    case 0:
                    case 1:
                    case 2:
                        led.plotBarGraph(onSettingsValues[currentOnSetting][0], onSettingsValues[currentOnSetting][2])
                        // generate color
                        let sepColor = neopixel.hsl(
                            onSettingsValues[0][0],
                            onSettingsValues[1][0],
                            onSettingsValues[2][0])
                        strip.showColor(sepColor)
                        let rgbhsl = convertColorToRgbHsl(sepColor)
                        // send r g b
                        radio.sendValue(clip12("separatedColor-r"), rgbhsl.r)
                        basic.pause(100)
                        radio.sendValue(clip12("separatedColor-g"), rgbhsl.g)
                        basic.pause(100)
                        radio.sendValue(clip12("separatedColor-b"), rgbhsl.b)
                        basic.pause(100)
                        break;
                    case 3:
                        if (onSettingsValues[currentOnSetting][0] > 9 && onSettingsValues[currentOnSetting][0] < 100) {
                            whaleysans.showNumber(onSettingsValues[currentOnSetting][0])
                        } else {
                            basic.showNumber(onSettingsValues[currentOnSetting][0], 50)
                        }
                        // send separated size
                        radio.sendValue(clip12("separatedSpace"), onSettingsValues[currentOnSetting][0])
                        basic.pause(100)
                        break;
                }
            } else if (mode == MODE_PARTY) {
                //randomDelay = Math.min(randomDelay + 1, RANDOM_MAX)
                let pitch = input.rotation(Rotation.Pitch)
                pitch = Math.min(85, Math.max(0, pitch))
                randomDelay = pins.map(
                    pitch,
                    85,
                    0,
                    5,
                    RANDOM_MAX
                )

                basic.clearScreen()
                if (randomDelay > 9 && randomDelay < 100) {
                    whaleysans.showNumber(randomDelay)
                } else {
                    basic.showNumber(randomDelay, 50)
                }
                //basic.pause(holdDelay)
                //holdDelay -= 10
            }
        }

    } else if (input.buttonIsPressed(Button.B)) { // only button b pressed
        if (isLogoDown()) {
            mode = (mode + 2) % 3 // go back one step
            if (mode == MODE_PARTY) {
                radio.sendValue("mode", currentPartyMode + 2)
            } else {
                radio.sendValue("mode", mode)
            }
            basic.clearScreen()
            plotLedAt(24 - mode)
            basic.pause(400)
            if (mode == MODE_PARTY) {
                radio.sendValue("mode", currentPartyMode + 2)
            } else {
                radio.sendValue("mode", mode)
            }
        } else {    // b button pressed and straight up
            if (mode == MODE_OFF) {

            } else if (mode == MODE_ON) {    // next On setting
                currentOnSetting = (currentOnSetting + 1) % onSettings.length
                basic.clearScreen()
                basic.showString(onSettings[currentOnSetting], 50)
                basic.pause(400)
            } else if (mode == MODE_PARTY) {
                randomDelay = Math.max(randomDelay - 1, 1)
                basic.clearScreen()
                if (randomDelay > 9 && randomDelay < 100) {
                    whaleysans.showNumber(randomDelay)
                } else {
                    basic.showNumber(randomDelay, 50)
                }
                basic.pause(holdDelay)
                holdDelay -= 10
            }
        }

    } else {    // no buttons pressed
        holdDelay = HOLD_DELAY_MAX
        if (isLogoDown()) {
            basic.clearScreen()
            plotLedAt(24 - mode)
            basic.pause(100)
        } else {
            if(mode == MODE_OFF) {
                basic.showIcon(IconNames.No, 80)
            } else if (mode == MODE_ON) {
                basic.clearScreen()
                basic.showString(onSettings[currentOnSetting], 50)
            } else if(mode == MODE_PARTY) {
                //basic.showString(partyModes[currentPartyMode], 80)
                basic.clearScreen()
                plotLedAt(currentPartyMode)
                basic.pause(100)
            }
        }
    }
})
let isPressed = false
control.inBackground(() => {
    while (true) {
        if (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.A)) {
            if (!isPressed) {
                led.stopAnimation()
                isPressed = true
            }
        }
        else {
            isPressed = false
            holdDelay = HOLD_DELAY_MAX
        }
        basic.pause(5)
    }
})
function isLogoUp(): boolean {
    if (input.acceleration(Dimension.Y) > 850) {
        return true
    } else {
        return false
    }
}

function isLogoDown(): boolean {
    if (input.acceleration(Dimension.Y) < -800) {
        return true
    } else {
        return false
    }
}

function isScreenUp(): boolean {
    if (input.acceleration(Dimension.Z) < -800) {
        return true
    } else {
        return false
    }
}

function plotLedAt(pos: number) {
    led.plot(pos % 5, pos / 5)
}

/*
Converts a neopixel color to an object with r, g, b, h, s, l properties.
This can be used to extract rgb and hsl values from a color.
r, g, b output in range [0, 255]
h output in range [0, 360]
s, l output in range [0, 100]

hsl algorithm based on https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
*/
function convertColorToRgbHsl(inColor: number): RgbHsl {
    let r = inColor / 65536
    let g = (inColor - (r * 65536)) / 256
    let b = (inColor - (r * 65536) - (g * 256))

    let t_r = r * 100 / 255
    let t_g = g * 100 / 255
    let t_b = b * 100 / 255
    let max = Math.max(t_r, Math.max(t_g, t_b))
    let min = Math.min(t_r, Math.min(t_g, t_b))
    let h = 0
    let s = 0
    let l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 50 ? d * 100 / (200 - max - min) : d * 100 / (max + min);
        switch (max) {
            case t_r: h = (t_g - t_b) / d + (t_g < t_b ? 6 : 0); break;
            case t_g: h = (t_b - t_r) / d + 2; break;
            case t_b: h = (t_r - t_g) / d + 4; break;
        }
        h = h * 360 / 6;
    }

    return {
        r: r,
        g: g,
        b: b,
        h: h,
        s: s,
        l: l
    }
}

interface RgbHsl {
    r: number
    g: number
    b: number
    h: number
    s: number
    l: number
}

function clip12(name: string): string {
    if (name.length <= 12)
        return name
    return name.substr(name.length - 12, 12)
}

function showColorLeds() {
    strip.clear()

    if (isLogoDown()) {

        strip.show()
        return
    }
    if (isScreenUp()) {
        if (randomDelay <= 0) {
            strip.show()
            return
        }
        let randomSecondsLeft = randomDelay - ((input.runningTime() - randomSwitchTimestamp) / 1000)
        for (let i = 0; i < randomSecondsLeft; i++) {
            strip.setPixelColor(i, neopixel.rgb(10, 10, 10))
        }
        strip.show()
        return
    }

    let len = remoteModesNames[mode][remoteModeIndex].length
    let sub = remoteModesNames[mode][remoteModeIndex].substr(len - 2, 2)
    let rgbIndex = 0
    if (sub == "-r") {
        rgbIndex = 0
        strip.setPixelColor(1, neopixel.colors(neopixel.rgb(remoteModesValues[mode][remoteModeIndex - rgbIndex][0], 0, 0)))
    } else if (sub == "-g") {
        rgbIndex = 1
        strip.setPixelColor(3, neopixel.colors(neopixel.rgb(0, remoteModesValues[mode][remoteModeIndex - rgbIndex][0], 0)))
    } else if (sub == "-b") {
        rgbIndex = 2
        strip.setPixelColor(5, neopixel.colors(neopixel.rgb(0, 0, remoteModesValues[mode][remoteModeIndex - rgbIndex][0])))
    } else {
        strip.show()
        return
    }
    strip.setPixelColor(0, neopixel.colors(neopixel.rgb(remoteModesValues[mode][remoteModeIndex - rgbIndex][0], 0, 0)))
    strip.setPixelColor(2, neopixel.colors(neopixel.rgb(0, remoteModesValues[mode][remoteModeIndex - rgbIndex][0], 0)))
    strip.setPixelColor(4, neopixel.colors(neopixel.rgb(0, 0, remoteModesValues[mode][remoteModeIndex - rgbIndex][0])))


    let finalColor = neopixel.colors(neopixel.rgb(remoteModesValues[mode][remoteModeIndex - rgbIndex][0],
        remoteModesValues[mode][remoteModeIndex - rgbIndex + 1][0],
        remoteModesValues[mode][remoteModeIndex - rgbIndex + 2][0]))

    strip.setPixelColor(7, finalColor)
    strip.setPixelColor(8, finalColor)
    strip.show()
}

function syncAllStrips() {
    for (let mI = 0; mI < remoteModesNames.length; mI++) {
        basic.clearScreen()
        for (let vI = 0; vI < remoteModesNames[mI].length; vI++) {
            radio.sendValue(clip12(remoteModesNames[mI][vI]), remoteModesValues[mI][vI][0])
            plotLedAt(vI)
            basic.pause(100)
        }
    }
}

