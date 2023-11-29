export const validateEmail = (email) => {
    const emailPattern = /@(students\.)?oamk\.fi$/;
    return emailPattern.test(email);
  };