let strip: neopixel.Strip = neopixel.create(DigitalPin.P0, 104, NeoPixelMode.RGB)
radio.setGroup(22)
let mode = 1
let NR_OF_MODES = 11
let MODE_OFF = 0
let MODE_SEPARATED = 1
let MODE_SNOWFLAKE = 2
let MODE_FADE_COLORS = 3
let MODE_SPARKLE = 4
let MODE_RAINBOW = 5
let MODE_CAROUSEL = 6
let MODE_DROPLET = 7
let MODE_SINGLE_FLASH = 8
let MODE_SPOTLIGHTS = 9
let MODE_ANIMATED_SEPARATED = 10
// separated lights mode
let separatedColor = [100, 100, 100]
let separatedSpace = 5
// snowflake mode vars
let snowflakeLength = 128
let snowflakeCounter = 0
let pos = 0
// fade mode vars
let tempColor = 0;
let fadeColorList = [[73,10,61], [189,21,80], [233,127,2], [248,202,0], [138,155,15]]
let currentColor = [0, 0, 0]
let targetColorIndex = 0
// sparkle mode vars
let sparkleArray = [0]
let sparkleColor = [255, 255, 255]
let sparkleDecay = 3
let sparkleDelay = 5
for (let i = 0; i < strip.length(); i++) {
    sparkleArray[i] = 0;
}
// rainbow mode vars
let rainbowCounter = 0
let rainbowRange = 60
// carousel mode vars
let carouselCounter = 0
let carouselColorList = [[0, 255, 255], [0, 128, 255], [0, 200, 100], [0, 128, 255]]
let carouselDelay = 400
// droplet mode vars
let dropletCounter = 0
let dropletPeriod = 35
let dropletColor = [255, 200, 255]
let dropletDelay = 1
let dropletDecay = 10
let dropletArray = [0]
let dropletArrayDisplay = [0]
for (let i = 0; i < strip.length(); i++) {
    dropletArray[i] = 0;
    dropletArrayDisplay[i] = 0;
}
// single flash vars
let singleFlashDelay = 1
let singleFlashCounter = 0
let singleFlashPeriod = 512
let singleFlashColor = [30, 100, 30]
let singleFlashStepsize = 5
// spotlight mode vars
let spotlightSize = 8
let spotlightColorList = [[255,0,60], [255,138,0], [250,190,40], [136,193,0], [0,193,118]]
let spotlightDelay = 1
let spotlightCounter = 0
let spotlightPeriod = 35
// animated separated lights mode
let aniSeparatedColor = [240, 230, 220]
let aniSeparatedSpace = 1
let aniSeparatedDelay = 100
let aniSeparatedDirection = 1

input.onButtonPressed(Button.A, () => {
    strip.clear()
    mode++
    mode %= NR_OF_MODES
})
input.onButtonPressed(Button.AB, () => {
    basic.showNumber(mode)
    basic.pause(1000)
    basic.clearScreen()
})
input.onButtonPressed(Button.B, () => {
    strip.clear()
    mode--
    mode = (mode + NR_OF_MODES) % NR_OF_MODES
})
radio.onDataPacketReceived(({ receivedString: name, receivedNumber: value }) => {
    if (name == clip12("mode")) {
        mode = value
    } else if (name == clip12("snowflakeLength")) {
        snowflakeLength = value
    } else if (name == clip12("snowflakeCounter")) {
        snowflakeCounter = value
    } else if (name == clip12("tempColor")) {
        tempColor = value
    } else if (name == clip12("currentColor-r")) {
        currentColor[0] = value
    } else if (name == clip12("currentColor-g")) {
        currentColor[1] = value
    } else if (name == clip12("currentColor-b")) {
        currentColor[2] = value
    } else if (name == clip12("targetColorIndex")) {
        targetColorIndex = value
    } else if (name == clip12("sparkleColor-r")) {
        sparkleColor[0] = value
    } else if (name == clip12("sparkleColor-g")) {
        sparkleColor[1] = value
    } else if (name == clip12("sparkleColor-b")) {
        sparkleColor[2] = value
    } else if (name == clip12("sparkleDecay")) {
        sparkleDecay = value
    } else if (name == clip12("sparkleDelay")) {
        sparkleDelay = value
    } else if (name == clip12("rainbowCounter")) {
        rainbowCounter = value
    } else if (name == clip12("rainbowRange")) {
        rainbowRange = value
    } else if (name == clip12("carouselCounter")) {
        carouselCounter = value
    } else if (name == clip12("carouselDelay")) {
        carouselDelay = value
    } else if (name == clip12("dropletCounter")) {
        dropletCounter = value
    } else if (name == clip12("dropletPeriod")) {
        dropletPeriod = value
    } else if (name == clip12("dropletColor-r")) {
        dropletColor[0] = value
    } else if (name == clip12("dropletColor-g")) {
        dropletColor[1] = value
    } else if (name == clip12("dropletColor-b")) {
        dropletColor[2] = value
    } else if (name == clip12("dropletDelay")) {
        dropletDelay = value
    } else if (name == clip12("dropletDecay")) {
        dropletDecay = value
    } else if (name == clip12("singleFlashDelay")) {
        singleFlashDelay = value
    } else if (name == clip12("singleFlashCounter")) {
        singleFlashCounter = value
    } else if (name == clip12("singleFlashPeriod")) {
        singleFlashPeriod = value
    } else if (name == clip12("singleFlashColor-r")) {
        singleFlashColor[0] = value
    } else if (name == clip12("singleFlashColor-g")) {
        singleFlashColor[1] = value
    } else if (name == clip12("singleFlashColor-b")) {
        singleFlashColor[2] = value
    } else if (name == clip12("singleFlashStepsize")) {
        singleFlashStepsize = value
    } else if (name == clip12("spotlightSize")) {
        spotlightSize = value
    } else if (name == clip12("spotlightDelay")) {
        spotlightDelay = value
    } else if (name == clip12("spotlightCounter")) {
        spotlightCounter = value
    } else if (name == clip12("spotlightPeriod")) {
        spotlightPeriod = value
    } else if (name == clip12("separatedColor-r")) {
        separatedColor[0] = value
    } else if (name == clip12("separatedColor-g")) {
        separatedColor[1] = value
    } else if (name == clip12("separatedColor-b")) {
        separatedColor[2] = value
    } else if (name == clip12("separatedSpace")) {
        separatedSpace = value
    } else if (name == clip12("aniSeparatedColor-r")) {
        aniSeparatedColor[0] = value
    } else if (name == clip12("aniSeparatedColor-g")) {
        aniSeparatedColor[1] = value
    } else if (name == clip12("aniSeparatedColor-b")) {
        aniSeparatedColor[2] = value
    } else if (name == clip12("aniSeparatedSpace")) {
        aniSeparatedSpace = value
    } else if (name == clip12("aniSeparatedDelay")) {
        aniSeparatedDelay = value
    } else if (name == clip12("aniSeparatedDirection")) {
        aniSeparatedDirection = value
    } else {
        basic.showString("Unknown:" + name)
    }

    /*
let pos = 0
// fade mode vars
let fadeColorList = [[100, 0, 0], [50, 50, 50], [50, 0, 0], [255, 128, 128]]
// sparkle mode vars
let sparkleArray = [0]
for (let i = 0; i < strip.length(); i++) {
    sparkleArray[i] = 0;
}
// carousel mode vars
let carouselColorList = [[0, 255, 255], [0, 128, 255], [0, 200, 100], [0, 128, 255]]
// droplet mode vars
let dropletArray = [0]
let dropletArrayDisplay = [0]
for (let i = 0; i < strip.length(); i++) {
    dropletArray[i] = 0;
    dropletArrayDisplay[i] = 0;
}
// spotlight mode vars
let spotlightColorList = [[100, 100, 100], [15, 50, 15], [75, 50, 75], [30, 100, 30]]
    */
})
while (true) {
    if (mode == MODE_OFF) {
        strip.clear()
        strip.show()
        basic.pause(2)
    } else if (mode == MODE_SNOWFLAKE) {
        strip.clear()
        pos = snowflakeCounter
        if (snowflakeCounter > strip.length() + snowflakeLength) {
            pos = strip.length() - (snowflakeCounter - strip.length() - snowflakeLength)
        }
        for (let i = 0; i < snowflakeLength; i++) {
            tempColor = 255 - i * 2
            if (snowflakeCounter > strip.length() + snowflakeLength) {
                strip.setPixelColor(pos + i,
                    neopixel.rgb(tempColor, tempColor, tempColor))
            }
            else {
                strip.setPixelColor(pos - i,
                    neopixel.rgb(tempColor, tempColor, tempColor))
            }
        }
        strip.show()

        snowflakeCounter++
        snowflakeCounter %= strip.length() * 2 + snowflakeLength * 2
        basic.pause(2)
    } else if (mode == MODE_FADE_COLORS) {
        let reachedTarget = true
        for (let i = 0; i < 3; i++) {
            if (currentColor[i] < fadeColorList[targetColorIndex][i]) {
                reachedTarget = false
                currentColor[i]++
            }
            if (currentColor[i] > fadeColorList[targetColorIndex][i]) {
                reachedTarget = false
                currentColor[i]--
            }
        }
        strip.showColor(neopixel.rgb(currentColor[0], currentColor[1], currentColor[2]))
        if (reachedTarget) {
            targetColorIndex++
            targetColorIndex %= fadeColorList.length()
        }
        basic.pause(2)
    } else if (mode == MODE_SPARKLE) {
        for (let i = 0; i < strip.length(); i++) {
            // lower every pixel
            sparkleArray[i] = Math.max(0, sparkleArray[i] - sparkleDecay)
        }
        sparkleArray[Math.random(strip.length())] = 255
        for (let i = 0; i < strip.length(); i++) {
            let sparkleR = sparkleArray[i] * sparkleColor[0] / 255
            let sparkleG = sparkleArray[i] * sparkleColor[1] / 255
            let sparkleB = sparkleArray[i] * sparkleColor[2] / 255
            strip.setPixelColor(i,
                neopixel.rgb(sparkleArray[i] * sparkleColor[0] / 255,
                    sparkleArray[i] * sparkleColor[1] / 255,
                    sparkleArray[i] * sparkleColor[2] / 255))
            //strip.setPixelColor(i,
            //   neopixel.rgb(sparkleR, sparkleG, sparkleB))
        }
        strip.show()
        basic.pause(sparkleDelay)
    } else if (mode == MODE_RAINBOW) {
        strip.showRainbow(rainbowCounter, rainbowCounter + rainbowRange)
        rainbowCounter++
        rainbowCounter %= 360
        basic.pause(2)
    } else if (mode == MODE_CAROUSEL) {
        strip.clear()
        for (let i = 0; i < strip.length(); i++) {
            if (i % carouselColorList.length == carouselCounter) {
                strip.setPixelColor(i,
                    neopixel.rgb(carouselColorList[carouselCounter][0],
                        carouselColorList[carouselCounter][1],
                        carouselColorList[carouselCounter][2]))
            }
        }
        strip.show()
        carouselCounter = (carouselCounter + 1) % carouselColorList.length
        basic.pause(carouselDelay)
    } else if (mode == MODE_DROPLET) {
        if (dropletCounter == 0) {
            let i = Math.random(strip.length())
            dropletArray[i] = Math.max(1, dropletArray[i])
        }
        for (let i = 0; i < strip.length(); i++) {

            if (dropletArray[i] > strip.length()) {
                dropletArray[i] = 0
            }
            if (dropletArray[i] > 0) {
                dropletArray[i] = dropletArray[i] + 1
                for (let j = 0; j < dropletArray[i]; j++) {
                    dropletArrayDisplay[i - j] = Math.min(255, dropletArrayDisplay[i - j] + Math.max(0, (255 - (dropletArray[i] - j) * dropletDecay)))
                    dropletArrayDisplay[i + j] = Math.min(255, dropletArrayDisplay[i + j] + Math.max(0, (255 - (dropletArray[i] - j) * dropletDecay)))
                }
            }
        }

        for (let i = 0; i < strip.length(); i++) {
            strip.setPixelColor(i, neopixel.rgb(dropletArrayDisplay[i] * dropletColor[0] / 255,
                dropletArrayDisplay[i] * dropletColor[1] / 255,
                dropletArrayDisplay[i] * dropletColor[2] / 255))
            dropletArrayDisplay[i] = 0
        }
        strip.show()
        dropletCounter = (dropletCounter + 1) % dropletPeriod
        basic.pause(dropletDelay)
    } else if (mode == MODE_SINGLE_FLASH) {
        // 512 - 255 = 255
        let singleFlashBrightness = Math.abs(singleFlashCounter - singleFlashPeriod / 2)
        strip.showColor(neopixel.rgb(singleFlashColor[0] * singleFlashBrightness / 255,
            singleFlashColor[1] * singleFlashBrightness / 255,
            singleFlashColor[2] * singleFlashBrightness / 255))
        singleFlashCounter = (singleFlashCounter + singleFlashStepsize) % singleFlashPeriod
        basic.pause(singleFlashDelay)
    } else if (mode == MODE_SPOTLIGHTS) {
        strip.clear()
        for (let i = 0; i < strip.length(); i++) {
            let spotlightColorIndex = ((i / spotlightSize) % spotlightColorList.length)
            let spotlightColor = spotlightColorList[spotlightColorIndex]

            let spotlightBrightness = (spotlightPeriod - spotlightCounter + spotlightColorIndex * (spotlightPeriod / spotlightColorList.length)) % spotlightPeriod
            //let spotlightBrightness = spotlightPeriod - spotlightCounter
            spotlightBrightness = spotlightBrightness * 255 / spotlightPeriod
            strip.setPixelColor(i, neopixel.rgb(spotlightBrightness * spotlightColor[0] / 255,
                spotlightBrightness * spotlightColor[1] / 255,
                spotlightBrightness * spotlightColor[2] / 255))

        }

        strip.show()
        spotlightCounter = (spotlightCounter + 1) % spotlightPeriod
        basic.pause(spotlightDelay)
    } else if (mode == MODE_SEPARATED) {
        for (let i = 0; i < strip.length(); i++) {
            if (i % separatedSpace == 0) {
                strip.setPixelColor(i, neopixel.rgb(separatedColor[0],
                    separatedColor[1],
                    separatedColor[2]))
            }
            else {
                strip.setPixelColor(i, neopixel.rgb(0, 0, 0))
            }
        }
        strip.show()
        basic.pause(2)
    } else if (mode == MODE_ANIMATED_SEPARATED) {
        for (let i = 0; i < strip.length(); i++) {
            if (i % aniSeparatedSpace == 0) {
                strip.setPixelColor(i, neopixel.rgb(aniSeparatedColor[0],
                    aniSeparatedColor[1],
                    aniSeparatedColor[2]))
            }
            else if (i % aniSeparatedSpace == 1) {
                strip.setPixelColor(i, neopixel.rgb(aniSeparatedColor[0] * 2 / 3,
                    aniSeparatedColor[1] * 2 / 3,
                    aniSeparatedColor[2] * 2 / 3))
            }
            else if (i % aniSeparatedSpace == 2) {
                strip.setPixelColor(i, neopixel.rgb(aniSeparatedColor[0] * 1 / 3,
                    aniSeparatedColor[1] * 1 / 3,
                    aniSeparatedColor[2] * 1 / 3))
            }
            else {
                strip.setPixelColor(i, neopixel.rgb(0, 0, 0))
            }
        }
        strip.show()
        if (aniSeparatedDirection == 1) {
            aniSeparatedSpace++
            if (aniSeparatedSpace >= strip.length() / 4) {
                aniSeparatedDirection *= -1
            }
        } else {
            aniSeparatedSpace--
            if (aniSeparatedSpace <= 1) {
                aniSeparatedDirection *= -1
            }
        }
        basic.pause(aniSeparatedDelay)
    }

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
