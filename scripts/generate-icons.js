const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Размеры иконок для PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const svgPath = path.join(__dirname, '../public/icons/icon.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // Простая генерация PNG из SVG (в реальном проекте лучше использовать sharp или другие инструменты)
  console.log('Генерация иконок PWA...');

  for (const size of sizes) {
    const outputPath = path.join(__dirname, `../public/icons/icon-${size}x${size}.png`);

    // Для простоты создадим placeholder иконки
    // В реальном проекте используйте sharp для конвертации SVG в PNG
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Фон
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, 0, size, size);

    // Простая ягода (круг)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size * 0.3, 0, 2 * Math.PI);
    ctx.fill();

    // Листочки
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(size * 0.3, size * 0.3, size * 0.05, size * 0.08, -Math.PI/6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(size * 0.7, size * 0.3, size * 0.05, size * 0.08, Math.PI/6, 0, 2 * Math.PI);
    ctx.fill();

    // Капельки
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(size * 0.4, size * 0.4, size * 0.02, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(size * 0.6, size * 0.5, size * 0.015, 0, 2 * Math.PI);
    ctx.fill();

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Создана иконка ${size}x${size}`);
  }

  console.log('Все иконки созданы!');
}

generateIcons().catch(console.error);
