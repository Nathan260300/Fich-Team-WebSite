export const STEVE_URL = 'https://textures.minecraft.net/texture/31f477eb1a7beee631c2ca64d06f8f68fa93a3386d04452ab27f43acdf1b60cb';

const images = new Map();

export function loadImage(url) {
  if (!images.has(url)) {
    images.set(
      url,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          images.delete(url);
          reject(new Error('skin'));
        };
        img.src = url;
      }),
    );
  }
  return images.get(url);
}

export const FACE_SIZE = { width: 8, height: 8 };
const ANGLE = (24 * Math.PI) / 180;
const COS = Math.cos(ANGLE);
const SIN = Math.sin(ANGLE);
const SCALE = 8;
const HEIGHT = 32;
const MAX_INFLATE = 0.5;
const MIN_X = -8 * COS - (2 + MAX_INFLATE) * SIN - MAX_INFLATE * COS;
const MAX_X = 8 * COS + (2 + MAX_INFLATE) * SIN + MAX_INFLATE * COS;

export const BODY_SIZE = {
  width: Math.ceil((MAX_X - MIN_X) * SCALE),
  height: HEIGHT * SCALE,
};

function part(ctx, img, sx, sy, sw, sh, dx, dy, mirror = false) {
  if (!mirror) {
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, sw, sh);
    return;
  }
  ctx.save();
  ctx.translate(dx + sw, dy);
  ctx.scale(-1, 1);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  ctx.restore();
}

export function drawFace(ctx, img) {
  ctx.clearRect(0, 0, FACE_SIZE.width, FACE_SIZE.height);
  part(ctx, img, 8, 8, 8, 8, 0, 0);
  part(ctx, img, 40, 8, 8, 8, 0, 0);
}

function project(x, z) {
  return (x * COS + z * SIN - MIN_X) * SCALE;
}

function blit(ctx, img, sx, sy, sw, sh, xa, xb, ya, yb, flip) {
  const left = Math.round(Math.min(xa, xb));
  const right = Math.round(Math.max(xa, xb));
  const top = Math.round(ya * SCALE);
  const bottom = Math.round(yb * SCALE);
  if (right <= left || bottom <= top) return;
  if (!flip) {
    ctx.drawImage(img, sx, sy, sw, sh, left, top, right - left, bottom - top);
    return;
  }
  ctx.save();
  ctx.translate(right, top);
  ctx.scale(-1, 1);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, right - left, bottom - top);
  ctx.restore();
}

function box(ctx, img, spec, inflate) {
  const { x, y, w, h, d, u, v, mirror } = spec;
  const half = d / 2 + inflate;
  const x0 = x - inflate;
  const x1 = x + w + inflate;
  const y0 = y - inflate;
  const y1 = y + h + inflate;

  blit(ctx, img, u + d, v + d, w, h, project(x0, half), project(x1, half), y0, y1, mirror);

  const sideX = project(x0, half);
  const sideBack = project(x0, -half);
  if (mirror) blit(ctx, img, u + d + w, v + d, d, h, sideX, sideBack, y0, y1, true);
  else blit(ctx, img, u, v + d, d, h, sideX, sideBack, y0, y1, false);
}

export function drawBody(ctx, img, model) {
  ctx.clearRect(0, 0, BODY_SIZE.width, BODY_SIZE.height);
  ctx.imageSmoothingEnabled = false;
  const modern = img.height >= 64;
  const aw = modern && model === 'slim' ? 3 : 4;

  const parts = [
    { x: -4 - aw, y: 8, w: aw, h: 12, d: 4, u: 40, v: 16, ou: 40, ov: 32, mirror: false },
    { x: -4, y: 20, w: 4, h: 12, d: 4, u: 0, v: 16, ou: 0, ov: 32, mirror: false },
    { x: -4, y: 8, w: 8, h: 12, d: 4, u: 16, v: 16, ou: 16, ov: 32, mirror: false },
    { x: -4, y: 0, w: 8, h: 8, d: 8, u: 0, v: 0, ou: 32, ov: 0, mirror: false, hat: true },
    modern
      ? { x: 0, y: 20, w: 4, h: 12, d: 4, u: 16, v: 48, ou: 0, ov: 48, mirror: false }
      : { x: 0, y: 20, w: 4, h: 12, d: 4, u: 0, v: 16, mirror: true },
    modern
      ? { x: 4, y: 8, w: aw, h: 12, d: 4, u: 32, v: 48, ou: 48, ov: 48, mirror: false }
      : { x: 4, y: 8, w: 4, h: 12, d: 4, u: 40, v: 16, mirror: true },
  ];

  parts.reverse().forEach(spec => {
    box(ctx, img, spec, 0);
    if (spec.ou !== undefined && (modern || spec.hat)) {
      box(ctx, img, { ...spec, u: spec.ou, v: spec.ov }, spec.hat ? 0.5 : 0.25);
    }
  });
}
