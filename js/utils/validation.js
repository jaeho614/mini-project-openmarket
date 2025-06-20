import { MESSAGES } from "../constants/messages.js";

export class SignupValidator {
  // 아이디 유효성 검사
  static validateUsername(username) {
    if (!username || username.trim() === "") {
      return MESSAGES.ERROR.FIELD_REQUIRED;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username) || username.length > 20) {
      return MESSAGES.ERROR.USERNAME_INVALID;
    }

    return null;
  }

  // 비밀번호 유효성 검사
  static validatePassword(password) {
    if (!password || password.trim() === "") {
      return MESSAGES.ERROR.FIELD_REQUIRED;
    }

    if (password.length < 8) {
      return MESSAGES.ERROR.PASSWORD_TOO_SHORT;
    }

    if (!/[a-z]/.test(password)) {
      return MESSAGES.ERROR.PASSWORD_NO_LOWERCASE;
    }

    if (!/[0-9]/.test(password)) {
      return MESSAGES.ERROR.PASSWORD_NO_NUMBER;
    }

    return null;
  }

  // 비밀번호 확인 검사
  static validatePasswordMatch(password, confirmPassword) {
    if (!confirmPassword || confirmPassword.trim() === "") {
      return MESSAGES.ERROR.FIELD_REQUIRED;
    }

    if (password !== confirmPassword) {
      return MESSAGES.ERROR.PASSWORD_NOT_MATCH;
    }

    return null;
  }

  // 이름 유효성 검사
  static validateName(name) {
    if (!name || name.trim().length < 2) {
      return MESSAGES.ERROR.NAME_REQUIRED;
    }
    return null;
  }

  // 전화번호 유효성 검사
  static validatePhoneNumber(phoneNumber) {
    if (!phoneNumber || phoneNumber.trim() === "") {
      return MESSAGES.ERROR.FIELD_REQUIRED;
    }

    if (!/^010\d{7,8}$/.test(phoneNumber)) {
      return MESSAGES.ERROR.PHONE_INVALID;
    }

    return null;
  }

  // 판매회원
  // 사업자 등록번호 유효성 검사
  static validateCompanyRegistrationNumber(registrationNumber) {
    if (!registrationNumber || registrationNumber.trim() === "") {
      return MESSAGES.ERROR.FIELD_REQUIRED;
    }

    if (!/^\d{10}$/.test(registrationNumber)) {
      return MESSAGES.ERROR.COMPANY_REGISTRATION_INVALID;
    }

    return null;
  }

  // 스토어 이름 유효성 검사
  static validateStoreName(storeName) {
    if (!storeName || storeName.trim() === "") {
      return MESSAGES.ERROR.FIELD_REQUIRED;
    }

    return null;
  }
}

export class LoginValidator {
  // 아이디 유효성 검사
  static validateUsername(username) {
    if (!username || username.trim() === "") {
      return MESSAGES.ERROR.FIELD_REQUIRED;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username) || username.length > 20) {
      return MESSAGES.ERROR.LOGIN_WRONG_USERNAME;
    }

    return null;
  }

  // 비밀번호 유효성 검사
  static validatePassword(password) {
    if (!password || password.trim() === "") {
      return MESSAGES.ERROR.FIELD_REQUIRED;
    }

    if (
      password.length < 8 ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return MESSAGES.ERROR.LOGIN_WRONG_PASSWORD;
    }

    return null;
  }
}
