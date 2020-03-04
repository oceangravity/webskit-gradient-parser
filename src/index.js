module.exports.parse = function (gradient, toObject) {
  const valueInsideGradient = /.*gradient\s*\(((?:\([^)]*\)|[^)(]*)*)\)/
  const type = /((repeating-)?conic-gradient|(repeating-)?linear-gradient|(repeating-)?radial-gradient)/g
  const splitElements = /(?:[^)(,]+|\([^)(]+\))+/g
  let allElements = valueInsideGradient.exec(gradient)
  const webColorRegexp = /#[0-9a-fA-F]{3,6}|(rgb|rgba|hsl|hsla) ?\([ 0-9.%,]+?\)|([Aa]lice[Bb]lue|[Aa]ntique[Ww]hite|[Aa]qua(marine)?|[Aa]zure|[Bb]eige|[Bb]isque|[Bb]lack|[Bb]lanched[Aa]lmond|[Bb]lue([Vv]iolet)?|[Bb]rown|[Bb]urly[Ww]ood|[Cc]adet[Bb]lue|[Cc]hartreuse|[Cc]hocolate|[Cc]oral|[Cc]ornflower[Bb]lue|[Cc]ornsilk|[Cc]rimson|[Cc]yan|[Dd]ark([Bb]lue|[Cc]yan|[Gg]olden[Rr]od|[Gg]ray|[Gg]rey|[Gg]reen|[Kk]haki|[Mm]agenta|[Oo]live[Gg]reen|[Oo]range|[Oo]rchid|[Rr]ed|[Ss]almon|[Ss]ea[Gg]reen|[Ss]late[Bb]lue|[Ss]late[Gg]ray|[Ss]late[Gg]rey|[Tt]urquoise|[Vv]iolet)?|[Dd]eep([Pp]ink|[Ss]ky[Bb]lue)?|[Dd]im([Gg]ray|[Gg]rey)?|[Dd]odger[Bb]lue|[Ff]ire[Bb]rick|[Ff]loral[Ww]hite|[Ff]orest[Gg]reen|[Ff]uchsia|[Gg]ainsboro|[Gg]host[Ww]hite|[Gg]old(en[Rr]od)?|[Gg]ray|[Gg]rey|[Gg]reen([Yy]ellow)?|[Hh]oney[Dd]ew|[Hh]ot[Pp]ink|[Ii]ndian[Rr]ed|[Ii]ndigo|[Ii]vory|[Kk]haki|[Ll]avender([Bb]lush)?|[Ll]awn[Gg]reen|[Ll]emon[Cc]hiffon|[Ll]ight([Bb]lue|[Cc]oral|[Cc]yan|[Gg]olden[Rr]od[Yy]ellow|[Gg]ray|[Gg]rey|[Gg]reen|[Pp]ink|[Ss]almon|[Ss]ea[Gg]reen|[Ss]ky[Bb]lue|[Ss]late[Gg]ray|[Ss]late[Gg]rey|[Ss]teel[Bb]lue|[Yy]ellow)?|[Ll]ime([Gg]reen)?|[Ll]inen|[Mm]agenta|[Mm]aroon|[Mm]edium([Aa]qua[Mm]arine|[Bb]lue|[Oo]rchid|[Pp]urple|[Ss]ea[Gg]reen|[Ss]late[Bb]lue|[Ss]pring[Gg]reen|[Tt]urquoise|[Vv]iolet[Rr]ed)?|[Mm]idnight[Bb]lue|[Mm]int[Cc]ream|[Mm]isty[Rr]ose|[Mm]occasin|[Nn]avajo[Ww]hite|[Nn]avy|[Oo]ld[Ll]ace|[Oo]live([Dd]rab)?|[Oo]range([Rr]ed)?|[Oo]rchid|[Pp]ale[Gg]olden[Rr]od|[Pp]ale([Gg]reen|[Tt]urquoise|[Vv]iolet[Rr]ed)?|[Pp]apaya[Ww]hip|[Pp]each[Pp]uff|[Pp]eru|[Pp]ink|[Pp]lum|[Pp]owder[Bb]lue|[Pp]urple|[Rr]ebecca[Pp]urple|[Rr]ed|[Rr]osy[Bb]rown|[Rr]oyal[Bb]lue|[Ss]addle[Bb]rown|[Ss]almon|[Ss]andy[Bb]rown|[Ss]ea([Gg]reen|[Ss]hell)?|[Ss]ienna|[Ss]ilver|[Ss]ky[Bb]lue|[Ss]late([Bb]lue|[Gg]ray|[Gg]rey)?|[Ss]now|[Ss]pring[Gg]reen|[Ss]teel[Bb]lue|[Tt]an|[Tt]eal|[Tt]histle|[Tt]omato|[Tt]urquoise|[Vv]iolet|[Ww]heat|[Ww]hite([Ss]moke)?|[Yy]ellow([Gg]reen)?)/
  const stopValueRegexp = /((?:\d*\.)?\d+(px|%|em|deg|turn|rad|grad)?)/
  const webColor = new RegExp(webColorRegexp.source, 'g')
  const isValue = /(?:[+-]?\d*\.?\d+)(?:%|[a-z]+)?/g
  const stopValue = new RegExp(
        `(${webColorRegexp.source})|${stopValueRegexp.source}`,
        'g'
  )
  let positionValue = 'N/A'
  const degTurn = /(deg|turn|rad|grad)/g
  const toDirection = /(to (left( top| bottom)|right( top| bottom)|top( right| left)?|bottom( right| left)?)?)/g
  const shapeReg = /(ellipse|circle)/g
  const sizeReg = /(farthest-(corner|side)?|closest-(corner|side)?)/g
  const gradientType = gradient.match(type)[0]
  const isDeg = gradientType.includes('conic');
  allElements = allElements[1].match(splitElements)

  for (let i = 0; i < allElements.length; i++) {
    allElements[i] = allElements[i].trim()
  }

  const firstParameterIsColor = function () {
    return !!allElements[0].match(webColor)
  }

  const firstIsColor = firstParameterIsColor()

  if (!firstParameterIsColor()) {
    positionValue = allElements[0]
    allElements.shift()
  }

  const radToDeg = function (radians) {
    return radians * (180 / Math.PI)
  }

  const turnToDeg = function (turn) {
    return turn * 360
  }

  const gradToDeg = function (grads) {
    return (grads / 400) * 360
  }

  const valueToDeg = function (value) {
    if (value.match(/rad/)) {
      return radToDeg(parseFloat(value))
    } else if (value.match(/turn/)) {
      return turnToDeg(parseFloat(value))
    } else if (value.match(/grad/)) {
      return gradToDeg(parseFloat(value))
    } else {
      return value
    }
  }

  const getConicAngle = function (positionValue) {
    let value = 0
    if (positionValue.match(/from (.*?) at/)) {
      value = valueToDeg(positionValue.match(/from (.*?) at/)[1])
    } else if (positionValue.match(/from/)) {
      value = valueToDeg(positionValue.match(/from (.*)/)[1])
    }
    return value
  }

  const getPosition = function (positionValue) {
    let str = positionValue
    let values = null
    let x
    let y

    if (str.match(/(at)/g)) {
      str = str.slice(str.indexOf('at'), str.length)
      str = str.replace('at ', '')
      const splitted = str.split(' ')

      if (splitted.length === 4) {
        if (splitted[0] === 'left') {
          x = splitted[1]
        } else {
          x = `calc(100% - ${splitted[1]})`
        }

        if (splitted[2] === 'top') {
          y = splitted[3]
        } else {
          y = `calc(100% - ${splitted[3]})`
        }
      } else if (splitted.length === 1 || splitted.length === 2) {
        switch (str) {
          case 'center':
            x = '50%'
            y = '50%'
            break
          case 'right top':
          case 'top right':
            x = '100%'
            y = '0%'
            break
          case 'left top':
          case 'top left':
            x = '0%'
            y = '0%'
            break
          case 'right bottom':
          case 'bottom right':
            x = '100%'
            y = '100%'
            break
          case 'left bottom':
          case 'bottom left':
            x = '0%'
            y = '100%'
            break
          case 'top':
          case 'center top':
          case 'top center':
            x = '50%'
            y = '0%'
            break
          case 'left':
          case 'center left':
          case 'left center':
            x = '0%'
            y = '50%'
            break
          case 'right':
          case 'center right':
          case 'right center':
            x = '100%'
            y = '50%'
            break
          case 'bottom':
          case 'center bottom':
          case 'bottom center':
            x = '50%'
            y = '100%'
            break
          default:
            values = str.split(' ')
            x = values[0]
            y = values[1] || '50%'
            break
        }
      }
    } else {
      x = '50%'
      y = '50%'
    }

    return { x, y }
  }

  const stopPostfix = isDeg ? 'deg' : '%'
  const minValue = `0${stopPostfix}`
  const maxValue = isDeg ? '360deg' : '100%'
  let stops = []
  for (let i = 0; i < allElements.length; i++) {
    const stopElements = allElements[i].match(stopValue)
    const color = stopElements[0]
    const stop = stopElements[1]

    stops[i] =
            stop
              ? [
                color,
                isDeg ? `${valueToDeg(stop)}deg` : stop
              ]
              : [
                color,
                i === 0 ? minValue : (i === allElements.length - 1 ? maxValue : null)
              ]
  }

  // Get a list of consecutive missing tab stops,
  // e.g. `[[1,1],[3,5]]` from this gradient:
  // `linear-gradient(red 0%, blue, red 20%, blue, blue, blue, red 100%)`
  // where stops 1, 3, 4 and 5 are missing.
  const missingStops = []
  let found = false
  for (let i = 0; i < stops.length; i++) {
    const isMissing = !stops[i][1]
    if (isMissing && !found) {
      missingStops.push([i])
      found = true
    }
    if (!isMissing && found) {
      missingStops[missingStops.length - 1].push(i - 1)
      found = false
    }
  }

  // Generate values with proper postfix for missing stops
  for (let i = 0; i < missingStops.length; i++) {
    const start = missingStops[i][0]
    const end = missingStops[i][1]
    const preValue = parseFloat(stops[start - 1][1])
    const postValue = parseFloat(stops[end + 1][1])
    const length = (end - start) + 2
    const increment = (postValue - preValue) / length
    let value = preValue
    for (let j = 0; j < length; j++) {
      value += increment
      const printValue = +value.toFixed(2) // the `+` is necessary, converts back to number
      stops[start + j][1] = `${printValue}${stopPostfix}`
    }
  }

  const getShape = function (data) {
    const shape = data.match(shapeReg)
    if (shape) {
      return shape[0]
    } else {
      return 'ellipse'
    }
  }

  const getAngle = function (data) {
    let angle = 0

    if (!gradientType.match(/(repeating-)?linear-gradient/)) {
      return angle
    }

    const haveAngle = function () {
      return !!data.match(degTurn)
    }

    const getDirection = function () {
      const dir = data.match(toDirection)
      return dir && dir[0]
    }

    if (haveAngle()) {
      angle = parseInt(data, 10)
    } else {
      switch (getDirection()) {
        case 'to top':
          angle = 0
          break
        case 'to bottom':
          angle = 180
          break
        case 'to left':
          angle = 270
          break
        case 'to right':
          angle = 90
          break
        case 'to right top':
        case 'to top right':
          angle = 45
          break
        case 'to left top':
        case 'to top left':
          angle = 315
          break
        case 'to right bottom':
        case 'to bottom right':
          angle = 135
          break
        case 'to left bottom':
        case 'to bottom left':
          angle = 225
          break
        default:
          angle = 0
      }
    }
    return angle
  }

  const getSize = function (data) {
    if (!gradientType.match(/(repeating-)?radial-gradient/)) {
      return 'farthest-corner'
    }

    if (data.match(/(at)/g)) {
      data = data.split('at')[0]
      data = data.replace(/ellipse |circle /g, '')
      data = data.trim()

      if (data.match(/ /g)) {
        return data.split(' ')
      } else if (data.match(isValue)) {
        return data
      } else if (data.match(sizeReg)) {
        return data.match(sizeReg)[0]
      }
    } else {
      data = data.replace(/ellipse |circle /g, '')
      data = data.trim()

      if (data.match(/ /g)) {
        return data.split(' ')
      } else if (data.match(isValue)) {
        return data
      } else if (data.match(sizeReg)) {
        return data.match(sizeReg)[0]
      }
    }

    return 'farthest-corner'
  }

  const gradientObject = {
    type: gradientType,
    stops: stops,
    gradientDefinition: positionValue,
    firstParameterIsColor: firstIsColor,
    position: getPosition(positionValue),
    linearAngle: getAngle(positionValue),
    shape: getShape(positionValue),
    size: getSize(positionValue),
    conicAngle: getConicAngle(positionValue)
  }

  return toObject ? gradientObject : JSON.stringify(gradientObject, null, 2)
}
