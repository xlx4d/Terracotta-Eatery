import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 's1',
    name: 'Bo-Kaap Spiced Samosas',
    description: 'Crispy pastry pockets filled with potato, pea, and traditional Cape aromatic spices, served with a tangy apricot chutney.',
    price: 65,
    category: 'starters',
    tag: 'Vegetarian'
  },
  {
    id: 's2',
    name: 'Kalahari Biltong Carpaccio',
    description: 'Thinly sliced premium beef biltong, cured with coriander and black pepper, drizzled with olive oil and wild rocket.',
    price: 95,
    category: 'starters',
    tag: 'Local Favorite'
  },
  {
    id: 's3',
    name: 'Salted Cape Squid',
    description: 'Tender squid rings dusted in Kalahari salt and white pepper, flash-fried and served with a wild garlic aioli.',
    price: 85,
    category: 'starters',
    tag: 'Fresh Catch'
  },
  {
    id: 'm1',
    name: 'Plattekloof Flame-Grilled Lamb Chops',
    description: 'Three local Karoo loin chops rubbed in house terracotta clay spice blend, flame-grilled to medium, served with garlic roasted fingerling potatoes and mint pesto.',
    price: 240,
    category: 'mains',
    tag: 'Signature Item',
    image: '/src/assets/images/dish_lamb_chop_1781223352655.jpg'
  },
  {
    id: 'm2',
    name: 'Artisanal Wood-Fired Mozzarella Pizza',
    description: 'Rustic double-fermented sourdough base, with a rich, reduction of home-grown sweet red tomatoes, thick rounds of fresh buffalo mozzarella, olive oil, and fresh basil.',
    price: 180,
    category: 'mains',
    tag: 'Wood-Fired',
    image: '/src/assets/images/dish_wood_pizza_1781223369034.jpg'
  },
  {
    id: 'm3',
    name: 'Cape Malay Seafood Curry',
    description: 'Assorted fresh line fish, mussels, and squid slow-simmered in a fragrant coconut curry with turmeric, star anise, and ginger, served with savory basmati rice and sambals.',
    price: 210,
    category: 'mains',
    tag: 'Spicy'
  },
  {
    id: 'm4',
    name: 'Karoo Ribeye Steak with Red Chimichurri',
    description: '300g grass-fed ribeye steak aged for 28 days, seared over open coals, served with a bright red pepper chimichurri salsa and crispy sea-salted block chips.',
    price: 295,
    category: 'mains',
    tag: 'Chef Recommendation'
  },
  {
    id: 'd1',
    name: 'Warm Cape Malva Pudding',
    description: 'Traditional apricot-infused sweet caramelized sponge pudding, baked warm and accompanied by rich velvety vanilla bean crème anglaise custard.',
    price: 85,
    category: 'desserts',
    tag: 'Signature Dessert',
    image: '/src/assets/images/dish_malva_pudding_1781223382661.jpg'
  },
  {
    id: 'd2',
    name: 'Rooibos Crème Brûlée',
    description: 'Classic rich cream custard infused with organic Cederberg red espresso, topped with a perfectly cracked caramelized sugar crust.',
    price: 75,
    category: 'desserts',
    tag: 'Local Favorite'
  },
  {
    id: 'dr1',
    name: 'Plattekloof Pinotage Red Wine',
    description: 'A glass of exceptional, full-bodied local Stellenbosch Pinotage, carrying dark berry notes and smoked oak accents.',
    price: 60,
    category: 'drinks'
  },
  {
    id: 'dr2',
    name: 'Traditional Rooibos Iced Tea',
    description: 'House-brewed mountain rooibos tea cold-infused with fresh lemon zest, wild honey, and mint sprigs.',
    price: 40,
    category: 'drinks',
    tag: 'Refreshing'
  },
  {
    id: 'dr3',
    name: 'Cape Craft Ale',
    description: 'Crisp artisanal amber ale brewed locally in Cape Town. Smooth finish with floral citrus hop notes.',
    price: 55,
    category: 'drinks'
  }
];
