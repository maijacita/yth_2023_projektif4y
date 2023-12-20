import { validatePassword } from './passwordValidator'; 

describe('validatePassword function', () => {
  it('should return true for a valid password', () => {
    //8 char, lowUPnumber0special!
    const validPasswords = ['Abcd@123', 'Passw0rd!', 'Secret@789'];
    validPasswords.forEach(password => {
      expect(validatePassword(password)).toBe(true);
    });
  });

  it('should return false for an invalid password', () => {
    // Invalid passwords don't meet the criteria
    const invalidPasswords = ['weakpassword', '12345678', 'nouppercase1!', 'NOLOWERCASE1!', 'Short1!', 'NoSpecialCharacter123'];
    invalidPasswords.forEach(password => {
      expect(validatePassword(password)).toBe(false);
    });
  });
});
