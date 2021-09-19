
const Register = artifacts.require("Register");

module.exports = async function (deployer) {
  // Code goes here...
    await deployer.deploy(Register);
    const register = await Register.deployed();
};