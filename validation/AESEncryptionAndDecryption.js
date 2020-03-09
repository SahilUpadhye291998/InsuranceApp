const crypto = require("crypto");
const encryption_key = require("./../secert/keys").AESSecret_Encryption;
const initialization_vector = require("./../secert/keys").initialization_vector;

module.exports.encryptMethod = user => {
  console.log(user);
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryption_key),
    Buffer.from(initialization_vector)
  );
  let encrypt = cipher.update(user, "utf-8", "hex");
  encrypt += cipher.final("hex");
  return encrypt;
};

// module.exports.decryptMethod = user => {
//   let decipher = crypto.createDecipheriv(
//     "aes-256-cbc",
//     Buffer.from(encryption_key),
//     Buffer.from(initialization_vector)
//   );
//   let decrypt = decipher.update(user, "hex", "utf-8");
//   decrypt += decipher.final("utf-8");
//   return decrypt;
// };
