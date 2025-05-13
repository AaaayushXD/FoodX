export const allFieldsRequired = (
  RegisterValue: Auth.ValidationType,
  error: Record<keyof Auth.ValidationType, string>
) => {
  for (const inputValue in RegisterValue) {
    if (
      Object.prototype.hasOwnProperty.call(RegisterValue, inputValue) &&
      RegisterValue[inputValue as keyof Auth.ValidationType] === ""
    )
      error[inputValue as keyof Auth.ValidationType] = `All are required`;
  }

  if (Object.keys(error).length !== 0) {
    return error;
  }
};

export const checkValidNumber = (
  registervalue: Auth.ValidationType,
  error: Record<keyof Auth.ValidationType, string>
) => {
  if (registervalue.phoneNumber === "") {
    return (error.phoneNumber = "Required");
  }
  if (registervalue.phoneNumber && registervalue.phoneNumber.length < 10) {
    return (error.phoneNumber = "Invalid Number");
  }
};

export const checkPassword = (
  registerValue: Partial<Auth.ValidationType>,
  error: Partial<Record<keyof Auth.ValidationType, string>>
) => {
  if (!registerValue.password && !registerValue.confirmPassword) {
    error.password = "Required";
    error.confirmPassword = "Required";
    return;
  }

  const passkey =
    registerValue.password?.trim() && registerValue?.confirmPassword && registerValue.confirmPassword.trim();

  if (registerValue.password !== registerValue.confirmPassword) {
    error.password = "Password does not match";
    error.confirmPassword = "Password does not match";
    return;
  }

  //Regular Expression
  const lowerCase = new RegExp("(?=.*[a-z])");
  const upperCase = new RegExp("(?=.*[A-Z])");
  const digit = new RegExp("(?=.*\\d)");
  const special = new RegExp("(?=.*[!@#$%^&*])");

  if (!lowerCase.test(passkey as string)) {
    error.password = "Must contain a lowercase character.";
    error.confirmPassword = "Must contain a lowercase character.";
    return;
  }

  if (!upperCase.test(passkey as string)) {
    error.password = "Must contain an uppercase character.";
    error.confirmPassword = "Must contain an uppercase character.";
  }

  if (!digit.test(passkey as string)) {
    error.password = "Must contain a digit.";
    error.confirmPassword = "Must contain a digit.";
    return;
  }
  if (!special.test(passkey as string)) {
    error.password = "Must contain a special character [! @ # $ % ^ & *].";
    error.confirmPassword =
      "Must contain a special character [! @ # $ % ^ & *].";
    return;
  }
  if (
   registerValue?.password &&  registerValue?.password.length < 8 &&
    registerValue?.confirmPassword &&  registerValue.confirmPassword.length < 8
  ) {
    error.password = "Password atleast contains 8 characters";
    error.confirmPassword = "Password atleast contains 8 characters";
    return;
  } else {
    error.password = "";
    error.confirmPassword = "";
    return;
  }
};

export const checkPasswordValidation = (
  registerValue: Partial<Auth.ValidationType>,
  error: Partial<Record<keyof Auth.ValidationType, string>>
) => {
  if (!registerValue.password) {
    error.password = "Required";
    return;
  }

  const passkey = registerValue.password?.trim();

  //Regular Expression
  const lowerCase = new RegExp("(?=.*[a-z])");
  const upperCase = new RegExp("(?=.*[A-Z])");
  const digit = new RegExp("(?=.*\\d)");
  const special = new RegExp("(?=.*[!@#$%^&*])");

  if (!lowerCase.test(passkey)) {
    error.password = "Must contain a lowercase character.";
    return;
  }

  if (!upperCase.test(passkey)) {
    error.password = "Must contain an uppercase character.";
  }

  if (!digit.test(passkey)) {
    error.password = "Must contain a digit.";
    return;
  }
  if (!special.test(passkey)) {
    error.password = "Must contain a special character [! @ # $ % ^ & *].";

    return;
  }
  if (registerValue.password.length < 8) {
    error.password = "Password atleast contains 8 characters";
    return;
  } else {
    error.password = "";
    error.confirmPassword = "";
    return;
  }
};
