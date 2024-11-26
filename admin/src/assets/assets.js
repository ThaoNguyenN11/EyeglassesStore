import logo from './logo1.png'
import add_icon from './add_icon.png'
import order_icon from './order_icon.png'
import upload_area from './upload_area.png'
import parcel_icon from './parcel_icon.svg'
import remove_icon from './remove_icon.png'
import edit_icon from './edit_icon.png'
import orders_icon from './orders_icon.png'
import dashboard_icon from './dashboard_icon.png'
import customer_icon from './customert_icon.png'
import product_icon from './product_icon.png'
//gọng kính
import p_c1 from './p_c1.png'
import p_c2 from './p_c2.png'
import p_c3 from './p_c3.png'
import p_c4 from './p_c4.png'
import p_c5 from './p_c5.png'
import p_c6 from './p_c6.png'
import p_c7 from './p_c7.png'
import p_c8 from './p_c8.png'
import p_c9 from './p_c9.png'
import p_c10 from './p_c10.png'
import p_c11 from './p_c11.png'

//phụ kiện
import p_pk1 from './p_pk1.png'
import p_pk2 from './p_pk2.png'
import p_pk3 from './p_pk3.png'
import p_pk4 from './p_pk4.png'
import p_pk5 from './p_pk5.png'
import p_pk6 from './p_pk6.png'
import p_pk7 from './p_pk7.png'
import p_pk8 from './p_pk8.png'
import p_pk9 from './p_pk9.png'
import p_pk10 from './p_pk10.png'

//kính râm
import p_r1 from './p_r1.png'
import p_r2 from './p_r2.png'
import p_r3 from './p_r3.png'
import p_r4 from './p_r4.png'
import p_r5 from './p_r5.png'
import p_r6 from './p_r6.png'
import p_r7 from './p_r7.png'
import p_r8 from './p_r8.png'
import p_r9 from './p_r9.png'
import p_r10 from './p_r10.png'

//tròng kính
import p_t1 from './p_t1.png'
import p_t2 from './p_t2.png'
import p_t3 from './p_t3.png'
import p_t4 from './p_t4.png'
import p_t5 from './p_t5.png'
import p_t6 from './p_t6.png'
import p_t7 from './p_t7.png'
import p_t8 from './p_t8.png'
import p_t9 from './p_t9.png'
import p_t10 from './p_t10.png'


export const assets = {
    logo,
    add_icon,
    order_icon,
    upload_area,
    parcel_icon,
    remove_icon,
    edit_icon,
    dashboard_icon,
    customer_icon,
    product_icon
}

export const products = [
    // Gọng kính 1
{
    _id: "p_c1",
    name: "Classic Round Eyeglass Frame",
    description: "A stylish and durable round eyeglass frame, made from high-quality materials for everyday wear.",
    price: 200,
    image: [p_c1],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Black", "Brown", "Silver"],
    date: 1716634345448,
    bestseller: true
},

// Gọng kính 2
{
    _id: "p_c2",
    name: "Modern Square Eyeglass Frame",
    description: "A contemporary square eyeglass frame designed for both comfort and fashion, suitable for any face shape.",
    price: 220,
    image: [p_c2],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Black", "Gray", "Gold"],
    date: 1716634345449,
    bestseller: false
},

// Gọng kính 3
{
    _id: "p_c3",
    name: "Slim Rectangular Eyeglass Frame",
    description: "A slim and lightweight rectangular eyeglass frame perfect for a minimalistic look.",
    price: 180,
    image: [p_c3],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Blue", "Black", "Transparent"],
    date: 1716634345450,
    bestseller: true
},

// Gọng kính 4
{
    _id: "p_c4",
    name: "Bold Cat-Eye Eyeglass Frame",
    description: "A bold and trendy cat-eye eyeglass frame for those who want to stand out in style.",
    price: 250,
    image: [p_c4],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Red", "Black", "Pink"],
    date: 1716634345451,
    bestseller: false
},

// Gọng kính 5
{
    _id: "p_c5",
    name: "Vintage Round Eyeglass Frame",
    description: "A retro-style round eyeglass frame that brings a vintage touch to your everyday look.",
    price: 210,
    image: [p_c5],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Gold", "Bronze", "Silver"],
    date: 1716634345452,
    bestseller: true
},

// Gọng kính 6
{
    _id: "p_c6",
    name: "Minimalistic Oval Eyeglass Frame",
    description: "A minimalistic and elegant oval eyeglass frame for a refined and classy look.",
    price: 195,
    image: [p_c6],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Black", "White", "Gray"],
    date: 1716634345453,
    bestseller: false
},

// Gọng kính 7
{
    _id: "p_c7",
    name: "Trendy Aviator Eyeglass Frame",
    description: "A trendy aviator-style eyeglass frame that offers a bold and fashionable statement.",
    price: 230,
    image: [p_c7],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Silver", "Black", "Gold"],
    date: 1716634345454,
    bestseller: true
},

// Gọng kính 8
{
    _id: "p_c8",
    name: "Classic Wayfarer Eyeglass Frame",
    description: "A timeless wayfarer-style eyeglass frame that suits all styles and occasions.",
    price: 240,
    image: [p_c8],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Black", "Brown", "Gray"],
    date: 1716634345455,
    bestseller: false
},

// Gọng kính 9
{
    _id: "p_c9",
    name: "Elegant Butterfly Eyeglass Frame",
    description: "An elegant butterfly-shaped eyeglass frame that adds a touch of sophistication.",
    price: 270,
    image: [p_c9],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Purple", "Black", "Blue"],
    date: 1716634345456,
    bestseller: true
},

// Gọng kính 10
{
    _id: "p_c10",
    name: "Chic Oversized Eyeglass Frame",
    description: "A chic and oversized eyeglass frame for a bold, fashionable look.",
    price: 260,
    image: [p_c10],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Black", "Tortoise", "White"],
    date: 1716634345457,
    bestseller: true
},

// Gọng kính 11
{
    _id: "p_c11",
    name: "Geometric Eyeglass Frame",
    description: "A unique geometric eyeglass frame for those who love modern, unconventional designs.",
    price: 225,
    image: [p_c11],
    category: "Eyewear",
    subCategory: "Frames",
    colors: ["Gold", "Black", "Blue"],
    date: 1716634345458,
    bestseller: false
},

// Kính râm 1
{
    _id: "p_r1",
    name: "Classic Polarized Sunglasses",
    description: "A timeless pair of polarized sunglasses that provide excellent UV protection and a stylish look for any occasion.",
    price: 300,
    image: [p_r1],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Black", "Gray", "Brown"],
    date: 1716634345460,
    bestseller: true
},

// Kính râm 2
{
    _id: "p_r2",
    name: "Trendy Cat-Eye Sunglasses",
    description: "Fashion-forward cat-eye sunglasses that add a touch of glamour to your outfit while protecting your eyes.",
    price: 320,
    image: [p_r2],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Red", "Black", "Pink"],
    date: 1716634345461,
    bestseller: false
},

// Kính râm 3
{
    _id: "p_r3",
    name: "Sporty Wrap-Around Sunglasses",
    description: "Designed for active lifestyles, these wrap-around sunglasses provide maximum coverage and comfort.",
    price: 280,
    image: [p_r3],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Black", "Blue", "Gray"],
    date: 1716634345462,
    bestseller: true
},

// Kính râm 4
{
    _id: "p_r4",
    name: "Vintage Round Sunglasses",
    description: "Retro round sunglasses that offer a unique style while providing essential UV protection.",
    price: 290,
    image: [p_r4],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Gold", "Silver", "Green"],
    date: 1716634345463,
    bestseller: false
},

// Kính râm 5
{
    _id: "p_r5",
    name: "Modern Square Sunglasses",
    description: "Stylish square sunglasses that combine modern design with functional UV protection.",
    price: 310,
    image: [p_r5],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Black", "Transparent", "Brown"],
    date: 1716634345464,
    bestseller: true
},

// Kính râm 6
{
    _id: "p_r6",
    name: "Elegant Oversized Sunglasses",
    description: "Chic oversized sunglasses that provide a dramatic look while ensuring complete sun protection.",
    price: 340,
    image: [p_r6],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Black", "Pink", "White"],
    date: 1716634345465,
    bestseller: false
},

// Kính râm 7
{
    _id: "p_r7",
    name: "Aviator Sunglasses",
    description: "Classic aviator sunglasses that provide a cool, laid-back style along with UV protection.",
    price: 350,
    image: [p_r7],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Gold", "Silver", "Black"],
    date: 1716634345466,
    bestseller: true
},

// Kính râm 8
{
    _id: "p_r8",
    name: "Colorful Mirrored Sunglasses",
    description: "Fun and vibrant mirrored sunglasses that are perfect for summer outings and beach days.",
    price: 330,
    image: [p_r8],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Blue", "Red", "Green"],
    date: 1716634345467,
    bestseller: false
},

// Kính râm 9
{
    _id: "p_r9",
    name: "Stylish Wayfarer Sunglasses",
    description: "Versatile wayfarer sunglasses that can be worn for any occasion while offering great UV protection.",
    price: 320,
    image: [p_r9],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Black", "Brown", "Gray"],
    date: 1716634345468,
    bestseller: true
},

// Kính râm 10
{
    _id: "p_r10",
    name: "Sporty Cycling Sunglasses",
    description: "Lightweight cycling sunglasses designed for outdoor activities, providing comfort and UV protection.",
    price: 300,
    image: [p_r10],
    category: "Eyewear",
    subCategory: "Sunglasses",
    colors: ["Black", "Yellow", "Red"],
    date: 1716634345469,
    bestseller: false
},

// Tròng kính 1
{
    _id: "p_t1",
    name: "High-Index Single Vision Lenses",
    description: "Ultra-thin high-index lenses that provide excellent vision correction in a lightweight design.",
    price: 150,
    image: [p_t1],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Clear", "Blue Light Filter"],
    date: 1716634345470,
    bestseller: true
},

// Tròng kính 2
{
    _id: "p_t2",
    name: "Photochromic Lenses",
    description: "Light-sensitive lenses that darken in sunlight and clear indoors, providing comfort and protection.",
    price: 180,
    image: [p_t2],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Gray", "Brown"],
    date: 1716634345471,
    bestseller: false
},

// Tròng kính 3
{
    _id: "p_t3",
    name: "Polarized Lenses",
    description: "Polarized lenses that reduce glare from reflective surfaces, perfect for outdoor activities.",
    price: 200,
    image: [p_t3],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Green", "Gray"],
    date: 1716634345472,
    bestseller: true
},

// Tròng kính 4
{
    _id: "p_t4",
    name: "Blue Light Blocking Lenses",
    description: "Specialized lenses that filter out harmful blue light from screens, reducing eye strain.",
    price: 170,
    image: [p_t4],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Clear", "Yellow Tint"],
    date: 1716634345473,
    bestseller: false
},

// Tròng kính 5
{
    _id: "p_t5",
    name: "Multifocal Lenses",
    description: "Versatile lenses that offer multiple prescriptions in one lens for seamless vision at any distance.",
    price: 250,
    image: [p_t5],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Clear"],
    date: 1716634345474,
    bestseller: true
},

// Tròng kính 6
{
    _id: "p_t6",
    name: "Anti-Reflective Lenses",
    description: "Lenses coated to reduce reflections and glare, enhancing clarity and comfort.",
    price: 160,
    image: [p_t6],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Clear"],
    date: 1716634345475,
    bestseller: false
},

// Tròng kính 7
{
    _id: "p_t7",
    name: "Scratch-Resistant Lenses",
    description: "Durable lenses with a scratch-resistant coating, ideal for everyday wear.",
    price: 140,
    image: [p_t7],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Clear"],
    date: 1716634345476,
    bestseller: true
},

// Tròng kính 8
{
    _id: "p_t8",
    name: "Color-Tinted Lenses",
    description: "Fashionable tinted lenses that add a pop of color while providing UV protection.",
    price: 190,
    image: [p_t8],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Blue", "Green", "Brown"],
    date: 1716634345477,
    bestseller: false
},

// Tròng kính 9
{
    _id: "p_t9",
    name: "High-Performance Sports Lenses",
    description: "Specialized lenses designed for athletes, offering enhanced clarity and impact resistance.",
    price: 220,
    image: [p_t9],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Clear", "Yellow"],
    date: 1716634345478,
    bestseller: true
},

// Tròng kính 10
{
    _id: "p_t10",
    name: "Custom Prescription Lenses",
    description: "Tailor-made prescription lenses that meet your specific vision correction needs.",
    price: 240,
    image: [p_t10],
    category: "Eyewear",
    subCategory: "Lenses",
    colors: ["Clear"],
    date: 1716634345479,
    bestseller: false
},

// Phụ kiện 1: Dây đeo
{
    _id: "p_pk1",
    name: "Adjustable Eyewear Strap",
    description: "A durable and adjustable strap designed to keep your glasses secure and in place during activities.",
    price: 20,
    image: [p_pk1],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["Black", "Red", "Blue"],
    date: 1716634345480,
    bestseller: true
},

// Phụ kiện 2: Khăn lau
{
    _id: "p_pk2",
    name: "Microfiber Cleaning Cloth",
    description: "A soft microfiber cloth that effectively cleans lenses without scratching, ensuring clear vision.",
    price: 10,
    image: [p_pk2],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["Gray", "White", "Blue"],
    date: 1716634345481,
    bestseller: false
},

// Phụ kiện 3: Nước lau kính
{
    _id: "p_pk3",
    name: "Lens Cleaning Spray",
    description: "A gentle cleaning spray specifically formulated for eyeglasses, ensuring streak-free clarity.",
    price: 15,
    image: [p_pk3],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["Transparent"],
    date: 1716634345482,
    bestseller: true
},

// Phụ kiện 4: Bao da dựng kính
{
    _id: "p_pk4",
    name: "Hard Shell Eyewear Case",
    description: "A protective hard shell case designed to keep your glasses safe from scratches and damage.",
    price: 25,
    image: [p_pk4],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["Black", "Brown", "Navy"],
    date: 1716634345483,
    bestseller: true
},

// Phụ kiện 5: Dây đeo (kiểu dáng khác)
{
    _id: "p_pk5",
    name: "Fashion Eyewear Chain",
    description: "A stylish eyewear chain that adds a trendy touch while keeping your glasses secure.",
    price: 30,
    image: [p_pk5],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["Gold", "Silver"],
    date: 1716634345484,
    bestseller: false
},

// Phụ kiện 6: Khăn lau (kiểu dáng khác)
{
    _id: "p_pk6",
    name: "Printed Microfiber Cloth",
    description: "A colorful microfiber cloth with fun designs, perfect for cleaning lenses and expressing your style.",
    price: 12,
    image: [p_pk6],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["Colorful"],
    date: 1716634345485,
    bestseller: true
},

// Phụ kiện 7: Nước lau kính (kiểu dáng khác)
{
    _id: "p_pk7",
    name: "Antibacterial Lens Cleaning Wipes",
    description: "Convenient wipes that clean and disinfect your glasses, perfect for on-the-go use.",
    price: 18,
    image: [p_pk7],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["White"],
    date: 1716634345486,
    bestseller: false
},

// Phụ kiện 8: Bao da dựng kính (kiểu dáng khác)
{
    _id: "p_pk8",
    name: "Soft Eyewear Pouch",
    description: "A soft pouch that protects your glasses from scratches while being lightweight and portable.",
    price: 15,
    image: [p_pk8],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["Pink", "Black"],
    date: 1716634345487,
    bestseller: true
},

// Phụ kiện 9: Dây đeo (kiểu dáng khác)
{
    _id: "p_pk9",
    name: "Silicone Eyewear Strap",
    description: "Comfortable silicone strap designed for secure wear during sports and outdoor activities.",
    price: 22,
    image: [p_pk9],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["Black", "Green"],
    date: 1716634345488,
    bestseller: false
},

// Phụ kiện 10: Khăn lau (kiểu dáng khác)
{
    _id: "p_pk10",
    name: "Custom Printed Cleaning Cloth",
    description: "Personalized microfiber cleaning cloths with custom prints, perfect for branding and gifts.",
    price: 14,
    image: [p_pk10],
    category: "Eyewear",
    subCategory: "Accessories",
    colors: ["Variety"],
    date: 1716634345489,
    bestseller: true
}
]
