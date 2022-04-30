import AES from 'crypto-js/aes'
import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';

export const Encrypt =() =>{
    var ciphertext = CryptoAES.encrypt('my message', 'secret key 123').toString();
    // var _ciphertext = CryptoAES.decrypt(ciphertext.toString(), 'secret key 123');
     console.log(ciphertext);
    
}
export const Decrypt =() =>{
    var ciphertext = CryptoAES.encrypt('my message', 'secret key 123').toString();
    var _ciphertext = CryptoAES.decrypt(ciphertext.toString(), 'secret key 123');
    console.log(_ciphertext.toString(CryptoENC));
    
}