Array.prototype.contains = function(obj) { //eslint-disable-line no-extend-native
  let i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};
const fsn = require("fs-nextra");
const restify = require("restify");
const colorThief = new (require("color-thief"))();
const config = require("../config.json");
const server = restify.createServer({name: "FratikB0T API", url: config.ip});
server.use(restify.plugins.queryParser());
const snek = require("snekfetch");
const { Canvas } = require("canvas-constructor");
const bfs = require("buffer-image-size");
const Jimp = require("jimp");

const plates = {
  startouch: null,
  starcatch: null,
  starcatchExtended: null,
  hug: null,
  tapeta: null,
  rip: null,
  sleep: null,
  wanted: null,
  wave: null,
  roksana: null,
  debilizm: null,
  god: null,
  chain: null,
  eat: null
};

const cache = new Map();

function authorize(req, res, next) {
  if (req.headers.authorization === config.tokens.owner) {
    req.params.tokenType = "owner";
    next();
  } else {
    if (config.tokens.rest.contains(req.headers.authorization)) {
      req.params.tokenType = "access";
      next();
    } else res.send(403, {success: false, error: {code: 403, body: "Forbidden"}});
  }
}

server.on("NotFound", function(req, res) {
  return res.send(404, {success: false, error: {code: 404, body: "Not Found"}});
});

server.get("/api", function(req, res) {
  res.send(200, {success: true, response: null});
});

/**
 * @api {get} api/checkToken Sprawdza token
 * @apiName checkToken
 * @apiDescription Używane do sprawdzenia prawidłowości tokenów
 * @apiGroup Token
 * @apiVersion 1.0.1
 * @apiHeader {string} authorization token
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {Object} response Informacja o tokenie
 * @apiSuccess {String} response.type Typ tokenu
 * @apiSuccess {Boolean} response.valid Prawidłowość tokenu
 * @apiError {Boolean} success Czy zapytanie się udało
 * @apiError {Object} response Odpowiedź
 * @apiError {Boolean} response.valid Prawidłowość tokenu
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "response": {
 *         "valid": true,
 *         "type": "owner"
 *       }
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "response": {
 *         "valid": false
 *       }
 *     }
 */
server.get("/api/token/checkToken", function(req, res) {
  if (req.headers.authorization === config.tokens.owner) {
    req.params.tokenType = "owner";
    return res.send({success: true, response: {type: req.params.tokenType, valid: true}});
  } else {
    if (config.tokens.rest.contains(req.headers.authorization)) {
      req.params.tokenType = "accesss";
      return res.send({success: true, response: {type: req.params.tokenType, valid: true}});
    } else return res.send({success: true, response: {valid: false}});
  }
});

/**
 * @api {get} api/image/startouch Startouch
 * @apiName startouch
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Generuje zdjęcie Star zachwycającej się czyimś zdjęciem
 * @apiParam {String} avatarURL Link do awataru
 * @apiVersion 1.0.4
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "error": {
 *         "code": 404,
 *         "body": "Not Found",
 *         "description": "Nie znaleziono tematu"
 *       }
 *     }
 */
server.get("/api/image/startouch", authorize, async function(req, res) {
  if (!plates.startouch) plates.startouch = await fsn.readFile("./assets/images/image_crush.png");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  if (cache.has("startouch" + req.query.avatarURL.replace(/\.gif/g, ".png"))) return res.send({success: true, image: cache.get("startouch" + req.query.avatarURL.replace(/\.gif/g, ".png"))});
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  const image = new Canvas(960, 624)
    .setColor("#ede8d5")
    .addRect(0, 0, 960, 624)
    .save()
    .rotate(16.87 * Math.PI / 180)
    // .addImage(body, 470, -56, 600, 600)
    .addImage(body, 470, -56, 530, 565)
    .restore()
    .addImage(plates.startouch, 0, 0, 960, 624)
    .toBuffer();
  cache.set("startouch" + req.query.avatarURL.replace(/\.gif/g, ".png"), image);
  return res.send({success: true, image});
});

/**
 * @api {get} api/image/starcatch Starcatch
 * @apiName Starcatch
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Wyskocz z okna po zdjęcie!
 * @apiParam {String} avatarURL Link do awataru
 * @apiParam {String} [cutMode=uncut] Tryb przyciecia
 * @apiParam {Boolean} [extended=false] Dodatkowy panel
 * @apiVersion 1.0.4
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "error": {
 *         "code": 404,
 *         "body": "Not Found",
 *         "description": "Nie znaleziono tematu"
 *       }
 *     }
 */
server.get("/api/image/starcatch", authorize, async function(req, res) {
  if (!plates.starcatch) plates.starcatch = await fsn.readFile("./assets/images/image_catch.png");
  if (!plates.starcatchExtended) plates.starcatchExtended = await fsn.readFile("./assets/images/plate_catch_extended.png");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  req.query.extended = req.query.extended ? req.query.extended === "true" ? true : req.query.extended === "false" ? false : req.query.extended : undefined;
  if (!([true, false].some(e => req.query.extended === e)) && req.query.extended !== undefined) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Extended musi być true/false"}});
  if (!(["cut", "uncut"].some(e => req.query.cutMode === e)) && req.query.cutMode !== undefined) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "CutMode musi być cut/uncut"}});
  if (cache.has("starcatch" + req.query.extended + req.query.cutMode + req.query.avatarURL.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("starcatch" + req.query.extended + req.query.cutMode + req.query.avatarURL.replace(/\.gif/g, ".png"))});
  }
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  let canva;
  if (req.query.extended === true || req.query.extended === "true") canva = new Canvas(960, 1517);
  else canva = new Canvas(960, 1011);
  canva.setColor("#e5ead3")
    .addRect(0, 0, 960, 1011)
    .save()
    .rotate(-13.02 * Math.PI / 180);
  if (req.query.cutMode === "uncut") canva.addImage(body, 131, 660, 364, 282);
  else canva.addImage(body, 131, 600, 362, 362);
  canva.restore()
    .addImage(plates.starcatch, 0, 0, 960, 1011);
  if (req.query.extended) canva.addImage(plates.starcatchExtended, 0, 1011, 960, 506);
  const image = canva.toBuffer();

  cache.set("starcatch" + req.query.extended + req.query.cutMode + req.query.avatarURL.replace(/\.gif/g, ".png"), image);
  return res.send({success: true, image});
});

/**
 * @api {get} api/image/tapeta Tapeta
 * @apiName Tapeta
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Ustawia tapetę
 * @apiParam {String} imageURL Link do zdjęcia
 * @apiVersion 1.0.4
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "success": false,
 *       "error": {
 *         "code": 400,
 *         "body": "Bad Request",
 *         "description": "Nie udało się pobrać obrazu"
 *       }
 *     }
 */
server.get("/api/image/tapeta", authorize, async function(req, res) {
  if (!plates.tapeta) plates.tapeta = await fsn.readFile("./assets/images/image_pulpit.png");
  if (!req.query.imageURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do obrazu"}});
  if (cache.has("tapeta" + req.query.imageURL)) return res.send({success: true, image: cache.get("tapeta" + req.query.imageURL)});
  let body;
  try {
    body = await snek.get(req.query.imageURL).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać obrazu"}});
  }
  const image = new Canvas(1920, 1080)
    .addImage(body, 0, 0, 1920, 1080)
    .addImage(plates.tapeta, 0, 0, 1920, 1080)
    .toBuffer();
  cache.set("tapeta" + req.query.imageURL, image);
  return res.send({success: true, image});
});

/**
 * @api {get} api/image/hug Hug
 * @apiName Hug
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Przytul kogoś
 * @apiVersion 1.0.5
 * @apiParam {String} avatarURL Link do awataru pierwszej osoby
 * @apiParam {String} avatarURLdwa Link do awataru drugiej osoby
 * @apiParam {String} [plate=2] Numer podstawy, 1: 2 postacie rysunkowe; 2: dwójka przytulających się osób
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "error": {
 *         "code": 404,
 *         "body": "Not Found",
 *         "description": "Nie znaleziono tematu"
 *       }
 *     }
 */
server.get("/api/image/hug", authorize, async function(req, res) {
  if (!plates.hug) plates.hug = await fsn.readFile("./assets/images/image_hug.jpg");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru (1)"}});
  if (!req.query.avatarURL2) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru (2)"}});
  if (cache.has("hug" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.avatarURL2.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("hug" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.avatarURL2.replace(/\.gif/g, ".png"))});
  }
  let body;
  let body2;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
    body2 = await snek.get(req.query.avatarURL2.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru/awatarów"}});
  }
  const image = new Canvas(1024, 768)
    .addImage(plates.hug, 0, 0, 1024, 768)
    .save()
    .addImage(body, 240, -100, 380, 380, {type: "round", radius: 380 / 2})
    .restore()
    .save()
    .addImage(body2, 600, 40, 400, 400, {type: "round", radius: 400 / 2})
    .restore()
    .toBuffer();
  cache.set("hug" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.avatarURL2.replace(/\.gif/g, ".png"), image);
  return res.send({success: true, image});
});

/**
 * @api {get} api/image/blurple Blurple
 * @apiName Blurple
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Koloryzuje podane zdjęcia na blurple
 * @apiVersion 1.0.6
 * @apiParam {String} avatarURL Link do awataru
 * @apiParam {Boolean} [reverse=false] Odwrócenie kolorów: zmienia schemat kolorów z biało-blurple na blurple-biało (bez classic (patrz niżej) usuwa kolor biały, czyli "dark mode")
 * @apiParam {Boolean} [classic=false] Tryb klasyczny: stary algorytm, nie używa dark blurple (#4E5D94)
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 */
server.get("/api/image/blurple", authorize, async function(req, res) {
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  if (cache.has("blurple" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.reverse + req.query.classic)) {
    return res.send({success: true, image: cache.get("blurple" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.reverse + req.query.classic)});
  }
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  let reverse = req.query.reverse === "true";
  let classic = req.query.classic === "true";
  try {
    let img;
    if (classic) img = await Jimp.read(body).then(j => j.colorType(0).contrast(1).getBufferAsync(Jimp.MIME_PNG).then(b => Jimp.read(b).then((j) => j.contrast(1).colorType(6).getBufferAsync(Jimp.MIME_PNG))));
    else img = await Jimp.read(body).then(j => j.colorType(0).contrast(1).getBufferAsync(Jimp.MIME_PNG).then(b => Jimp.read(b).then((j) => j.contrast(0.7).colorType(6).getBufferAsync(Jimp.MIME_PNG))));
    const canvas = new Canvas(bfs(img).width, bfs(img).height);
    canvas.addImage(img, 0, 0, bfs(img).width, bfs(img).height);
    const imData = canvas.getImageData();
    for (let i = 0; i < imData.data.length; i += 4) {
      let r = imData.data[i];
      let g = imData.data[i + 1];
      let b = imData.data[i + 2];
      if (!reverse) {
        if (classic) {
          if (r === 255 && g === 255 && b === 255) continue;
          r = 114;
          g = 137;
          b = 218;
        } else {
          if (r === 255 && g === 255 && b === 255) continue;
          if (255 - r >= 5 && 255 - g >= 5 && 255 - b >= 5) { r = 78; g = 93; b = 148; } else { r = 114; g = 137; b = 218; }
        }
      } else {
        if (classic) {
          if (!(r === 255 && g === 255 && b === 255)) {
            r = 255;
            g = 255;
            b = 255;
          } else {
            r = 114;
            g = 137;
            b = 218;
          }
        } else {
          if (255 - r >= 5 && 255 - g >= 5 && 255 - b >= 5) { r = 78; g = 93; b = 148; } else { r = 114; g = 137; b = 218; }
        }
      }
      imData.data[i] = r;
      imData.data[i + 1] = g;
      imData.data[i + 2] = b;
    }
    canvas.putImageData(imData, 0, 0);
    const buff = await canvas.toBufferAsync();
    cache.set("blurple" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.reverse + req.query.classic, buff);
    return res.send({success: true, image: buff});
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
});

/**
 * @api {get} api/image/rip Rip
 * @apiName Rip
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Wkleja czyjeś zdjęcie na grób
 * @apiVersion 1.0.5
 * @apiParam {String} avatarURL Link do awataru
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 */
server.get("/api/image/rip", authorize, async function(req, res) {
  if (!plates.rip) plates.rip = await fsn.readFile("./assets/images/plate_grave.png");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  if (cache.has("rip" + req.query.avatarURL.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("rip" + req.query.avatarURL.replace(/\.gif/g, ".png"))});
  }
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  try {
    const resp = new Canvas(284, 458)
      .setColor("#000000")
      .addRect(0, 0, 284, 458)
      .addImage(plates.rip, 0, 0, 284, 458)
      .addImage(body, 76, 180, 145, 145)
      .toBuffer();
    cache.set("rip" + req.query.avatarURL.replace(/\.gif/g, ".png"), resp);
    return res.send({success: true, image: resp});
  } catch (err) {
    return res.send(500, {success: false, error: {code: 500, body: "Internal Server Error", description: "Nie udało się wygenerować zdjęcia"}});
  }
});

/**
 * @api {get} api/image/sleep Sleep
 * @apiName Sleep
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Wkleja czyjeś zdjęcie do łóżka
 * @apiVersion 1.0.6
 * @apiParam {String} avatarURL Link do awataru
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 */
server.get("/api/image/sleep", authorize, async function(req, res) {
  if (!plates.sleep) plates.sleep = await fsn.readFile("./assets/images/image_sleeping.jpg");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  if (cache.has("sleep" + req.query.avatarURL.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("sleep" + req.query.avatarURL.replace(/\.gif/g, ".png"))});
  }
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  try {
    const resp = new Canvas(550, 367)
      .addImage(plates.sleep, 0, 0, 550, 367)
      .addImage(body, 225, 75, 100, 100, {radius: 50, type: "round"})
      .toBuffer();
    cache.set("sleep" + req.query.avatarURL.replace(/\.gif/g, ".png"), resp);
    return res.send({success: true, image: resp});
  } catch (err) {
    return res.send(500, {success: false, error: {code: 500, body: "Internal Server Error", description: "Nie udało się wygenerować zdjęcia"}});
  }
});

/**
 * @api {get} api/image/wanted Wanted
 * @apiName Wanted
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Wkleja czyjeś zdjęcie na plakat poszukiwanego
 * @apiVersion 1.0.6
 * @apiParam {String} avatarURL Link do awataru
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 */
server.get("/api/image/wanted", authorize, async function(req, res) {
  if (!plates.wanted) plates.wanted = await fsn.readFile("./assets/images/plate_wanted.jpg");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  if (cache.has("wanted" + req.query.avatarURL.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("wanted" + req.query.avatarURL.replace(/\.gif/g, ".png"))});
  }
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  try {
    const resp = new Canvas(400, 562)
      .setColor("#000000")
      .addRect(0, 0, 400, 562)
      .addImage(plates.wanted, 0, 0, 400, 562)
      .addImage(body, 86, 178, 228, 228)
      .toBuffer();
    cache.set("wanted" + req.query.avatarURL.replace(/\.gif/g, ".png"), resp);
    return res.send({success: true, image: resp});
  } catch (err) {
    return res.send(500, {success: false, error: {code: 500, body: "Internal Server Error", description: "Nie udało się wygenerować zdjęcia"}});
  }
});

/**
 * @api {get} api/image/wave Wave
 * @apiName Wave
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Pomachaj komuś
 * @apiVersion 1.0.6
 * @apiParam {String} avatarURL Link do awataru pierwszej osoby
 * @apiParam {String} avatarURLdwa Link do awataru drugiej osoby
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "error": {
 *         "code": 404,
 *         "body": "Not Found",
 *         "description": "Nie znaleziono tematu"
 *       }
 *     }
 */
server.get("/api/image/wave", authorize, async function(req, res) {
  if (!plates.wave) plates.wave = await fsn.readFile("./assets/images/image_wave.jpg");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru (1)"}});
  if (!req.query.avatarURL2) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru (2)"}});
  if (cache.has("wave" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.avatarURL2.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("wave" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.avatarURL2.replace(/\.gif/g, ".png"))});
  }
  let body;
  let body2;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
    body2 = await snek.get(req.query.avatarURL2.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru/awatarów"}});
  }
  const image = new Canvas(825, 480)
    .addImage(plates.wave, 0, 0, 825, 480)
    .addImage(body, 105, 30, 150, 150, {radius: 75, type: "round"})
    .restore()
    .addImage(body2, 514, 152, 100, 100, {radius: 50, type: "round"})
    .restore()
    .toBuffer();
  cache.set("wave" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.avatarURL2.replace(/\.gif/g, ".png"), image);
  return res.send({success: true, image});
});

/**
 * @api {get} api/image/primColor Primary Color
 * @apiName Primary Color
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Przewodzący kolor
 * @apiParam {String} imageURL Link do zdjęcia
 * @apiVersion 1.0.5
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {Number[]} color Kolor w RGB
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} eror.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "color": [114, 137, 218]
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "success": false,
 *       "error": {
 *         "code": 400,
 *         "body": "Bad Request",
 *         "description": "Brak linka do zdjęcia"
 *       }
 *     }
 */
server.get("/api/image/primColor", authorize, async function(req, res) {
  if (!req.query.imageURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do zdjęcia"}});
  if (cache.has("primColor" + req.query.imageURL)) {
    return res.send({success: true, color: cache.get("primColor" + req.query.imageURL)});
  }
  let body;
  try {
    body = await snek.get(req.query.imageURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać zdjęcia"}});
  }
  const arr = colorThief.getColor(body);
  cache.set("primColor" + req.query.imageURL, arr);
  return res.send({success: true, color: arr});
});

/**
 * @api {get} api/polacz Połącz
 * @apiName połącz
 * @apiDescription Łączy x zdjęć zestawiając je obok siebie.
 * @apiGroup Grafika
 * @apiHeader {string} authorization token
 * @apiParam {string[]} zdjecie[] Wszystkie zdjęcia do połączenia
 * @apiVersion 1.0.5
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {Object} image Zdjecie
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Samo zdjęcie
 * @apiError {Boolean} success Czy zapytanie się udało
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Numer błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, czyli co poszło nie tak.
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *          "type": "Buffer",
 *          "data": [...]
 *        }
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "success": false,
 *       "error": {
 *         "code": 500,
 *         "body": "Internal Server Error",
 *         "description": "Nie udało się stworzyć zdjęcia"
 *       }
 *     }
 */
server.get("/api/polacz", authorize, async function(req, res) {
  if (!req.query.zdjecie || req.query.zdjecie.length === 0) return res.send(400, {success: false, error: 400, body: "Bad Request", description: "Nie podano żadnych zdjęć"});
  const zdjecia = [];
  const dims = { width: 0, height: 0 };
  function a(body) {
    const { width, height } = bfs(body);
    zdjecia.push({image: body, width, height});
  }
  for (const url of req.query.zdjecie) {
    let body;
    try {
      body = await snek.get(url).then((r) => r.body);
    } catch (err) {
      return res.send(400, {success: false, error: 400, body: "Bad Request", description: "Nie udało się pobrać zdjęcia " + url});
    }
    a(body);
  }
  dims.height = zdjecia.reduce((p, c) => Math.max(p, c.height), 0);
  dims.width = zdjecia.reduce((p, c) => p + c.width * (dims.height / c.height), 0);
  const canva = new Canvas(dims.width, dims.height);
  let offset = 0;
  for (const zdjecie of zdjecia) {
    const dimsE = {width: 0, height: 0};
    const powiekszenie = dims.height / zdjecie.height;
    dimsE.width = zdjecie.width * powiekszenie;
    dimsE.height = zdjecie.height * powiekszenie;
    canva.addImage(zdjecie.image, offset, 0, dimsE.width, dimsE.height);
    offset += dimsE.width;
  }
  res.send({success: true, image: canva.toBuffer()});
});
/**
 * @api {get} api/image/roksana Roksana
 * @apiName Roksana
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Wkleja Roksanę na awatar
 * @apiVersion 1.0.7
 * @apiParam {String} avatarURL Link do awataru
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 */
server.get("/api/image/roksana", authorize, async function(req, res) {
  if (!plates.roksana) plates.roksana = await fsn.readFile("./assets/images/image_roksana.png");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  if (cache.has("roksana" + req.query.avatarURL.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("roksana" + req.query.avatarURL.replace(/\.gif/g, ".png"))});
  }
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  try {
    const resp = new Canvas(500, 500)
      .setColor("#000000")
      .addRect(0, 0, 500, 500)
      .addImage(body, 0, 0, 500, 500)
      .addImage(plates.roksana, 0, 0, 500, 500)
      .toBuffer();
    cache.set("roksana" + req.query.avatarURL.replace(/\.gif/g, ".png"), resp);
    return res.send({success: true, image: resp});
  } catch (err) {
    return res.send(500, {success: false, error: {code: 500, body: "Internal Server Error", description: "Nie udało się wygenerować zdjęcia"}});
  }
});
/**
 * @api {get} api/image/debilizm Debilizm
 * @apiName Debilizm
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Wkleja awatar na odczynnik z podpisem "czysty debilizm"
 * @apiVersion 1.0.8
 * @apiParam {String} avatarURL Link do awataru
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 */
server.get("/api/image/debilizm", authorize, async function(req, res) {
  if (!plates.debilizm) plates.debilizm = await fsn.readFile("./assets/images/image_debilizm.png");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  if (cache.has("debilizm" + req.query.avatarURL.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("debilizm" + req.query.avatarURL.replace(/\.gif/g, ".png"))});
  }
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  try {
    const resp = new Canvas(1083, 720)
      .setColor("#000000")
      .addRect(0, 0, 500, 500)
      .save()
      .rotate(4.3 * Math.PI / 180)
      .addImage(body, 346, 303, 107, 110)
      .restore()
      .addImage(plates.debilizm, 0, 0, 1083, 720)
      .toBuffer();
    cache.set("debilizm" + req.query.avatarURL.replace(/\.gif/g, ".png"), resp);
    return res.send({success: true, image: resp});
  } catch (err) {
    return res.send(500, {success: false, error: {code: 500, body: "Internal Server Error", description: "Nie udało się wygenerować zdjęcia"}});
  }
});
/**
 * @api {get} api/image/god God
 * @apiName God
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Dzieci opisują Boga ilustratorowi
 * @apiVersion 1.0.9
 * @apiParam {String} avatarURL Link do awataru
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 */
server.get("/api/image/god", authorize, async function(req, res) {
  if (!plates.god) plates.god = await fsn.readFile("./assets/images/image_god.png");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  if (cache.has("god" + req.query.avatarURL.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("god" + req.query.avatarURL.replace(/\.gif/g, ".png"))});
  }
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  try {
    const resp = new Canvas(714, 698)
      .setColor("#000000")
      .addRect(0, 0, 500, 500)
      .addImage(body, 209, 94, 254, 254)
      .addImage(plates.god, 0, 0, 714, 698)
      .toBuffer();
    cache.set("god" + req.query.avatarURL.replace(/\.gif/g, ".png"), resp);
    return res.send({success: true, image: resp});
  } catch (err) {
    return res.send(500, {success: false, error: {code: 500, body: "Internal Server Error", description: "Nie udało się wygenerować zdjęcia"}});
  }
});

/**
 * @api {get} api/image/chain Chain
 * @apiName Chain
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Przykuj oznaczoną osobę do łóżeczka
 * @apiParam {String} avatarURL Link do awataru (osoby w lozku)
 * @apiParam {String} avatarURL2 Link do drugiego awataru (osoby z kluczem)
 * @apiVersion 1.0.10
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 * @apiErrorExample {json}
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "error": {
 *         "code": 404,
 *         "body": "Not Found",
 *         "description": "Nie znaleziono tematu"
 *       }
 *     }
 */
server.get("/api/image/chain", authorize, async function(req, res) {
  if (!plates.chain) plates.chain = await fsn.readFile("./assets/images/plate_chain.png");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru (1)"}});
  if (!req.query.avatarURL2) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru (2)"}});
  if (cache.has("chain" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.avatarURL2.replace(/\.gif/g, ".png"))) {
    return res.send({success: true, image: cache.get("chain" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.avatarURL2.replace(/\.gif/g, ".png"))});
  }
  let body;
  let body2;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
    body2 = await snek.get(req.query.avatarURL2.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  try {
    const resp = new Canvas(1920, 1080)
      .setColor("#000000")
      .addRect(0, 0, 1920, 1080)
      .save()
      .addImage(body, 528, 217, 230, 230)
      .restore()
      .save()
      .addImage(body2, 1374, 34, 296, 296)
      .restore()
      .addImage(plates.chain, 0, 0, 1920, 1080)
      .toBuffer();
    cache.set("chain" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.avatarURL2.replace(/\.gif/g, ".png"), resp);
    return res.send({success: true, image: resp});
  } catch (err) {
    return res.send(500, {success: false, error: {code: 500, body: "Internal Server Error", description: "Nie udało się wygenerować zdjęcia"}});
  }
});

/**
 * @api {get} api/image/eat Eat
 * @apiName Eat
 * @apiHeader {string} authorization token
 * @apiGroup Generator
 * @apiDescription Ktoś się pojawia na talerzu
 * @apiVersion 1.0.11
 * @apiParam {String} avatarURL Link do awataru
 * @apiParam {String} tekst Tekst
 * @apiSuccess {Boolean} success Czy zapytanie się udało
 * @apiSuccess {object} image Objekt ze zdjęciem
 * @apiSuccess {String} image.type Typ, "Buffer"
 * @apiSuccess {Array} image.data Buffer Array, czyli zdjęcie
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "image": {
 *         "type": "Buffer",
 *         "data": [...]
 *       }
 *     }
 */
server.get("/api/image/eat", authorize, async function(req, res) {
  if (!plates.eat) plates.eat = await fsn.readFile("./assets/images/image_eat.png");
  if (!req.query.avatarURL) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Brak linka do awataru"}});
  if (!req.query.tekst || req.query.tekst === "") return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie podano tekstu"}});
  if (cache.has("eat" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.tekst)) {
    return res.send({success: true, image: cache.get("eat" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.tekst)});
  }
  let body;
  try {
    body = await snek.get(req.query.avatarURL.replace(/\.gif/g, ".png")).then(r => r.body);
  } catch (err) {
    return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nie udało się pobrać awataru"}});
  }
  try {
    const resp = new Canvas(1600, 1200)
      .setColor("#000000")
      .addRect(0, 0, 500, 500)
      .addImage(plates.eat, 0, 0, 1600, 1200)
      .setTextAlign("center")
      .setTextSize(80)
      .addText(req.query.tekst, 784, 850)
      .addImage(body, 630, 363, 300, 300)
      .toBuffer();
    cache.set("eat" + req.query.avatarURL.replace(/\.gif/g, ".png") + req.query.tekst, resp);
    return res.send({success: true, image: resp});
  } catch (err) {
    return res.send(500, {success: false, error: {code: 500, body: "Internal Server Error", description: "Nie udało się wygenerować zdjęcia"}});
  }
});

/**
 * @api {get} api/proxy/pixiv Proxy dla Pixiv'a
 * @apiName Pixiv
 * @apiGroup Proxy
 * @apiDescription Pixiv = trash pozdro
 * @apiVersion 1.0.12
 * @apiParam {String} path Ścieżka do obrazu (bez / na początku, ani domeny)
 * @apiError {Object} error Błąd
 * @apiError {Number} error.code Kod błędu
 * @apiError {String} error.body Treść błędu
 * @apiError {String} error.description Opis błędu, co poszło nie tak
 * @apiSuccessExample {json}
 *     HTTP/1.1 200 OK
 *     (dane obrazu)
 */
server.get("/api/proxy/pixiv", async function(req, res) {
  if (!req.query.path) return res.send(400, {success: false, error: {code: 400, body: "Bad Request", description: "Nieprawidłowa ścieżka!"}});
  if (!(req.query.path.startsWith("c/150x150/img-master/img") || req.query.path.startsWith("c/600x600/img-master/img") || req.query.path.startsWith("img-original/img"))) {
    return res.send(403, {success: false, error: {code: 403, body: "Forbidden", description: "Niedozwolona ścieżka!"}});
  }
  try {
    let resp = await snek.get("https://i.pximg.net/" + req.query.path, {headers: {Referer: "https://pixiv.net"}});
    res.sendRaw(200, resp.body, resp.headers);
  } catch (e) {
    res.send(404, "chuj");
  }
});

server.listen(config.port, config.ip, function() {
  console.log(`Gotowe! (${server.name}, ${server.url})`);
});

setInterval(() => {
  cache.clear();
}, 300e3);

