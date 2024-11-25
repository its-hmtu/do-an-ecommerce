const BASE_PATH = '/'
const BASE_API_PATH = 'http://localhost:5000/api'

const PATHS = {
  HOME: `${BASE_PATH}`,
  LOGIN: `${BASE_PATH}account/login`,
  REGISTER: `${BASE_PATH}account/register`,
  MOBILE: `${BASE_PATH}mobile`,
  TABLET: `${BASE_PATH}tablet`,
  ACCESSORIES: `${BASE_PATH}accessories`,
  ABOUT_US: `${BASE_PATH}about-us`,
  PRODUCT: `${BASE_PATH}products/:path`,
  NOT_FOUND: '*',
  CONTACT: `${BASE_PATH}contact`,
}

const API_PATHS = {
  LOGIN: `${BASE_API_PATH}/account/login`,
  REGISTER: `${BASE_API_PATH}/account/register`,
  LOGOUT: `${BASE_API_PATH}/account/logout`,
  USER: `${BASE_API_PATH}/account/me`,
  REFRESH: `${BASE_API_PATH}/refresh`,
  PRODUCTS: `${BASE_API_PATH}/products`,
  PRODUCT: `${BASE_API_PATH}/products/slug`,
  SUBMIT_REVIEW: `${BASE_API_PATH}/products/review`,
}

const queryKeys = {
  user: "user",
  products: "products"
}

export {
  PATHS,
  API_PATHS,
  queryKeys,
}