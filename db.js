const config = {
  user: "aeppom",
  password: "B0g0t4.,2020",
  server: "10.90.61.102", // replace this with your IP Server
  database: "AEPPOM",
  port: 1433, // this is optional, by default takes the port 1433
  options: {
    encrypt: true, // this is optional, by default is false
    enableArithAbort: true,
    trustServerCertificate: true
  },
};
module.exports = {config}