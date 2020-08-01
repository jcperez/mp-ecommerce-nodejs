var express = require('express');
var exphbs = require('express-handlebars');
var axios = require('axios');
var bodyParser = require('body-parser')



var TOKEN = process.env.ACCESS_TOKEN;

var app = express();

app.use(bodyParser.json())


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get('/success', function (req, res) {
    res.render('success', req.query);
});

app.get('/pending', function (req, res) {
    res.render('pending', req.query);
});

app.get('/failure', function (req, res) {
    res.render('failure', req.query);
});

app.post('/webhook', function (req, res) {
    console.log(JSON.stringify(req.body));
    res.sendStatus(200);
});

app.get('/checkout', function (req, res) {
    const { img, title, price } = req.query;
    
    const payload = {
        items: [
            {
                id: "1234",
                title: title,
                description: "Dispositivo móvil de Tienda e-commerce",
                quantity: 1,
                currency_id: "MXN",
                unit_price: Number(price),
                picture_url: img,

            }
        ],
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "amex"
                }
            ],
            excluded_payment_types: [
                {
                    id: "atm"
                }
            ],
            installments: 6
        },
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_58295862@testuser.com",
            phone: {
                area_code: "52",
                number: "5549737300"
            },
            address: {
                street_name: "Insurgentes Sur",
                street_number: "1602",
                zip_code: "03940",
            }
        },
        back_urls: {
            success: "https://jcperez-mp-commerce-nodejs.herokuapp.com/success",
            pending: "https://jcperez-mp-commerce-nodejs.herokuapp.com/pending",
            failure: "https://jcperez-mp-commerce-nodejs.herokuapp.com/failure"
        },
        notification_url: "https://jcperez-mp-commerce-nodejs.herokuapp.com/webhook",
        auto_return: "approved",
        external_reference: "j.perez@outlook.com"
    };


    axios.post('https://api.mercadopago.com/checkout/preferences?access_token=' + TOKEN, payload)
        .then(function (response) {
            res.redirect(response.data.init_point);
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 3000);