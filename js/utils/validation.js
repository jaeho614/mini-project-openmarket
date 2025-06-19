import { MESSAGES } from "../constants/messages.js";

export class Validator {
  // 구매회원, 판매회원 공통
  static validateUsername(username) {
    if (!username || username.length < 3) {
      return MESSAGES.ERROR.USERNAME_REQUIRED;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return MESSAGES.ERROR.USERNAME_INVALID;
    }
    return null;
  }

  static validatePassword(password) {
    if (!password || password.length < 6) {
      return MESSAGES.ERROR.PASSWORD_REQUIRED;
    }
    return null;
  }

  static validatePasswordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
      return MESSAGES.ERROR.PASSWORD_MISMATCH;
    }
    return null;
  }

  static validateName(name) {
    if (!name || name.trim().length < 2) {
      return MESSAGES.ERROR.NAME_REQUIRED;
    }
    return null;
  }

  static validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return MESSAGES.ERROR.PHONE_REQUIRED;
    }
    if (!/^010\d{7,8}$/.test(phoneNumber)) {
      return MESSAGES.ERROR.PHONE_INVALID;
    }
    return null;
  }

  // 판매회원
  static validateCompanyRegistrationNumber(number) {
    if (!number || number.trim().length === 0) {
      return MESSAGES.ERROR.COMPANY_REQUIRED;
    }
    return null;
  }

  static validateStoreName(storeName) {
    if (!storeName || storeName.trim().length < 2) {
      return MESSAGES.ERROR.STORE_REQUIRED;
    }
    return null;
  }
}
