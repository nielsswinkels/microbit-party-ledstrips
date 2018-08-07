let strip: neopixel.Strip = neopixel.create(DigitalPin.P1, 8, NeoPixelMode.RGB)
radio.setGroup(22)
radio.setTransmitPower(7)
let HOLD_DELAY_MAX = 450
let holdDelay = HOLD_DELAY_MAX // TODO implement minimal hold delay
let mode = 0 // 0-9
let remoteModeIndex = 0
let remoteModesNames = [
    [	// MODE_SNOWFLAKE = 0
        "snowflakeLength",
        "snowflakeCounter"
    ],
    [	// let MODE_FADE_COLORS = 1
        "currentColor-r",
        "currentColor-g",
        "currentColor-b",
        "targetColorIndex"
    ],
    [	// let MODE_SPARKLE = 2
        "sparkleColor-r",
        "sparkleColor-g",
        "sparkleColor-b",
        "sparkleDecay",
        "sparkleDelay"
    ],
    [	// let MODE_RAINBOW = 3
        "rainbowCounter",
        "rainbowRange"
    ],
    [	// let MODE_CAROUSEL = 4
        "carouselCounter",
        "carouselDelay"
    ],
    [	// let MODE_DROPLET = 5
        "dropletCounter",
        "dropletPeriod",
        "dropletColor-r",
        "dropletColor-g",
        "dropletColor-b",
        "dropletDelay",
        "dropletDecay"
    ],
    [	// let MODE_SINGLE_FLASH = 6
        "singleFlashDelay",
        "singleFlashCounter",
        "singleFlashPeriod",
        "singleFlashColor-r",
        "singleFlashColor-g",
        "singleFlashColor-b",
        "singleFlashStepsize"
    ],
    [	// let MODE_SPOTLIGHTS = 7
        "spotlightSize",
        "spotlightDelay",
        "spotlightCounter",
        "spotlightPeriod"
    ],
    [	// let MODE_SEPARATED = 8
        "separatedColor-r",
        "separatedColor-g",
        "separatedColor-b",
        "separatedSpace"
    ],
    [	// let MODE_ANIMATED_SEPARATED = 9
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
    [	// MODE_SNOWFLAKE = 0
        [128, 1, 255],
        [0, 0, 1000]
    ],
    [	// let MODE_FADE_COLORS = 1
        [0, 0, 255],
        [0, 0, 255],
        [0, 0, 255],
        [0, 0, 0]
    ],
    [	// let MODE_SPARKLE = 2
        [255, 0, 255],
        [255, 0, 255],
        [255, 0, 255],
        [3, 1, 100],
        [5, 0, 5000]
    ],
    [	// let MODE_RAINBOW = 3
        [0, 0, 1000],
        [60, 0, 720]
    ],
    [	// let MODE_CAROUSEL = 4
        [0, 0, 1000],
        [400, 0, 5000]
    ],
    [	// let MODE_DROPLET = 5
        [0, 0, 1000],
        [35, 0, 1000],
        [255, 0, 255],
        [200, 0, 255],
        [255, 0, 255],
        [1, 0, 5000],
        [10, 0, 100]
    ],
    [	// let MODE_SINGLE_FLASH = 6
        [1, 0, 5000],
        [0, 0, 1000],
        [510, 0, 5000],
        [30, 0, 255],
        [100, 0, 255],
        [30, 0, 255],
        [1, 0, 100]
    ],
    [	// let MODE_SPOTLIGHTS = 7
        [8, 1, 200],
        [1, 0, 5000],
        [0, 0, 1000],
        [25, 0, 500]
    ],
    [	// let MODE_SEPARATED = 8
        [30, 0, 255],
        [100, 0, 255],
        [30, 0, 255],
        [5, 0, 200]
    ],
    [	// let MODE_ANIMATED_SEPARATED = 9
        [240, 0, 255],
        [230, 0, 255],
        [220, 0, 255],
        [1, 0, 200],
        [100, 0, 5000],
        [1, -1, 1]
    ]
]

let randomDelay = 0 // 0 means off, otherwise it means seconds
let RANDOM_MAX = 120 // seconds
let randomSwitchTimestamp = 0

let MODE_SNOWFLAKE = 0
let MODE_FADE_COLORS = 1
let MODE_SPARKLE = 2
let MODE_RAINBOW = 3
let MODE_CAROUSEL = 4
let MODE_DROPLET = 5
let MODE_SINGLE_FLASH = 6
let MODE_SPOTLIGHTS = 7
let MODE_SEPARATED = 8
let MODE_ANIMATED_SEPARATED = 9

let X_THRESHOLD = 100

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
    if (randomDelay > 0 && input.runningTime() - randomSwitchTimestamp > randomDelay * 1000
        && isScreenUp()) {
        // we switch to a random mode
        randomSwitchTimestamp = input.runningTime()
        //mode = Math.random(remoteModesNames.length)
        // making sure we change to a new mode by adding at least 1,
        // and max not enough to come back to the same mode.
        mode = (mode + 1 + Math.random(remoteModesNames.length - 2)) % remoteModesNames.length
        radio.sendValue("mode", mode)
        basic.showIcon(IconNames.Heart)
        radio.sendValue("mode", mode)
    }

    // if a is pressed down
    //  if upside down change mode
    //  else change var
    // if b is pressed change value
    showColorLeds()
    if (input.buttonIsPressed(Button.A)) {
        if (input.buttonIsPressed(Button.B)) {
            if (isLogoDown()) {
                radio.sendValue("mode", mode)
                basic.showString("m:" + mode, 80)
                basic.pause(500)
            } else {
                radio.sendValue(clip12(remoteModesNames[mode][remoteModeIndex]), remoteModesValues[mode][remoteModeIndex][0])
                //basic.showString(remoteModesNames[mode][remoteModeIndex] + "=", 80)
                //basic.showNumber(remoteModesValues[mode][remoteModeIndex][0], 80)
                basic.pause(500)
            }
        }
        else if (isLogoDown()) {
            if (input.acceleration(Dimension.X) < -1 * X_THRESHOLD) {
                mode = (mode + 1) % remoteModesNames.length
                radio.sendValue("mode", mode)
                remoteModeIndex = 0
                basic.clearScreen()
                plotLedAt(24 - mode)
                basic.pause(holdDelay)
                radio.sendValue("mode", mode)
            } else if (input.acceleration(Dimension.X) > X_THRESHOLD) {
                mode = (mode - 1 + remoteModesNames.length) % remoteModesNames.length
                radio.sendValue("mode", mode)
                remoteModeIndex = 0
                basic.clearScreen()
                plotLedAt(24 - mode)
                basic.pause(holdDelay)
                radio.sendValue("mode", mode)
            } else {
                basic.clearScreen()
                plotLedAt(24 - mode)
                basic.pause(holdDelay)
            }
        }
        else if (input.acceleration(Dimension.X) < -1 * X_THRESHOLD) {
            remoteModeIndex = (remoteModeIndex - 1 + remoteModesNames[mode].length) % remoteModesNames[mode].length
            //basic.showString(remoteModesNames[remoteModeIndex], 50)
            //whaleysans.showNumber(remoteModeIndex)
            basic.clearScreen()
            plotLedAt(remoteModeIndex)
            basic.pause(holdDelay)
            //holdDelay -= 10
        } else if (input.acceleration(Dimension.X) > X_THRESHOLD) {
            remoteModeIndex = (remoteModeIndex + 1) % remoteModesNames[mode].length
            //basic.showString(remoteModesNames[remoteModeIndex], 50)
            //whaleysans.showNumber(remoteModeIndex)
            basic.clearScreen()
            plotLedAt(remoteModeIndex)
            basic.pause(holdDelay)
            //holdDelay -= 10
        } else {
            basic.clearScreen()
            plotLedAt(remoteModeIndex)
            basic.pause(holdDelay)
            //basic.showString(remoteModesNames[mode][remoteModeIndex], 65)
        }

    } else if (input.buttonIsPressed(Button.B)) {
        if (isLogoDown()) {
            if (input.acceleration(Dimension.X) < -1 * X_THRESHOLD) {
                randomDelay = Math.min(randomDelay + 1, RANDOM_MAX)
                basic.clearScreen()
                if (randomDelay > 9) {
                    whaleysans.showNumber(randomDelay)
                } else {
                    basic.showNumber(randomDelay, 80)
                }
                basic.pause(holdDelay)
                holdDelay -= 10
            } else if (input.acceleration(Dimension.X) > X_THRESHOLD) {
                randomDelay = Math.max(randomDelay - 1, 0)
                basic.clearScreen()
                if (randomDelay > 9) {
                    whaleysans.showNumber(randomDelay)
                } else {
                    basic.showNumber(randomDelay, 80)
                }
                basic.pause(holdDelay)
                holdDelay -= 10
            } else {
                basic.clearScreen()
                if (randomDelay > 9 && randomDelay < 100) {
                    whaleysans.showNumber(randomDelay)
                } else {
                    basic.showNumber(randomDelay, 80)
                }
                holdDelay = HOLD_DELAY_MAX
                basic.pause(holdDelay)
            }
        } else if (input.acceleration(Dimension.X) < -1 * X_THRESHOLD) {
            remoteModesValues[mode][remoteModeIndex][0] = Math.max(remoteModesValues[mode][remoteModeIndex][0] - 1,
                remoteModesValues[mode][remoteModeIndex][1])
            basic.clearScreen()
            if (remoteModesValues[mode][remoteModeIndex][0] > 9) {
                whaleysans.showNumber(remoteModesValues[mode][remoteModeIndex][0])
            } else {
                basic.showNumber(remoteModesValues[mode][remoteModeIndex][0], 80)
            }
            basic.pause(holdDelay)
            holdDelay -= 20
        } else if (input.acceleration(Dimension.X) > X_THRESHOLD) {
            remoteModesValues[mode][remoteModeIndex][0] = Math.min(remoteModesValues[mode][remoteModeIndex][0] + 1,
                remoteModesValues[mode][remoteModeIndex][2])
            basic.clearScreen()
            if (remoteModesValues[mode][remoteModeIndex][0] > 9) {
                whaleysans.showNumber(remoteModesValues[mode][remoteModeIndex][0])
            } else {
                basic.showNumber(remoteModesValues[mode][remoteModeIndex][0], 80)
            }
            basic.pause(holdDelay)
            holdDelay -= 20
        } else {
            basic.clearScreen()
            if (remoteModesValues[mode][remoteModeIndex][0] > 9 && remoteModesValues[mode][remoteModeIndex][0] < 100) {
                whaleysans.showNumber(remoteModesValues[mode][remoteModeIndex][0])
            } else {
                basic.showNumber(remoteModesValues[mode][remoteModeIndex][0], 80)
            }
            radio.sendValue(clip12(remoteModesNames[mode][remoteModeIndex]), remoteModesValues[mode][remoteModeIndex][0])
            holdDelay = HOLD_DELAY_MAX
            basic.pause(holdDelay)
        }

    } else {    // no buttons pressed
        holdDelay = HOLD_DELAY_MAX
        if (isLogoDown()) {
            basic.clearScreen()
            plotLedAt(24 - mode)
            basic.pause(100)
        } else if (isLogoUp()) {
            basic.showString(remoteModesNames[mode][remoteModeIndex], 80)
        } else {
            if (remoteModesValues[mode][remoteModeIndex][0] < 100 && remoteModesValues[mode][remoteModeIndex][0] > 9) {
                whaleysans.showNumber(remoteModesValues[mode][remoteModeIndex][0])
            } else {
                basic.showNumber(remoteModesValues[mode][remoteModeIndex][0], 80)
            }
        }
    }


    /*
    if (input.buttonIsPressed(Button.A)) {
        if (isLogoUp()) {
            remoteModeIndex = (remoteModeIndex - 1 + remoteModesNames.length) % remoteModesNames.length
            basic.showString(remoteModesNames[remoteModeIndex], 80)
        } else {
            remoteModesValues[remoteModeIndex][0] = Math.max(remoteModesValues[remoteModeIndex][0] - 1,
                remoteModesValues[remoteModeIndex][1])
            whaleysans.showNumber(remoteModesValues[remoteModeIndex][0])
        }
        basic.pause(holdDelay)
        holdDelay -= 10
    } else if (input.buttonIsPressed(Button.B)) {
        if (isLogoUp()) {
            remoteModeIndex = (remoteModeIndex + 1) % remoteModesNames.length
            basic.showString(remoteModesNames[remoteModeIndex], 80)
        } else {
            remoteModesValues[remoteModeIndex][0] = Math.min(remoteModesValues[remoteModeIndex][0] + 1,
                remoteModesValues[remoteModeIndex][2])
            whaleysans.showNumber(remoteModesValues[remoteModeIndex][0])
        }
        basic.pause(holdDelay)
        holdDelay -= 10
    } else {
        holdDelay = HOLD_DELAY_MAX
        if (isLogoUp()) {
            basic.showString(remoteModesNames[remoteModeIndex], 80)
        } else {
            if (remoteModesValues[remoteModeIndex][0] < 100 && remoteModesValues[remoteModeIndex][0] > 9) {
                whaleysans.showNumber(remoteModesValues[remoteModeIndex][0])
            } else {
                basic.showNumber(remoteModesValues[remoteModeIndex][0], 80)
            }
        }
    }
    */
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
        }
        basic.pause(2)
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

