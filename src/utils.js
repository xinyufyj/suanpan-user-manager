import CryptoJS from 'crypto-js'

export function encrypt(text, key) {
  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
    // iv: CryptoJS.enc.Utf8.parse(key),
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

export function decrypt (text, key) {
  let decrypted = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), 
  {
  //iv: CryptoJS.enc.Utf8.parse(iv), 
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7 
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

// return a promise
export function copyTextToClipboard(textToCopy) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
  } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
      });
  }
}