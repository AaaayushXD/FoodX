export const isEmailValid = (email: string): boolean => {
  const collegeDomain = process.env.COLLEGE_DOMAIN;
  return email.endsWith(`@${collegeDomain}`);
};

export const isPasswordValid = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};
