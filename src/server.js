import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { default as gplay } from 'google-play-scraper';
import { default as appStore } from 'app-store-scraper';

const app = express();
app.use(bodyParser.json());

// Read the static token from the environment variable XYZ
const staticAuthToken = process.env.AUTH_TOKEN;

// Ensure that the static token is defined
if (!staticAuthToken) {
    console.error('Error: No static token provided. Set the AUTH_TOKEN environment variable.');
    process.exit(1);
}

const authenticateRequest = (req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken || authToken !== `Bearer ${staticAuthToken}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

app.use(authenticateRequest);

const HTTP_PORT = 8000;
const HTTPS_PORT = 8443;

// Load SSL/TLS certificates
// const privateKey = fs.readFileSync(path.join(__dirname, 'path/to/private-key.pem'), 'utf8');
// const certificate = fs.readFileSync(path.join(__dirname, 'path/to/certificate.pem'), 'utf8');
// const ca = fs.readFileSync(path.join(__dirname, 'path/to/ca.pem'), 'utf8');

const credentials = {
    // key: privateKey,
    // cert: certificate,
    // ca: ca,
};

// Create an HTTPS server
// const httpsServer = https.createServer(credentials, app);

// Listen on both HTTP and HTTPS ports
app.listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on port ${HTTP_PORT}`);
});

// httpsServer.listen(HTTPS_PORT, () => {
//     console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
// });

app.post('/gplay/metadata', (req, res) => {
    var errors=[]
    if (!req.body.package_name){
        errors.push("No package_name specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    let payload = {appId: req.body.package_name}

    if (req.body.country) {
        payload.country = req.body.country
    }

    gplay.app(payload).then(response => res.json(response))
        .catch(err => res.status(404).json({"error":err.toString()}));

});

app.post('/appstore/metadata', (req, res) => {
    var errors=[]
    if (!req.body.package_name){
        errors.push("No package_name specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    let payload = {appId: req.body.package_name}

    if (req.body.country) {
        payload.country = req.body.country
    }

    appStore.app(payload).then(response => res.json(response))
        .catch(err => res.status(404).json({"error":err.toString()}));
});
