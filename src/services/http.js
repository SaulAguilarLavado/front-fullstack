// HTTP Client (Axios instance)
import axios from 'axios'

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
})

export default httpClient
