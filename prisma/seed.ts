import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Text Tools', slug: 'text-tools', description: 'Manipulate and analyze text content', icon: 'Type', order: 1 },
  { name: 'Image Tools', slug: 'image-tools', description: 'Convert, compress, and edit images', icon: 'Image', order: 2 },
  { name: 'Developer Tools', slug: 'developer-tools', description: 'Essential utilities for developers', icon: 'Code', order: 3 },
  { name: 'Converter Tools', slug: 'converter-tools', description: 'Convert between different formats', icon: 'Repeat', order: 4 },
]

const tools = [
  {
    name: 'QR Code Generator',
    slug: 'qr-generator',
    description: 'Generate QR codes from any text, URL, or data. Download as PNG or SVG.',
    icon: 'QrCode',
    categorySlug: 'developer-tools',
    isPopular: true,
    order: 1,
  },
  {
    name: 'Password Generator',
    slug: 'password-generator',
    description: 'Generate strong, secure passwords with customizable length and character sets.',
    icon: 'KeyRound',
    categorySlug: 'developer-tools',
    isPopular: true,
    order: 2,
  },
  {
    name: 'JSON Formatter',
    slug: 'json-formatter',
    description: 'Format, validate, and beautify JSON data with syntax highlighting.',
    icon: 'Braces',
    categorySlug: 'developer-tools',
    isPopular: true,
    order: 3,
  },
  {
    name: 'UUID Generator',
    slug: 'uuid-generator',
    description: 'Generate unique UUIDs (v4) instantly. Copy to clipboard with one click.',
    icon: 'Hash',
    categorySlug: 'developer-tools',
    isPopular: true,
    order: 4,
  },
  {
    name: 'Word Counter',
    slug: 'word-counter',
    description: 'Count words, characters, sentences, and paragraphs in your text.',
    icon: 'TextCursorInput',
    categorySlug: 'text-tools',
    isPopular: true,
    order: 1,
  },
  {
    name: 'Image Compressor',
    slug: 'image-compressor',
    description: 'Compress images directly in your browser. No upload required.',
    icon: 'ImageMinus',
    categorySlug: 'image-tools',
    isPopular: true,
    order: 1,
  },
  {
    name: 'Base64 Encoder / Decoder',
    slug: 'base64-encoder',
    description: 'Encode text to Base64 or decode Base64 back to plain text.',
    icon: 'Binary',
    categorySlug: 'converter-tools',
    isPopular: true,
    order: 1,
  },
  {
    name: 'Timestamp Converter',
    slug: 'timestamp-converter',
    description: 'Convert between Unix timestamps and human-readable dates.',
    icon: 'Clock',
    categorySlug: 'converter-tools',
    isPopular: true,
    order: 2,
  },
]

async function main() {
  console.log('Seeding database...')

  // Create categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log(`Created ${categories.length} categories`)

  // Create tools
  for (const tool of tools) {
    const category = await prisma.category.findUnique({
      where: { slug: tool.categorySlug },
    })
    if (!category) {
      console.error(`Category ${tool.categorySlug} not found`)
      continue
    }
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {},
      create: {
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        icon: tool.icon,
        categoryId: category.id,
        isPopular: tool.isPopular,
        order: tool.order,
      },
    })
  }
  console.log(`Created ${tools.length} tools`)

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })