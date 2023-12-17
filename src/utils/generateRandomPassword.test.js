import { generateRandomPassword } from './generateRandomPassword'; 

describe('generateRandomPassword function', () => {
  it('should generate a password of the specified length', () => {
    const length = 8; // Change this to the desired password length
    const password = generateRandomPassword(length);

    expect(password).toHaveLength(length);
  });

  it('should generate a password using the correct character set', () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const password = generateRandomPassword(10); // Change the length as needed

    for (const char of password) {
      expect(charset).toContain(char);
    }
  });

  // Add more specific tests as needed based on the requirements of the function
});
