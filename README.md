# Online Document Scanning and Uploading with Dynamic Web TWAIN & Node.js

This sample demonstrates how to implement a simple online document scanning and uploading application using [Dynamic Web TWAIN](https://www.dynamsoft.com/web-twain/overview/?utm_content=nav-products) and Node.js.


## Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [Express](https://expressjs.com/)
- [formidable](https://github.com/node-formidable/formidable)
- [Dynamic Web TWAIN License Key](https://www.dynamsoft.com/customer/license/trialLicense?product=dwt)

## How to Run
1. Install the dependent packages:

	```bash
	npm install
	```
 
2. Replace `LICENSE-KEY` in `index.html` with your own license key.
	```html
 	Dynamsoft.DWT.ProductKey = 'LICENSE-KEY';
	```
 
3. Run the server:

	```bash
	node server.js
	```

4. Open `localhost:2024` in your browser.

    ![image](https://www.dynamsoft.com/codepool/img/2024/03/dynamic-web-twain-nodejs-document-scan.png)
