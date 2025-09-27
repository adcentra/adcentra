const en = {
  '_.code': 'en',
  '_.name': 'English (en)',

  // Auth & Forms
  auth: {
    login: 'Login',
    signup: 'Sign up',
    signin: 'Sign in',
    signingIn: 'Signing in...',
    creatingAccount: 'Creating account...',
    createAccount: 'Create Account',
    logout: 'Logout',
    welcomeBack: 'Welcome back',
    fullName: 'Full Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    dontHaveAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    byClickingContinue: 'By clicking continue, you agree to our',
    and: 'and',
    activateAccount: 'Activate Account',
    activatingAccount: 'Activating account...',
    accountActivated: 'Account activated successfully!',
    activationToken: 'Activation Token',
    activate: 'Activate',
    invalidActivationToken: 'Invalid activation token',
    activationTokenRequired: 'Activation token is required',
    activationLinkExpired: 'Activation link has expired',
    accountAlreadyActivated: 'Account is already activated',
    proceedToDashboard: 'Proceed to Dashboard',
    checkEmailForActivation: 'Check your email for an activation token',
    didNotReceiveActivationToken: 'Did not receive the activation token?',
    requestNewActivationToken: 'Request a new one',
    sentNewActivationToken: 'A new activation token has been sent to your email',
    enterEmail: 'Enter your email',
    WillSendActivationToken: 'We will send you an activation token to your email',
  },

  // Navigation & Profile
  nav: {
    myAccount: 'My Account',
    userProfile: 'User profile',
  },

  // General UI
  ui: {
    goBackHome: '← Go back home',
    youMustBeLost: 'You must be lost!',
  },

  // Brand & Marketing
  brand: {
    tagline: 'Programmatic ad booking made easy.',
  },

  // Error Messages
  errors: {
    networkError: 'Network error. Please check your internet connection and try again.',
    unauthorizedAccess: 'You are not authorized to access this resource. Please login again.',
    somethingWentWrong: 'Something went wrong. Please try again.',
    errorOccurred: 'An error occurred',
    failedToRefreshToken: 'We could not verify your session. Please login again.',
    loginFailed: 'Login failed. Please try again.',
    registrationFailed: 'Registration failed',
    accountActivationFailed: 'Account activation failed',
    passwordResetRequestFailed: 'Password reset request failed',
    passwordResetFailed: 'Password reset failed',
    failedToGetCurrentUser: 'Failed to get current user',
    invalidResponse: 'Invalid response from server',
    fullNameRequired: 'Full name is required',
    fullNameMaxLength: 'Full name must not be more than 32 characters long',
    emailRequired: 'Email is required',
    invalidEmailAddress: 'Invalid email address',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 8 characters long',
    passwordMaxLength: 'Password must not be more than 72 characters long',
    passwordHasLowercase: 'Password must have atleast 1 lower-case character',
    passwordHasUppercase: 'Password must have atleast 1 upper-case character',
    passwordHasSpecial:
      "Password must have atleast 1 special character ({'!'} {'@'} {'#'} {'$'} {'&'} {'*'})",
    passwordHasDigit: 'Password must have atleast 1 numeric character',
    passwordConfirmation: 'Passwords do not match',
  },
}

export default en
