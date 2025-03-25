import sharp from 'sharp';
import { createElement } from 'react';
import { HeartHandshake } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';

const PRIMARY_COLOR = '#6366f1';
const BACKGROUND_COLOR = '#ffffff';

async function generateIcon(svg: string, size: number, outputPath: string) {
  const padding = Math.floor(size * 0.2); // 20% padding
  const iconSize = size - (padding * 2);
  
  await sharp(Buffer.from(svg))
    .resize(iconSize, iconSize)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: BACKGROUND_COLOR
    })
    .toFile(outputPath);
}

async function generateOGImage(svg: string, outputPath: string) {
  const width = 1200;
  const height = 630;
  const iconSize = 200;
  
  const svgWithBackground = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${PRIMARY_COLOR};stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="${BACKGROUND_COLOR}"/>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <g transform="translate(${(width - iconSize) / 2} ${(height - iconSize) / 2})">${svg}</g>
      <text
        x="${width / 2}"
        y="${height / 2 + 160}"
        font-family="EB Garamond"
        font-size="64"
        fill="#1f2937"
        text-anchor="middle"
      >
        Serenity Health AI
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svgWithBackground))
    .toFile(outputPath);
}

async function generateFavicon(svg: string, outputPath: string) {
  // For favicon, we'll generate a high-quality PNG and use it directly
  await sharp(Buffer.from(svg))
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(outputPath.replace('.ico', '.png'));

  // Note: Since Sharp doesn't support ICO format directly, 
  // we'll use the PNG as favicon which is widely supported by modern browsers
}

async function main() {
  // Convert HeartHandshake component to SVG string
  const svgString = renderToString(
    createElement(HeartHandshake, {
      color: PRIMARY_COLOR,
      strokeWidth: 1.5,
      size: 100
    })
  );

  const publicDir = path.join(process.cwd(), 'public');

  // Generate favicon as PNG
  await generateFavicon(svgString, path.join(publicDir, 'favicon.ico'));

  // Generate PWA icons
  await generateIcon(svgString, 192, path.join(publicDir, 'icon-192.png'));
  await generateIcon(svgString, 512, path.join(publicDir, 'icon-512.png'));

  // Generate Microsoft Tile icons
  await generateIcon(svgString, 70, path.join(publicDir, 'mstile-70x70.png'));
  await generateIcon(svgString, 150, path.join(publicDir, 'mstile-150x150.png'));
  await generateIcon(svgString, 310, path.join(publicDir, 'mstile-310x310.png'));
  
  // Generate wide Microsoft Tile icon
  const wideTileSvg = `
    <svg width="310" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${BACKGROUND_COLOR}"/>
      <g transform="translate(80 0)">${svgString}</g>
    </svg>
  `;
  await sharp(Buffer.from(wideTileSvg))
    .resize(310, 150)
    .toFile(path.join(publicDir, 'mstile-310x150.png'));

  // Generate Apple Touch Icon
  await generateIcon(svgString, 180, path.join(publicDir, 'apple-touch-icon.png'));

  // Generate OG Image
  await generateOGImage(svgString, path.join(publicDir, 'og-image.png'));
  
  // Generate Twitter Image (can reuse OG image)
  fs.copyFileSync(
    path.join(publicDir, 'og-image.png'),
    path.join(publicDir, 'twitter-image.png')
  );

  // Generate Screenshot
  const screenshotSvg = `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${PRIMARY_COLOR};stop-opacity:0.2" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="${BACKGROUND_COLOR}"/>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <g transform="translate(590 260)">${svgString}</g>
      <text
        x="640"
        y="460"
        font-family="EB Garamond"
        font-size="48"
        fill="#1f2937"
        text-anchor="middle"
      >
        Your Supportive Mental Health Companion
      </text>
    </svg>
  `;
  await sharp(Buffer.from(screenshotSvg))
    .toFile(path.join(publicDir, 'screenshot1.png'));

  console.log('All icons generated successfully!');
}

main().catch(console.error); 