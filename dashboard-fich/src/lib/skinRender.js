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
export const BODY_SIZE = { width: 16, height: 32 };

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

export function drawBody(ctx, img, model) {
  ctx.clearRect(0, 0, BODY_SIZE.width, BODY_SIZE.height);
  const modern = img.height >= 64;
  const slim = modern && model === 'slim';
  const aw = slim ? 3 : 4;
  const rightArmX = 8 - 4 - aw;
  const leftArmX = 12;

  part(ctx, img, 8, 8, 8, 8, 4, 0);
  part(ctx, img, 20, 20, 8, 12, 4, 8);
  part(ctx, img, 44, 20, aw, 12, rightArmX, 8);
  part(ctx, img, 4, 20, 4, 12, 4, 20);
  if (modern) {
    part(ctx, img, 36, 52, aw, 12, leftArmX, 8);
    part(ctx, img, 20, 52, 4, 12, 8, 20);
  } else {
    part(ctx, img, 44, 20, 4, 12, leftArmX, 8, true);
    part(ctx, img, 4, 20, 4, 12, 8, 20, true);
  }

  part(ctx, img, 40, 8, 8, 8, 4, 0);
  if (modern) {
    part(ctx, img, 20, 36, 8, 12, 4, 8);
    part(ctx, img, 44, 36, aw, 12, rightArmX, 8);
    part(ctx, img, 52, 52, aw, 12, leftArmX, 8);
    part(ctx, img, 4, 36, 4, 12, 4, 20);
    part(ctx, img, 4, 52, 4, 12, 8, 20);
  }
}