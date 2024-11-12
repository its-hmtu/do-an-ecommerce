const nodemailer = require('nodemailer');

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  console.log("test account: ",testAccount);
  return testAccount;
}

createTestAccount().then((testAccount) => {
  console.log("user", testAccount.user);
  console.log("pass", testAccount.pass);
}).catch((err) => {
  console.log("error", err);
})