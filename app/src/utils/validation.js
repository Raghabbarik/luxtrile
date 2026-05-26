export const validateEmail = email => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePhone = phone => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validatePincode = pincode => {
  const pincodeRegex = /^[0-9]{6}$/;
  return pincodeRegex.test(pincode);
};

export const validatePassword = password => {
  return password.length >= 6;
};

export const validatePrice = price => {
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum >= 0;
};

export const validateDuration = duration => {
  const durationNum = parseInt(duration);
  return !isNaN(durationNum) && durationNum >= 15;
};
