export function ConvertToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      // When the file is successfully read, resolve the promise with the Base64 string
      reader.onloadend = () => {
        resolve(reader.result);
      };
  
      // If there's an error reading the file, reject the promise
      reader.onerror = (error) => {
        reject(error);
      };
  
      // Read the file as a data URL (Base64)
      reader.readAsDataURL(file);
    });
  }
  