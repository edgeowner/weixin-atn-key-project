import {
    QRCodeTool,
    QRErrorCorrectLevel
  } from './QRCodeTool'
  
  // support Chinese
  function utf16to8 (str) {
    var out, i, len, c
    out = ''
    len = str.length
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i)
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      }
    }
    return out
  }
  
  function drawQrcode (options) {
    options = options || {}
    options = Object.assign({
      width: 256,
      height: 256,
      typeNumber: -1,
      correctLevel: QRErrorCorrectLevel.H,
      background: '#ffffff',
      foreground: '#000000'
    }, options)
  
    if (!options.canvasId) {
      console.warn('please you set canvasId!')
      return
    }
  
    createCanvas()
  
    function createCanvas () {
      // create the qrcode itself
      var qrcode = new QRCodeTool(options.typeNumber, options.correctLevel)
      qrcode.addData(utf16to8(options.text))
      qrcode.make()
  
      // get canvas context
      var ctx = options._this ? wx.createCanvasContext && wx.createCanvasContext(options.canvasId, options._this) : wx.createCanvasContext && wx.createCanvasContext(options.canvasId)
  
      // compute tileW/tileH based on options.width/options.height
      var tileW = options.width / qrcode.getModuleCount()
      var tileH = options.height / qrcode.getModuleCount()
  
      // draw in the canvas
      for (var row = 0; row < qrcode.getModuleCount(); row++) {
        for (var col = 0; col < qrcode.getModuleCount(); col++) {
          var style = qrcode.isDark(row, col) ? options.foreground : options.background
          ctx.setFillStyle(style)
          var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW))
          var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW))
          ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h)
        }
      }
  
      ctx.draw(false, function (e) {
        options.callback && options.callback(e)
      })
    }
  }
  
  export default drawQrcode
  