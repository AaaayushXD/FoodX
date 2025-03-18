export interface ChangePasswordType {
 newPassword: string;
 confirmNewPassword: string;
}

export const allFieldsRequired = (
 RegisterValue: Auth.Register,
 error: Record<string, string>
) => {
 for (const inputValue in RegisterValue) {
   if (
     Object.prototype.hasOwnProperty.call(RegisterValue, inputValue) &&
     RegisterValue[inputValue as keyof Auth.Register] === ""
   )
     error[inputValue] = `All are required`;
 }

 if (Object.keys(error).length !== 0) {
   return error;
 }
};

export const checkValidNumber = (
 registervalue: Auth.Register,
 error: Record<string, string>
) => {
 if (registervalue.phoneNumber === "") {
   return (error.number = "*Required");
 }
 if (registervalue.phoneNumber && registervalue.phoneNumber.length < 10) {
   return (error.number = "Invalid Number");
 }
};

export const checkPassword = (
 password: ChangePasswordType,
 error: Record<string, string>
) => {
 if (!password.newPassword && !password.confirmNewPassword) {
   error.oldPassword = "*required";
   error.newPassword = "*required";
   error.confirmNewPassword = "*required";
   return;
 }

 const passkey =
   password.newPassword?.trim() && password.confirmNewPassword.trim();

 //Regular Expression
 const lowerCase = new RegExp("(?=.*[a-z])");
 const upperCase = new RegExp("(?=.*[A-Z])");
 const digit = new RegExp("(?=.*\\d)");
 const special = new RegExp("(?=.*[!@#$%^&*])");

 if (!lowerCase.test(passkey)) {
   error.oldPassword = "Must contain a lowercase character.";
   error.newPassword = "Must contain a lowercase character.";
   error.confirmNewPassword = "Must contain a lowercase character.";
   return;
 }

 if (!upperCase.test(passkey)) {
   error.oldPassword = "Must contain an uppercase character.";
   error.newPassword = "Must contain an uppercase character.";
   error.confirmNewPassword = "Must contain an uppercase character.";
 }

 if (!digit.test(passkey)) {
   error.oldPassword = "Must contain a digit.";
   error.newPassword = "Must contain a digit.";
   error.confirmNewPassword = "Must contain a digit.";
   return;
 }
 if (!special.test(passkey)) {
   error.oldPassword = "Must contain a special character [! @ # $ % ^ & *].";
   error.newPassword = "Must contain a special character [! @ # $ % ^ & *].";
   error.confirmNewPassword =
     "Must contain a special character [! @ # $ % ^ & *].";
   return;
 }
 if (
   password.newPassword.length < 8 &&
   password.confirmNewPassword.length < 8
 ) {
   error.password = "Password atleast contains 8 characters";
   error.oldPassword = "Password atleast contains 8 characters";
   error.confirmNewPassword = "Password atleast contains 8 characters";
   return;
 }
 if (password.newPassword !== password.confirmNewPassword) {
   return (error.password = "password does not match");
 }
};
