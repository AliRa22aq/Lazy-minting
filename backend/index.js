const express = require("express");
const cors = require("cors");

const { Contract, ethers } = require("ethers")
const addresses = require("./utils/contractAddresses.json");
const abi = require("./utils/abis.json");

const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
var fs = require("fs");

require('dotenv').config()

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


router.get("/", (req, res) => {
    res.send('Hello World from index!')
});

router.post("/handleVoucher", (req, res) => {
    // console.log(req.body);
    const { id, data: reqData } = req.body;
    // save voucher request in DB;

    // console.log("Going to write into existing file");

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return console.error(err);
        }

        let _data = JSON.parse(data);
        // console.log("OLD data: ", _data);
        _data["pending"][id] = reqData;
        // console.log("NEW data: ", _data)

        fs.writeFile('db.json', JSON.stringify(_data), function (err) {
            if (err) {
                return console.error(err);
            }
        });
        // console.log("File updated ")
    });

    res.end("yes");

});

router.get("/getPendingJobs", (req, res) => {

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return console.error(err);
        }

        let _data = JSON.parse(data);
        res.send(JSON.stringify(_data["pending"]));

    });

});

router.get("/getSuccessfull", (req, res) => {

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return console.error(err);
        }

        let _data = JSON.parse(data);
        res.send(JSON.stringify(_data["successfull"]));

    });

});

router.get("/getCancelledJobs", (req, res) => {

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return console.error(err);
        }

        let _data = JSON.parse(data);
        res.send(JSON.stringify(_data["cancelled"]));

    });

});

router.post("/executePendingJobs", async (req, res) => {

    fs.readFile('db.json', 'utf8', async (err, data) => {
        if (err) {
            return console.error(err);
        }

        let _data = JSON.parse(data);


        const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_LINK)
        let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new Contract(addresses.lazyNFT, abi, provider);

        let allPendingJobs = Object.values(_data["pending"]);
        var newSuccessfullJobs = {};
        var newCancelledJobs = {};

        for (let i = 0; i < allPendingJobs.length; i++) {
            let job = allPendingJobs[i];

            try {
                const tx = await contract.connect(wallet).mint(job.voucher);
                await tx.wait(1);

                job = { ...job, tx: tx.hash };
                _data["successfull"][job.userAddress] = job;

            }
            catch (e) {
                console.error("E: ", e);
                // newCancelledJobs = {...newCancelledJobs, ...jobs}
                _data["cancelled"][job.userAddress] = job
                // console.log("newCancelledJobs: ", newCancelledJobs)

            }

        }

        _data["pending"] = {};

        fs.writeFile('db.json', JSON.stringify(_data), function (err) {
            if (err) {
                return console.error(err);
            }

            res.end("yes");
        
        });
        
    });


});

app.use("/", router);

app.listen(8080, () => {
    console.log("Started on PORT 8080");
})