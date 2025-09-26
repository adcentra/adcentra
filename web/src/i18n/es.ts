const es = {
  '_.code': 'es',
  '_.name': 'Español (es)',

  // Auth & Forms
  auth: {
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    signin: 'Iniciar sesión',
    signingIn: 'Iniciando sesión...',
    creatingAccount: 'Creando cuenta...',
    createAccount: 'Crear Cuenta',
    logout: 'Cerrar sesión',
    welcomeBack: 'Bienvenido de nuevo',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    dontHaveAccount: '¿No tienes una cuenta?',
    haveAccount: '¿Ya tienes una cuenta?',
    termsOfService: 'Términos de Servicio',
    privacyPolicy: 'Política de Privacidad',
    byClickingContinue: 'Al hacer clic en continuar, aceptas nuestros',
    and: 'y',
  },

  // Navigation & Profile
  nav: {
    myAccount: 'Mi Cuenta',
    userProfile: 'Perfil de usuario',
  },

  // General UI
  ui: {
    goBackHome: '← Volver al inicio',
    youMustBeLost: '¡Debes estar perdido!',
  },

  // Brand & Marketing
  brand: {
    tagline: 'Reserva de anuncios programáticos hecha fácil.',
  },

  // Error Messages
  errors: {
    networkError: 'Error de red. Por favor, verifica tu conexión a internet y vuelve a intentarlo.',
    unauthorizedAccess:
      'No tienes autorización para acceder a este recurso. Por favor, inicia sesión nuevamente.',
    somethingWentWrong: 'Algo salió mal. Por favor, inténtalo de nuevo.',
    errorOccurred: 'Ocurrió un error',
    failedToRefreshToken: 'No pudimos verificar tu sesión. Por favor, vuelve a iniciar sesión.',
    loginFailed: 'Error al iniciar sesión. Por favor, inténtalo de nuevo.',
    registrationFailed: 'Error en el registro',
    accountActivationFailed: 'Error en la activación de cuenta',
    passwordResetRequestFailed: 'Error en la solicitud de restablecimiento de contraseña',
    passwordResetFailed: 'Error al restablecer la contraseña',
    failedToGetCurrentUser: 'Error al obtener el usuario actual',
    invalidResponse: 'Respuesta inválida del servidor',
    fullNameRequired: 'El nombre completo es obligatorio',
    fullNameMaxLength: 'El nombre completo no debe tener más de 32 caracteres',
    emailRequired: 'El correo electrónico es obligatorio',
    invalidEmailAddress: 'Dirección de correo electrónico inválida',
    passwordRequired: 'La contraseña es obligatoria',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
    passwordMaxLength: 'La contraseña no debe tener más de 72 caracteres',
    passwordHasLowercase: 'La contraseña debe tener al menos 1 carácter en minúscula',
    passwordHasUppercase: 'La contraseña debe tener al menos 1 carácter en mayúscula',
    passwordHasSpecial:
      "La contraseña debe tener al menos 1 carácter especial ({'!'} {'@'} {'#'} {'$'} {'&'} {'*'})",
    passwordHasDigit: 'La contraseña debe tener al menos 1 carácter numérico',
    passwordConfirmation: 'Las contraseñas no coinciden',
  },
}

export default es
