const { formatDate } = require("../helpers");

module.exports = async (browser, url) => {
  const newPage = await browser.newPage();

  await newPage.goto(url);
  await newPage.waitFor(500);

  console.info(formatDate(new Date()), "track");

  await newPage.evaluate(() => {
    window.pendo.setGuidesDisabled(true);
    window.pendo.stopGuides(true);

    const fileNames = ["invoice.txt", "list.txt", "contact.txt", "account.txt"];
    let num = Math.floor(Math.random() * 4);
    let paymentNum = Math.floor(Math.random() * 8);
    let selection = fileNames[num];

    console.info(selection);

    // Track file download with file metadata
    const fileExtension = selection.split(".").pop();
    window.pendo.track("File Downloaded", {
      filename: selection,
      fileType: fileExtension,
      fileSize: String(Math.floor(Math.random() * 1000) + 1) + "KB",
    });

    // Track first payment flow
    const paymentAmount = String((Math.random() * 500 + 10).toFixed(2));
    const paymentMethods = ["credit_card", "bank_transfer", "paypal"];
    const paymentMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    window.pendo.track("Payment Initiated", {
      paymentAmount: paymentAmount,
      paymentMethod: paymentMethod,
      currency: "USD",
    });
    window.pendo.track("Payment Succeeded", {
      paymentAmount: paymentAmount,
      paymentMethod: paymentMethod,
      currency: "USD",
      transactionId: "txn_" + Date.now(),
    });

    // Track optional second payment flow
    if (paymentNum > 3) {
      const secondAmount = String((Math.random() * 500 + 10).toFixed(2));
      const secondMethod =
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      window.pendo.track("Payment Initiated", {
        paymentAmount: secondAmount,
        paymentMethod: secondMethod,
        currency: "USD",
      });

      if (paymentNum === 7) {
        const failureReasons = [
          "insufficient_funds",
          "card_declined",
          "expired_card",
        ];
        window.pendo.track("Payment Failed", {
          paymentAmount: secondAmount,
          paymentMethod: secondMethod,
          currency: "USD",
          failureReason:
            failureReasons[Math.floor(Math.random() * failureReasons.length)],
        });
      } else {
        window.pendo.track("Payment Succeeded", {
          paymentAmount: secondAmount,
          paymentMethod: secondMethod,
          currency: "USD",
          transactionId: "txn_" + Date.now(),
        });
      }
    }

    window.pendo.flushNow();
  });

  await newPage.close();

  console.info(formatDate(new Date()), "done");
};
