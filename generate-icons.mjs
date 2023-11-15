import sharp from 'sharp'
import { join } from 'path'
import { writeFile, readFile } from 'fs'
import mkdirplz from 'mkdirplz'
import { promisify } from 'util'

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const branch = process.env.BRANCH || ''
const isProduction = branch === 'master' || !branch

const devTextString = branch.slice(0, 8)
const devTextWidth = 60 * devTextString.length
const devText = sharp(
  Buffer.from(`
<svg width="500" height="500" >
  <rect x="${
    490 - devTextWidth
  }" y="400" width="500" height="100" fill="#000" />
  <text x="${
    495 - devTextWidth
  }" y="485" font-size="100" fill="#fff" font-family="monospace">${devTextString}</text>
</svg>
`),
)

const tintColor = '#02115e'

export const generateIcons = async (outDir) => {
  const iconSrc = await readFileAsync('./src/logo.png')
  const iconDir = join(outDir, 'icons')
  await mkdirplz(iconDir)
  const background = 'transparent'
  const appleBg = isProduction ? '#800080' : tintColor
  const appleWidth = 180
  const applePad = Math.round(0.07 * appleWidth)

  await Promise.all([
    ...[512, 192, 180, 32, 16].map(
      async (width) => {
        const image = sharp(iconSrc)
          .composite(
            isProduction
              ? []
              : [{ input: await devText.resize(width).png().toBuffer() }],
          )
          .resize(width, width, { fit: 'contain', background })

        if (!isProduction) image.tint(tintColor)

        writeFileAsync(
          join(iconDir, `${width}.png`),
          await image.png().toBuffer(),
        )
      },
      writeFileAsync(
        join(iconDir, 'apple.png'),
        await sharp(iconSrc)
          .resize(appleWidth - applePad * 2, 180 - applePad * 2, {
            fit: 'contain',
            background: appleBg,
          })
          .extend({
            top: applePad,
            bottom: applePad,
            right: applePad,
            left: applePad,
            background: appleBg,
          })
          .composite(
            isProduction
              ? []
              : [{ input: await devText.resize(appleWidth).png().toBuffer() }],
          )
          .flatten({ background: appleBg })
          .png()
          .toBuffer(),
      ),
    ),
  ])
}
