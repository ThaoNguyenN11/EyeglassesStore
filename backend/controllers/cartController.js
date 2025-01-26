import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const addToCart = async (req, res) => {
  try {
    const { userID, productID, quantity, color } = req.body;

    // Tìm sản phẩm theo productId (chú ý là productId là chuỗi, không phải ObjectId)
    const product = await Product.findOne({ productID: productID });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Lấy giá của sản phẩm (nếu có giá giảm, dùng giá giảm; không thì dùng giá gốc)
    const price = product.discountedPrice || product.price;

    // Kiểm tra xem giỏ hàng của người dùng đã tồn tại chưa
    let cart = await Cart.findOne({ userID });

    if (!cart) {
      // Nếu chưa có giỏ hàng, tạo giỏ hàng mới
      cart = new Cart({
        userID,
        items: [{ productID: product.productID, quantity, price, color }], // Lưu ObjectId của sản phẩm
      });
    } else {
      // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
      const itemIndex = cart.items.findIndex(item => item.productID.toString() === product.productID.toString() && item.color === color);

      if (itemIndex >= 0) {
        // Nếu sản phẩm đã có, cập nhật số lượng
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = price;
      } else {
        // Nếu sản phẩm chưa có, thêm mới vào giỏ
        cart.items.push({ productID: product.productID, quantity, price, color });
      }
    }

    // Cập nhật tổng giá trị giỏ hàng
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Lưu giỏ hàng vào cơ sở dữ liệu
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding to cart', error });
  }
};

const updateQuantityInCart = async (req, res) => {
  try {
    const { userID, productID, color, quantity } = req.body;

    // Kiểm tra nếu số lượng là hợp lệ (phải > 0)
    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
    }

    // Lấy giỏ hàng của người dùng
    let cart = await Cart.findOne({ userID });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Tìm sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex(item => item.productID.toString() === productID && item.color === color);

    if (itemIndex >= 0) {
      // Cập nhật số lượng nếu sản phẩm có trong giỏ
      cart.items[itemIndex].quantity = quantity;

      // Cập nhật giá lại nếu cần
      const product = await Product.findById(productID);
      const price = product.discountedPrice || product.price;
      cart.items[itemIndex].price = price;
    } else {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    // Cập nhật tổng giá trị giỏ hàng
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating cart', error });
  }
};

const getCart = async (req, res) => {
  try {
    const { userID } = req.params;
    const cart = await Cart.findOne({ userID }).populate('items.productID');

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.forEach(item => {
      item.price = item.productID.discountedPrice || item.productID.price;
    });

    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);  // In ra lỗi nếu có
    res.status(500).json({ success: false, message: 'Error fetching cart', error });
  }
};

//xoa san pham khoi gio hang
const removeFromCart = async (req, res) => {
  try {
    const { userID, productID, color } = req.body;

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userID });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    cart.items = cart.items.filter(
      item => !(item.productID.toString() === productID && item.color === color)
    );

    // Cập nhật tổng giá trị giỏ hàng
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Lưu giỏ hàng vào cơ sở dữ liệu
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing item from cart', error });
  }
};


export { addToCart, getCart, updateQuantityInCart, removeFromCart };
