const BASE_PATH = '/'
const BASE_API_PATH = 'http://localhost:5000/api'

const PATHS = {
  HOME: `${BASE_PATH}`,
  LOGIN: `${BASE_PATH}account/login`,
  REGISTER: `${BASE_PATH}account/register`,
}

const API_PATHS = {
  LOGIN: `${BASE_API_PATH}/account/login`,
  USER: `${BASE_API_PATH}/account/me`,
  REFRESH: `${BASE_API_PATH}/refresh`,
}

const queryKeys = {
  
}

export {
  PATHS,
  API_PATHS,
  queryKeys,
}