export const MESSAGES = {
  ERROR: {
    // 공통 필드
    FIELD_REQUIRED: "필수 정보입니다.",

    // 아이디
    USERNAME_INVALID:
      "ID는 20자 이내의 영어 소문자, 대문자, 숫자만 가능합니다.",
    USERNAME_EXISTS: "해당 사용자 아이디는 이미 존재합니다.",

    // 비밀번호
    PASSWORD_TOO_SHORT: "비밀번호는 8자 이상이어야 합니다.",
    PASSWORD_NO_LOWERCASE:
      "비밀번호는 한개 이상의 영소문자가 필수적으로 들어가야 합니다.",
    PASSWORD_NO_NUMBER:
      "비밀번호는 한개 이상의 숫자가 필수적으로 들어가야 합니다.",
    PASSWORD_NOT_MATCH: "비밀번호가 일치하지 않습니다.",

    // 이름
    NAME_REQUIRED: "이름은 2자 이상이어야 합니다.",

    // 전화번호
    PHONE_INVALID:
      "핸드폰 번호는 01*으로 시작해야 하는 10~11자리 숫자여야 합니다.",
    PHONE_EXISTS: "해당 사용자 전화번호는 이미 존재합니다.",

    // 사업자 등록번호
    COMPANY_REGISTRATION_INVALID: "사업자 등록번호는 10자리 숫자여야 합니다.",
    COMPANY_REGISTRATION_EXISTS: "해당 사업자등록번호는 이미 존재합니다.",

    // 스토어 이름
    STORE_NAME_EXISTS: "해당 스토어 이름은 이미 존재합니다.",

    // 로그인
    LOGIN_FAILED: "로그인에 실패했습니다.",
    LOGIN_REQUIRED: "로그인이 필요한 서비스입니다.",
    ALREADY_LOGIN: "이미 로그인이 되어있습니다.",
    LOGIN_WRONG_USERNAME: "아이디를 확인해주세요.",
    LOGIN_WRONG_PASSWORD: "비밀번호를 확인해주세요.",

    // 회원가입
    SIGNUP_FAILED: "회원가입에 실패했습니다.",

    // 네트워크
    NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  },
  SUCCESS: {
    USERNAME_AVAILABLE: "멋진 아이디네요 :)",
    PHONE_AVAILABLE: "사용 가능한 번호입니다 :)",
    LOGIN_SUCCESS: "로그인되었습니다.",
    SIGNUP_SUCCESS: "회원가입이 완료되었습니다.",
  },
  LOADING: {
    LOGIN: "로그인 중...",
    SIGNUP: "가입 중...",
    VALIDATING: "확인 중...",
  },
};
