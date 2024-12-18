export enum END_POINT  {
    login = "auth/login",
    logout = "api/v1/logout",
    create_new_product = "/quiz",
    get_all_products = "api/v1/products",
    auth_user_products = "api/v1/products/shop",
    auth_user_shop= "api/v1/shops/user",
    domain_user_shop ="/api/v1/shops/subdomain/",
    shop= "api/v1/shops",
    upload_image = "api/v1/upload",
    create_category = "category",
    get_all_category = "category",
    get_quiz_by_category = "quiz",
    create_shop = "api/v1/shops",
    create_user = "api/v1/register",
    create_customer = "api/v1/customers",
    customer = "api/v1/customers",
    senOTP ="api/v1/email/resend",
    verifyOTP ="api/v1/email/verify",
    check_email = "api/v1/checkemail",
    update_profile = "/api/v1/updateProfile/",
    update_shop="/api/v1/shops/",
    order="api/v1/orders",
}


export enum SECURITY_END_POINT  {
    key = "security/key",
    register = "users",
    login = "auth/login",
    fileUpload = "file/upload",
    files="file/myfile"
}