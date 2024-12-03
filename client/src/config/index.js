const BASE_PATH = '/'
const BASE_API_PATH = 'http://localhost:5000/api'

const PATHS = {
  HOME: `${BASE_PATH}`,
  LOGIN: `${BASE_PATH}account/login`,
  REGISTER: `${BASE_PATH}account/register`,
  MY_ORDERS: `${BASE_PATH}account/orders`,
  EMAIL_VERIFICATION: `${BASE_PATH}account/verify-email`,
  MOBILE: `${BASE_PATH}mobile-phones`,
  TABLET: `${BASE_PATH}tablet`,
  ACCESSORIES: `${BASE_PATH}accessories`,
  ABOUT_US: `${BASE_PATH}about-us`,
  PRODUCT: `${BASE_PATH}products/:path`,
  NOT_FOUND: '*',
  CONTACT: `${BASE_PATH}contact`,
  CART: `${BASE_PATH}cart`,
  ACCOUNT_PAGE: `${BASE_PATH}account`,
  PAYMENT_INFO: `${BASE_PATH}cart/payment-info`,
  PAYMENT: `${BASE_PATH}cart/payment`,
  CHECKOUT: `${BASE_PATH}checkout`,
  BROWSE_SERIES: `${BASE_PATH}series/:series`,
  BROWSE_BRAND: `${BASE_PATH}brands/:brand`,
}

const API_PATHS = {
  LOGIN: `${BASE_API_PATH}/account/login`,
  REGISTER: `${BASE_API_PATH}/account/register`,
  LOGOUT: `${BASE_API_PATH}/account/logout`,
  USER: `${BASE_API_PATH}/account/me`,
  USER_ORERS: `${BASE_API_PATH}/orders/user`,
  REFRESH: `${BASE_API_PATH}/refresh`,
  PRODUCTS: `${BASE_API_PATH}/products`,
  PRODUCT: `${BASE_API_PATH}/products/slug`,
  PRODUCTS_BY_BRAND: `${BASE_API_PATH}/products/brand`,
  PRODUCTS_BY_SERIES: `${BASE_API_PATH}/products/series`,
  PRODUCTS_BY_CATEGORY: `${BASE_API_PATH}/products/category`,
  SUBMIT_REVIEW: `${BASE_API_PATH}/products/review`,
  SEARCH_PRODUCTS: `${BASE_API_PATH}/products/search`,
  USER_CART: `${BASE_API_PATH}/account/cart`,
  ORDER: `${BASE_API_PATH}/orders`,
  CREATE_CHECKOUT_SESSION: `${BASE_API_PATH}/orders/create-checkout-session`,
  VERIFY_EMAIL: `${BASE_API_PATH}/account/verify-email`,
}

const queryKeys = {
  user: "user",
  products: "products",
  userCart: "userCart",
  userOrders: "userOrders",
}

export {
  PATHS,
  API_PATHS,
  queryKeys,
}