enum Routes {
    Main = '/',
    House = '/house/',
    ActivateAccount = '/activate/:id/:key',
    Logout = '/logout/',
    Casino = '/casino/',
    Slots = '/casino/slots/',
    SlotsGame = '/casino/slots/:id/:gameName', // Parameter in the route
    Auth = '/auth',
    Login = '/auth/login/',
    ForgotPassword = '/auth/forgot-password/',
    ResetPassword = '/auth/resetPassword/:id/:key',
    Signup = '/auth/signup/',
    Account = '/account/',
    AccountNotActivated = '/account-not-activated/',
    PrivacyPolicy = '/privacy-policy/',
    TermsAndConditions = '/terms-and-conditions/'
}

export default Routes
