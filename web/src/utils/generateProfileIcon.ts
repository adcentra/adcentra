export default function generateProfileIcon(
  username: string,
  size = 100,
  bgColor = '#fff',
  textColor = '#000',
) {
  if (!username || username === '') {
    username = 'U';
  }

  const parts = username.split(/[\s-]+/);

  let initialsParts = parts;
  if (parts.length > 3) {
    const upperCaseParts = parts.filter((part: string) => /^[A-Z]/.test(part));
    if (upperCaseParts.length >= 1) {
      initialsParts = upperCaseParts;
    }
  }

  const initials = initialsParts
    .map((part: string) => part.charAt(0).toUpperCase())
    .slice(0, 3)
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size / 2}" />
      <text x="50%" y="55%" fill="${textColor}" font-size="${size / 2}" font-family="Arial, sans-serif"
            dominant-baseline="middle" text-anchor="middle">${initials}</text>
    </svg>`;

  const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}
