// Copy and settings for the home page (from the design). React renders these into markup, and the
// animation code in src/lib/home-experience.js reads the same data, so text and timing stay in step.

export const trustInside = ['Damask rose water', 'Lavender essential oil', 'Calendula extract', 'Chamomile extract', 'Cold-pressed argan oil', 'Plant-derived squalane'];
export const trustNever = ['Parabens', 'Synthetic fragrance', 'Mineral oil', 'Silicones', 'Microplastics'];

// Botanical photos in /public/photos. `focus` crops the argan photo to the kernels.
export const photos = {
  rose: { src: '/photos/rose.jpg' },
  marigold: { src: '/photos/marigold.jpg' },
  lavender: { src: '/photos/lavender.jpg' },
  chamomile: { src: '/photos/chamomile.jpg' },
  argan: { src: '/photos/argan.jpg', focus: { size: '320%', position: '56% 80%' } },
};

export const ingredients = [
  { name: 'Rose water', text: 'Softens and comforts, and gives our creams their quiet scent.', found: 'Barrier Repair Cream', photo: 'rose' },
  { name: 'Calendula', text: 'A golden petal extract that calms skin that feels tight or tired.', found: 'Silk Body Lotion', photo: 'marigold' },
  { name: 'Lavender', text: 'Its essential oil settles skin and helps the ritual feel like rest.', found: 'Overnight Renewal Mask', photo: 'lavender' },
  { name: 'Chamomile', text: 'A soothing extract for skin that reacts to everything.', found: 'Eye Restore Cream', photo: 'chamomile' },
  { name: 'Argan oil', text: 'Cold-pressed from the kernel, it seals in moisture without heaviness.', found: 'Silk Body Lotion', photo: 'argan' },
];

// The "making of" animation: a 23-second scene that plays by itself. `range` is when each caption shows (seconds).
export const MAKING_DURATION = 23;
export const makingCaptions = [
  { eyebrow: 'Gather', title: 'Damask <em>rose</em>', text: 'Petals steeped slowly for their softness and their scent.', photo: 'rose', label: 'Damask rose', range: [0, 4.2] },
  { eyebrow: 'Gather', title: '<em>Calendula</em>', text: 'Golden petals, infused for calm, comfortable skin.', photo: 'marigold', label: 'Calendula', range: [4.2, 6.6] },
  { eyebrow: 'Gather', title: '<em>Lavender</em>', text: 'Distilled for the oil that soothes and settles.', photo: 'lavender', label: 'Lavender', range: [6.6, 8.6] },
  { eyebrow: 'Press', title: 'Cold-pressed <em>argan</em>', text: 'Kernels pressed without heat, then dropped in by hand.', photo: 'argan', label: 'Argan kernels', range: [8.6, 11] },
  { eyebrow: 'Press', title: '<em>Chamomile</em>', text: 'A gentle extract to settle everything the others started.', photo: 'chamomile', label: 'Chamomile', range: [11, 12.4] },
  { eyebrow: 'Blend', title: 'Folded <em>slowly</em>', text: 'Nothing is rushed. Petals and oils become one smooth lotion.', photo: null, range: [12.4, 17.4] },
  { eyebrow: 'Arrive', title: 'Silk Body <em>Lotion</em>', text: 'Rose water, calendula and argan oil, in a bottle built to last.', photo: null, range: [17.4, 999] },
];
export const makingStages = [['Gather', 0, 8.6], ['Press', 8.6, 12.4], ['Blend', 12.4, 17.4], ['Arrive', 17.4, MAKING_DURATION]];
