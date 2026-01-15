import Razorpay from 'razorpay';

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



    const createOrder = async (amount) => {
        const order = await instance.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            notes   :{
                
            }
        });
        return order;
    }
    const verifyPayment = async (orderId, paymentId) => {
        const payment = await instance.payments.verify(orderId, paymentId);
        return payment;
    }

export default instance;
