import { validateEmail } from './emailValidator';

describe('Email Validation', () => {
  it('should validate correct OAMK email addresses', () => {
    // Valid OAMK emails
    expect(validateEmail('example@oamk.fi')).toBe(true);
    expect(validateEmail('test@students.oamk.fi')).toBe(true);
  });

  it('should not validate incorrect OAMK email addresses', () => {
    // Invalid OAMK emails
    expect(validateEmail('invalidemaildomain@oamk.com')).toBe(false);
    expect(validateEmail('wrong@students.otherschool.fi')).toBe(false);
    expect(validateEmail('missingdomain@students.oamk')).toBe(false);
    expect(validateEmail('typoindomain@aomk.fi')).toBe(false);
    expect(validateEmail('typoindomain2@student.oamk.fi')).toBe(false);
  });

  it('should not validate non-OAMK email addresses', () => {
    // Non-OAMK emails
    expect(validateEmail('example@gmail.com')).toBe(false);
    expect(validateEmail('test@otherdomain.org')).toBe(false);
    expect(validateEmail('randomemail@domain.com')).toBe(false);
  });
});
