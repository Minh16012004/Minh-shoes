const Groq = require('groq-sdk');
const productService = require('../services/product.service');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SHOP_KNOWLEDGE = `
BẠN LÀ TRỢ LÝ ẢO CỦA SHOP GIÀY. DỰA VÀO THÔNG TIN SAU ĐỂ TRẢ LỜI KHÁCH HÀNG:

## THÔNG TIN SHOP:
- Tên shop: [TÊN SHOP CỦA BẠN]
- Chuyên: Giày thể thao, sneaker, giày da, sandal
- Hotline: 0909 123 456 (8h-22h)

## BẢNG SIZE GIÀY:
- Size 35: 22-22.5cm
- Size 36: 22.5-23cm
- Size 37: 23-23.5cm
- Size 38: 23.5-24cm
- Size 39: 24-24.5cm
- Size 40: 24.5-25cm
- Size 41: 25-25.5cm
- Size 42: 25.5-26cm
- Size 43: 26-26.5cm

## CHÍNH SÁCH GIAO HÀNG:
- Nội thành HN/HCM: 1-2 ngày, phí 30.000đ
- Tỉnh thành khác: 3-5 ngày, phí 35.000đ
- MIỄN PHÍ SHIP cho đơn từ 500.000đ

## CHÍNH SÁCH ĐỔI TRẢ:
- Thời gian: 7 ngày kể từ khi nhận hàng
- Điều kiện: Chưa qua sử dụng, còn nguyên tem mác

## ƯU ĐÃI HIỆN TẠI:
- Giảm 15% cho đơn đầu tiên
- Mua 2 tặng 1 đôi tất cao cấp

CÁCH TRẢ LỜI:
- Nếu khách hỏi về SẢN PHẨM CỤ THỂ (tên giày, giá), hãy dựa vào DANH SÁCH SẢN PHẨM được cung cấp
- Trả lời thân thiện, nhiệt tình
- Dùng emoji phù hợp
`;

exports.chatWithBot = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Tin nhắn không được để trống' 
      });
    }

    // ===== TÌM KIẾM SẢN PHẨM NÕU CẦN =====
    let productContext = '';
    
    // Kiểm tra xem người dùng có hỏi về sản phẩm không
    const productKeywords = ['giày', 'adidas', 'nike', 'giá', 'bao nhiêu', 'mua', 'có không'];
    const isAskingAboutProduct = productKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (isAskingAboutProduct) {
      // Tìm sản phẩm liên quan
      const products = await productService.searchProductByName(message);
      
      if (products.length > 0) {
        productContext = '\n\n## DANH SÁCH SẢN PHẨM HIỆN CÓ:\n';
        products.forEach(product => {
          productContext += `- ${product.name}: ${product.price.toLocaleString('vi-VN')}đ\n`;
          if (product.sizes && product.sizes.length > 0) {
            productContext += `  Size có sẵn: ${product.sizes.join(', ')}\n`;
          }
        });
      }
    }

    const messages = [
      {
        role: 'system',
        content: SHOP_KNOWLEDGE + productContext // Thêm thông tin sản phẩm thật
      },
      ...conversationHistory.slice(-10),
      {
        role: 'user',
        content: message
      }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: false
    });

    const botResponse = completion.choices[0]?.message?.content || 
      'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại!';

    res.json({
      success: true,
      response: botResponse,
      usage: completion.usage
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Quá nhiều yêu cầu. Vui lòng đợi 1 phút.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Có lỗi xảy ra. Vui lòng thử lại sau!'
    });
  }
};