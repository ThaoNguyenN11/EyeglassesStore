import axios from "axios";
import crypto from "crypto"; 
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const createMoMoPayment = async (req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    const userId = req.body.userId;
    const shippingAddress = req.body.shippingAddress;
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:5173/payment-result';
    var ipnUrl = 'https://7f36-2402-800-61c4-e8af-a8ce-bc7b-1420-72dc.ngrok-free.app/api/payment/momo/notify';
    var requestType = "payWithMethod";
    var amount = req.body.amount?.toString() || '50000';;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    const extraData = Buffer.from(JSON.stringify({ userId, shippingAddress })).toString("base64"); // 👈 encode userId

    // var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });
    
    const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody,
    };

    let result;

    try {
        result = await axios.request(options);
        return res.status(200).json({
            success: true,
            message: "Payment created successfully!",
            data: result.data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the payment.",
            error: error.message,
        });
    }
};

const notifyPayment = async (req, res) => {
    const {
        orderId,       // MoMo orderId
        resultCode,
        message,
        amount,
        extraData      // userID bạn truyền khi tạo thanh toán
      } = req.body;
      const decodedData = JSON.parse(Buffer.from(extraData, 'base64').toString());
      const userID = decodedData.userId;
      const shippingAddress = decodedData.shippingAddress;
      const paymentMethod = "MoMo";
    
      if (resultCode !== 0) {
        return res.status(200).send("Payment failed.");
      }    
      try {
        // 🔁 Reuse logic xử lý đơn hàng
        const cart = await Cart.findOne({ userID }); 
    
        if (!cart || cart.items.length === 0) {
          return res.status(400).json({ success: false, message: "Cart is empty" });
        }
    
        const productIDs = cart.items.map(item => item.productID);
        const products = await Product.find({ productID: { $in: productIDs } });
    
        const productMap = {};
        products.forEach(product => {
          productMap[product.productID] = product;
        });
    
        const updatedItems = cart.items.map(item => {
          const product = productMap[item.productID];
          return {
            productID: item.productID,
            quantity: item.quantity,
            color: item.color,
            price: product?.discountedPrice || product?.price
          };
        });
    
        const totalPrice = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 10;
    
        const newOrder = new Order({
          orderID: orderId, // dùng luôn orderId của MoMo
          userID,
          items: updatedItems,
          totalPrice,
          shippingAddress,
          paymentMethod,
          status: "Pending",
          isPaid: true,
        });
    
        await newOrder.save();
        await Cart.deleteOne({ userID });
        
        return res.status(200).send("Payment success & order saved");
      } catch (error) {
        return res.status(500).send("Internal Server Error");
      }
};

export  {createMoMoPayment, notifyPayment};
