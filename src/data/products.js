// The catalog, in the order the collection grid shows it (the first item is the large feature card).
// `skin` lists the skin types a product suits ('all' = every type); `oils` is its essential-oil blend;
// `organic` is the % of the formula made from certified organic ingredients; `minAge` is the youngest recommended age. Cruelty-free and vegan apply to the whole brand (see claims.js).
// Prices are integer minor units (paise): 219900 = ₹2,199. Images are 3D renders in /public/products.
// The `price` written here is the price of the first (smaller) size; SIZES below adds the larger one.
const catalog = [
  {
    slug: 'silk-body-lotion', name: 'Silk Body Lotion', price: 219900, category: 'Lotion', image: '/products/lot.png',
    organic: 96,
    minAge: 16,
    skin: ['dry', 'normal', 'sensitive'],
    oils: [{ name: 'Lavender', note: 'calms and settles' }, { name: 'Geranium', note: 'balances and softens' }, { name: 'Ylang-ylang', note: 'a soft floral warmth' }],
    blurb: 'A light, fast-absorbing lotion for soft skin from head to toe.',
    description: 'Whipped with calendula and cold-pressed argan oil, this featherlight lotion melts in within seconds and settles into a silken, never-greasy finish. A quiet, warm scent lingers just long enough to notice.',
    ingredients: [
      { name: 'Calendula', role: 'A golden petal extract that calms skin that feels tight or tired.' },
      { name: 'Argan oil', role: 'Cold-pressed from the kernel, it seals in moisture without heaviness.' },
      { name: 'Shea butter', role: 'Cushions and softens dry patches.' },
    ],
  },
  {
    slug: 'barrier-repair-cream', name: 'Barrier Repair Cream', price: 329900, category: 'Cream', image: '/products/bar.png',
    organic: 96,
    minAge: 16,
    skin: ['dry', 'sensitive'],
    oils: [{ name: 'Rose otto', note: 'comforts stressed skin' }, { name: 'Frankincense', note: 'supports a resilient look' }, { name: 'Lavender', note: 'calms and settles' }],
    blurb: 'A rich cream that restores comfort overnight.',
    description: 'A cushioned, ceramide-rich cream formulated for skin that has had enough. Rose water and argan oil work through the night to comfort a compromised barrier, so skin feels calmer, softer and visibly more resilient by morning.',
    ingredients: [
      { name: 'Rose water', role: 'Softens and comforts, and gives the cream its quiet scent.' },
      { name: 'Ceramides', role: 'Reinforce the skin barrier and reduce moisture loss.' },
      { name: 'Argan oil', role: 'Seals in moisture without heaviness.' },
    ],
  },
  {
    slug: 'luminous-oil-serum', name: 'Luminous Oil Serum', price: 389900, category: 'Serum', image: '/products/lum.png',
    organic: 97,
    minAge: 18,
    skin: ['normal', 'dry', 'combination'],
    oils: [{ name: 'Neroli', note: 'a bright, uplifting glow' }, { name: 'Sandalwood', note: 'smooths the feel of skin' }, { name: 'Rose otto', note: 'comforts and softens' }],
    blurb: 'A weightless glow oil for dull, tired skin.',
    description: 'A weightless facial oil built around squalane and rosehip, absorbed in moments rather than left sitting on the surface. Skin looks brighter and feels newly supple, with a natural sheen rather than an oily finish.',
    ingredients: [
      { name: 'Squalane', role: 'Mimics skin’s own lipids to seal in moisture without heaviness.' },
      { name: 'Rosehip oil', role: 'Rich in fatty acids that help soften the look of uneven tone.' },
    ],
  },
  {
    slug: 'dew-essence-mist', name: 'Dew Essence Mist', price: 179900, category: 'Mist', image: '/products/dew.png',
    organic: 98,
    minAge: 16,
    skin: ['all'],
    oils: [{ name: 'Geranium', note: 'balances and refreshes' }, { name: 'Neroli', note: 'a light, clean scent' }],
    blurb: 'A fine mist for instant, all-day hydration.',
    description: 'A fine, cooling veil of rose water and hyaluronic acid that resets tired skin in seconds - over makeup, midway through the day, or as the first step before serums. The kind of bottle you keep reaching for.',
    ingredients: [
      { name: 'Rose water', role: 'Calms and refreshes.' },
      { name: 'Hyaluronic acid', role: 'Draws water into the surface of the skin.' },
    ],
  },
  {
    slug: 'clarity-gel-cleanser', name: 'Clarity Gel Cleanser', price: 149900, category: 'Cleanser', image: '/products/cla.png',
    organic: 94,
    minAge: 16,
    skin: ['oily', 'combination'],
    oils: [{ name: 'Tea tree', note: 'clarifying and fresh' }, { name: 'Rosemary', note: 'invigorating' }, { name: 'Lavender', note: 'keeps the cleanse gentle' }],
    blurb: 'A fresh gel that cleanses without stripping.',
    description: 'A weightless gel that lifts away the day without stripping skin\'s natural balance. Green tea and glycerin keep the cleanse gentle enough for twice-daily use, leaving skin clear, calm and comfortable.',
    ingredients: [
      { name: 'Green tea', role: 'Soothes and adds antioxidant support.' },
      { name: 'Glycerin', role: 'Keeps skin hydrated while cleansing.' },
    ],
  },
  {
    slug: 'soft-milk-cleanser', name: 'Soft Milk Cleanser', price: 139900, category: 'Cleanser', image: '/products/mil.png',
    organic: 95,
    minAge: 16,
    skin: ['dry', 'sensitive', 'normal'],
    oils: [{ name: 'Roman chamomile', note: 'soothes easily irritated skin' }, { name: 'Lavender', note: 'calms and settles' }],
    blurb: 'A creamy cleanser for dry or sensitive skin.',
    description: 'A creamy, low-foam cleanser built for skin that reacts to everything. Oat extract and calendula soothe as they cleanse, for a finish that feels soft and settled rather than tight.',
    ingredients: [
      { name: 'Oat extract', role: 'Soothes sensitive, easily irritated skin.' },
      { name: 'Calendula', role: 'Calms skin that feels tight or tired.' },
    ],
  },
  {
    slug: 'eye-restore-cream', name: 'Eye Restore Cream', price: 259900, category: 'Eye care', image: '/products/eye.png',
    organic: 96,
    minAge: 18,
    skin: ['all'],
    oils: [{ name: 'Roman chamomile', note: 'soothes the eye area' }, { name: 'Frankincense', note: 'supports a smooth look' }],
    blurb: 'A gentle cream for the delicate eye area.',
    description: 'A silky, fast-absorbing cream for the eye area, formulated with chamomile and caffeine to visibly ease the look of puffiness and fatigue. Pat gently along the orbital bone, morning and night.',
    ingredients: [
      { name: 'Chamomile', role: 'A soothing extract for skin that reacts to everything.' },
      { name: 'Caffeine', role: 'Helps de-puff the look of tired eyes.' },
    ],
  },
  {
    slug: 'overnight-renewal-mask', name: 'Overnight Renewal Mask', price: 299900, category: 'Mask', image: '/products/mas.png',
    organic: 95,
    minAge: 18,
    skin: ['dry', 'normal', 'combination'],
    oils: [{ name: 'Lavender', note: 'helps the ritual feel like rest' }, { name: 'Sandalwood', note: 'smooths and softens' }, { name: 'Roman chamomile', note: 'settles skin overnight' }],
    blurb: 'A sleeping mask that wakes up your best skin.',
    description: 'The final step of an evening ritual: a rich, lavender-scented mask that works while you sleep. Peptides support the look of firmness, so skin wakes smoother, plumper and quietly renewed.',
    ingredients: [
      { name: 'Lavender', role: 'Its essential oil settles skin and helps the ritual feel like rest.' },
      { name: 'Peptides', role: 'Support the look of firmness overnight.' },
    ],
  },
  {
    slug: 'brightening-c-serum', name: 'Brightening C Serum', price: 279900, category: 'Serum', image: '/products/cbr.png',
    organic: 96,
    minAge: 18,
    skin: ['normal', 'oily', 'combination'],
    oils: [{ name: 'Neroli', note: 'a bright, clean scent' }, { name: 'Geranium', note: 'balances the feel of skin' }],
    blurb: 'A gentle vitamin C serum for an even-looking tone.',
    description: 'A stable, well-tolerated vitamin C serum that brightens gradually rather than aggressively. Niacinamide works alongside it to refine the look of pores and even out tone with consistent use.',
    ingredients: [
      { name: 'Vitamin C', role: 'A gentle, stable form of vitamin C.' },
      { name: 'Niacinamide', role: 'Refines the look of pores and uneven tone.' },
    ],
  },
  {
    slug: 'nourishing-body-wash', name: 'Nourishing Body Wash', price: 189900, category: 'Body wash', image: '/products/bwa.png',
    organic: 95,
    minAge: 16,
    skin: ['all'],
    oils: [{ name: 'Lavender', note: 'calms and settles' }, { name: 'Sweet orange', note: 'a bright, clean lift' }],
    blurb: 'A creamy, low-lather wash for soft skin from the shower onward.',
    description: 'A low-foam, sulfate-gentle wash that cleanses without leaving skin feeling stripped. Oat extract and coconut-derived cleansers lift away the day while glycerin keeps the skin barrier comfortable, so you step out soft rather than squeaky.',
    ingredients: [
      { name: 'Oat extract', role: 'Soothes sensitive, easily irritated skin.' },
      { name: 'Coconut-derived cleansers', role: 'Lift away the day without stripping natural oils.' },
      { name: 'Glycerin', role: 'Keeps skin hydrated while cleansing.' },
    ],
  },
  {
    slug: 'retinol-renewal-serum', name: 'Retinol Renewal Serum', price: 419900, category: 'Serum', image: '/products/ret.png',
    organic: 90,
    minAge: 18,
    skin: ['normal', 'oily', 'combination'],
    oils: [{ name: 'Frankincense', note: 'supports a resilient look, used sparingly here' }, { name: 'Neroli', note: 'a light top note, kept minimal for sensitivity' }],
    blurb: 'A nightly retinol treatment for smoother, visibly renewed skin.',
    description: 'A time-released, encapsulated retinol that works through the night with less of the redness and flaking a raw retinol can bring. Introduce it two or three nights a week and build up slowly. Not recommended for dry or sensitive skin, and not for use during pregnancy or while nursing.',
    ingredients: [
      { name: 'Encapsulated retinol', role: 'A time-released form that supports visibly smoother texture with less irritation.' },
      { name: 'Squalane', role: 'Cushions the retinol so skin stays comfortable through the night.' },
    ],
  },
  {
    slug: 'gentle-exfoliator', name: 'Gentle Exfoliator', price: 219900, category: 'Exfoliator', image: '/products/exf.png',
    organic: 93,
    minAge: 16,
    skin: ['normal', 'oily', 'combination'],
    oils: [{ name: 'Tea tree', note: 'clarifying and fresh' }, { name: 'Rosemary', note: 'invigorating' }],
    blurb: 'A fine, non-scratchy polish that leaves skin soft, never raw.',
    description: 'Rounded jojoba esters buff away dull surface cells without the micro-tearing of sharp-edged scrubs, while a mild lactic acid works alongside to loosen what brushing alone cannot. Two or three times a week is enough; skin looks brighter, not stripped.',
    ingredients: [
      { name: 'Jojoba esters', role: 'Rounded, gentle beads that polish without micro-tearing.' },
      { name: 'Lactic acid', role: 'A mild acid that helps loosen dull surface cells.' },
    ],
  },
  {
    slug: 'clarifying-clay-mask', name: 'Clarifying Clay Mask', price: 259900, category: 'Mask', image: '/products/clm.png',
    organic: 94,
    minAge: 16,
    skin: ['oily', 'combination'],
    oils: [{ name: 'Tea tree', note: 'clarifying and fresh' }, { name: 'Lavender', note: 'keeps the treatment gentle' }],
    blurb: 'A weekly clay mask that draws out congestion without over-drying.',
    description: 'Kaolin and a touch of bentonite clay draw out excess oil and the look of congestion, while niacinamide keeps the ten-minute treatment from tipping into tightness. Once or twice a week, skin looks clearer and pores less visible by the time you rinse it off.',
    ingredients: [
      { name: 'Kaolin clay', role: 'Gently draws out excess oil and congestion.' },
      { name: 'Niacinamide', role: 'Refines the look of pores as the mask sets.' },
    ],
  },
  {
    slug: 'mineral-sunscreen-spf30', name: 'Mineral Sunscreen SPF 30', price: 229900, category: 'SPF', image: '/products/sun.png',
    organic: 90,
    minAge: 16,
    skin: ['all'],
    oils: [{ name: 'Chamomile', note: 'a soothing trace, kept fragrance-light for sun-exposed skin' }, { name: 'Geranium', note: 'balances without heaviness' }],
    blurb: 'A broad-spectrum mineral sunscreen with no white cast.',
    description: 'Non-nano zinc oxide and titanium dioxide sit on the skin\'s surface for broad-spectrum protection, in a lightweight lotion that blends down clear rather than sitting grey. Water-resistant for up to 40 minutes; reapply after swimming, sweating or towelling off.',
    ingredients: [
      { name: 'Non-nano zinc oxide', role: 'Provides broad-spectrum mineral sun protection.' },
      { name: 'Titanium dioxide', role: 'Works alongside zinc oxide for even coverage.' },
    ],
  },
];

// Every product comes in two sizes: [small, large] by category. The large size costs SIZE_FACTOR times the small one,
// rounded to a whole rupee amount ending in 99 (e.g. ₹2,199 -> ₹3,799).
const SIZES = {
  'Body wash': ['300 ml', '500 ml'], Cleanser: ['100 ml', '200 ml'], Cream: ['50 g', '100 g'], Exfoliator: ['75 ml', '150 ml'],
  'Eye care': ['15 ml', '30 ml'], Lotion: ['200 ml', '400 ml'], Mask: ['50 ml', '100 ml'], Mist: ['100 ml', '200 ml'],
  Serum: ['30 ml', '50 ml'], SPF: ['50 ml', '100 ml'],
};
const SIZE_FACTOR = 1.7;
const largePrice = (paise) => Math.round((paise * SIZE_FACTOR) / 10000) * 10000 - 100;

// `sizes[].key` is '' for the small size and 'l' for the large one. `price` above stays the small-size price.
export const products = catalog.map((p) => {
  const [small, large] = SIZES[p.category];
  return { ...p, sizes: [{ key: '', label: small, price: p.price }, { key: 'l', label: large, price: largePrice(p.price) }] };
});

// A catalog product by its plain slug (product pages, cards, wishlist).
export const bySlug = (slug) => products.find((p) => p.slug === slug);

// What sits in a bag: a plain slug is the small size, "slug~l" is the large size. Returns the product with that
// size's `price`, a `name` that includes the size, and `baseSlug` for links; undefined if unknown.
export const bagKey = (slug, sizeKey) => (sizeKey ? `${slug}~${sizeKey}` : slug);
export function bagItem(key) {
  const [slug, sizeKey = ''] = String(key).split('~');
  const p = bySlug(slug);
  const size = p?.sizes.find((s) => s.key === sizeKey);
  if (!size) return undefined;
  return { ...p, slug: bagKey(slug, sizeKey), baseSlug: slug, size: size.label, price: size.price, name: `${p.name} · ${size.label}` };
}
