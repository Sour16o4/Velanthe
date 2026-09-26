const img = (slug) => [`/img/${slug}-1.svg`, `/img/${slug}-2.svg`];

export const products = [
  {
    slug: 'luminous-oil-serum', name: 'Luminous Oil Serum', price: 389900, category: 'serum',
    blurb: 'A weightless glow oil for dull, tired skin.',
    description: 'A lightweight facial oil that melts in without residue, leaving skin luminous and supple.',
    ingredients: [
      { name: 'Squalane', role: 'Mimics skin’s own lipids to seal in moisture without heaviness.' },
      { name: 'Rosehip Oil', role: 'Rich in fatty acids that help soften the look of uneven tone.' },
    ],
    images: img('luminous-oil-serum'),
  },
  {
    slug: 'barrier-repair-cream', name: 'Barrier Repair Cream', price: 329900, category: 'cream',
    blurb: 'A rich cream that restores comfort overnight.',
    description: 'A cushiony moisturiser built to support a stressed, over-exfoliated skin barrier.',
    ingredients: [
      { name: 'Ceramides', role: 'Reinforce the skin barrier and reduce moisture loss.' },
      { name: 'Shea Butter', role: 'Cushions and softens dry patches.' },
    ],
    images: img('barrier-repair-cream'),
  },
  {
    slug: 'clarity-gel-cleanser', name: 'Clarity Gel Cleanser', price: 149900, category: 'cleanser',
    blurb: 'A fresh gel that cleanses without stripping.',
    description: 'A low-foam gel cleanser for morning and night that leaves skin clean and balanced.',
    ingredients: [
      { name: 'Green Tea Extract', role: 'Soothes and adds antioxidant support.' },
      { name: 'Glycerin', role: 'Keeps skin hydrated while cleansing.' },
    ],
    images: img('clarity-gel-cleanser'),
  },
  {
    slug: 'dew-essence-mist', name: 'Dew Essence Mist', price: 179900, category: 'mist',
    blurb: 'A fine mist for instant, all-day hydration.',
    description: 'A refreshing essence mist to set makeup, revive skin midday, or prep before serums.',
    ingredients: [
      { name: 'Rose Water', role: 'Calms and refreshes.' },
      { name: 'Hyaluronic Acid', role: 'Draws water into the surface of the skin.' },
    ],
    images: img('dew-essence-mist'),
  },
  {
    slug: 'overnight-renewal-mask', name: 'Overnight Renewal Mask', price: 299900, category: 'mask',
    blurb: 'A sleeping mask that wakes up your best skin.',
    description: 'Apply as the last step of your evening routine and wake to smoother, plumper-looking skin.',
    ingredients: [
      { name: 'Manuka Honey', role: 'A natural humectant that comforts and hydrates.' },
      { name: 'Peptides', role: 'Support the look of firmness overnight.' },
    ],
    images: img('overnight-renewal-mask'),
  },
  {
    slug: 'eye-restore-cream', name: 'Eye Restore Cream', price: 259900, category: 'cream',
    blurb: 'A gentle cream for the delicate eye area.',
    description: 'A silky eye cream that visibly refreshes puffiness and fine dryness lines.',
    ingredients: [
      { name: 'Caffeine', role: 'Helps de-puff the look of tired eyes.' },
      { name: 'Vitamin E', role: 'Antioxidant protection for delicate skin.' },
    ],
    images: img('eye-restore-cream'),
  },
  {
    slug: 'brightening-c-serum', name: 'Brightening C Serum', price: 279900, category: 'serum',
    blurb: 'A gentle vitamin C serum for an even-looking tone.',
    description: 'A stable, non-irritating vitamin C serum for brighter-looking skin over time.',
    ingredients: [
      { name: 'Sodium Ascorbyl Phosphate', role: 'A gentle, stable form of vitamin C.' },
      { name: 'Niacinamide', role: 'Refines the look of pores and uneven tone.' },
    ],
    images: img('brightening-c-serum'),
  },
  {
    slug: 'soft-milk-cleanser', name: 'Soft Milk Cleanser', price: 139900, category: 'cleanser',
    blurb: 'A creamy cleanser for dry or sensitive skin.',
    description: 'A milky, comforting cleanser that removes the day without tightness.',
    ingredients: [
      { name: 'Oat Extract', role: 'Soothes sensitive, easily irritated skin.' },
      { name: 'Almond Oil', role: 'Gently dissolves impurities and softens.' },
    ],
    images: img('soft-milk-cleanser'),
  },
];

export const bySlug = (slug) => products.find((p) => p.slug === slug);
