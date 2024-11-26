
/*
//add product
// const addProduct = async (req, res) =>{
//     try {
//         const{name, description, price, category, subCategory, color, bestSeller, date} = req.body;

import productModel from "../models/productModel.js";

//         const image1 = req.files.image1[0];
//         const image2 = req.files.image2[0];
//         const image3 = req.files.image3[0];
//         const image4 = req.files.image4[0];

//         console.log(name, description, price, category, subCategory, color, bestSeller, date)
//         console.log(image1, image2, image3, image4);
        
//         res.json({})
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: error.message})
//     }
// }

const addProduct = async (req, res) => {
    try {
        // Lấy thông tin từ body và file
        const { name, description, price, category, subCategory, color, bestSeller, date } = req.body;

        // Kiểm tra các file đã được gửi
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        // if (!image1 || !image2 || !image3 || !image4) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "All images (image1, image2, image3, image4) are required.",
        //     });
        // }

        // In ra thông tin để kiểm tra
        console.log("Product Details:");
        console.log("Name:", name);
        console.log("Description:", description);
        console.log("Price:", price);
        console.log("Category:", category);
        console.log("Subcategory:", subCategory);
        console.log("Colors:", color);
        console.log("Best Seller:", bestSeller);
        console.log("Date:", date);

        // In ra thông tin các hình ảnh
        console.log("Image 1:", image1);
        console.log("Image 2:", image2);
        console.log("Image 3:", image3);
        console.log("Image 4:", image4);

        // Trả về phản hồi thành công
        res.json({ success: true, message: "Product added successfully" });

        const newProduct = new productModel({
            name,
            description,price,bestSeller,category,subCategory,date
        })

        const product = await newProduct.save() 
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//list products
const listProducts = async (req, res) =>{

}

//remove product
const removeProduct = async (req, res) =>{

}

//single product information
const singleProduct = async (req, res) =>{

}

export {addProduct, listProducts, removeProduct, singleProduct}
*/

import productModel from "../models/productModel.js";

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { productId, productName, category, subCategory, color, material, salePrice, description, bestSeller } = req.body;

        // Kiểm tra xem tất cả các trường có được gửi không
        if (!productId || !productName || !category || !subCategory || !salePrice || !description || !material) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Tạo sản phẩm mới
        const newProduct = new productModel({
            productId,
            productName,
            category,
            subCategory,
            color,
            material,
            salePrice,
            description,
            bestSeller,
        });

        // Lưu sản phẩm vào cơ sở dữ liệu
        await newProduct.save();
        res.status(201).json({ success: true, message: "Product added successfully!", data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding product", error: error.message });
    }
};

// Remove a product by ID
const removeProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Lấy ID từ URL

        // Tìm và xóa sản phẩm
        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found!',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product removed successfully!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while removing the product.',
        });
    }
};



// List all products
const listProducts = async (req, res) => {
    try {
        // Lấy tất cả các sản phẩm
        const products = await productModel.find();

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error listing products", error: error.message });
    }
};

// Get single product information by ID
const singleProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Lấy productID từ URL
        const product = await productModel.findOne({ productId }); // Tìm sản phẩm theo productID

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found!',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the product.',
        });
    }
};

const editProduct = async (req, res) => {
    try {
        const { productId } = req.params; // Lấy productID từ URL
        const updates = req.body; // Lấy thông tin cập nhật từ body

        // Tìm và cập nhật sản phẩm theo productID
        const updatedProduct = await productModel.findOneAndUpdate(
            { productId },
            updates,
            { new: true, runValidators: true } // `new` để trả về document sau khi cập nhật, `runValidators` để kiểm tra validation
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found!',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully!',
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the product.',
        });
    }
};


export { addProduct, removeProduct, listProducts, singleProduct, editProduct };
