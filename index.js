const express = require('express');
const app = express();
const cors = require('cors');
const stripe = require('stripe')('sk_test_51P1MHJSDhB1jOYqnJgNF2HrCgGAX579fJ3P02b5t45aweh4EPJyUuXfGuRJ5GsnaT3fGBMRwUcDUYvMm5dQT7ubu00fLZyz4nS');

app.use(express.json());
app.use(cors());

app.post("/api/create-checkout", async (req, res) => {
    const product = req.body;

    const listItems = product.products;
    console.log(product);

    const lineItems = listItems.map((product) => {
        return ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.name
                },
                unit_amount: product.price * 100,
            },
            quantity: product.quantity
        })
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
});

app.listen(7000, () => {
    console.log("server is running on 7000");
});
