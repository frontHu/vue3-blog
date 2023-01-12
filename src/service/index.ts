import axios from 'axios'
import { message } from 'ant-design-vue'

const api = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

api.interceptors.request.use((config) => {
  return config
})

enum InnerCode {
  Unauthorized = '000001',
  TokenExpired = '000002',
  Forbidden = '000003',
}

// 返回状态拦截
api.interceptors.response.use(
  (response) => {
    console.log(response, 'response')
    const res = response.data
    console.log(res, 'rrr')
    return res
  },
  (error) => {
    console.error(error.response)
    if (error.toString().indexOf('timeout') !== -1) {
      // 超时
      message.error('网络请求超时，请检查网络连接！')
    } else if (error.response) {
      switch (error.response.status) {
        // http status handler
        case 400: // 客户端请求有误
          message.error('客户端请求有误，请联系管理员！')
          break
        case 401: // 未授权
          message.error('未授权，请联系管理员！')
          break
        case 403: // 禁止访问
          message.error('禁止访问！')
          break
        case 404: // 找不到
          message.error('访问的资源不存在，请稍后重试！')
          break
        case 502: // bad gateway
        case 503: // service unavailable
        case 504: // gateway timeout
          message.error('服务器维护中，请稍后重试！')
          break
        case 500: // 服务器内部错误
        default:
          // const erring = error.response.data.message
          // if (erring) {
          //   message.error(erring)
          // } else {
          //   message.error('系统内部错误！')
          // }
          break
      }
    }
    return Promise.reject(error.response)
  }
)

type IndexType = string | number | symbol;
type PlainObject<K extends IndexType = string, V = unknown> = Record<K, V>;
interface CommonResponse<T = unknown> {
  code: string;
  extra?: PlainObject | null;
  msg?: string;
  data?: T | T[];
}

export class API_SERVICE {
  private feature: string;

  constructor (feature: string) {
    this.feature = feature
  }

  // get
  protected get<T extends CommonResponse> (action: string, params: PlainObject = {}, config: PlainObject = {}): any {
    return api.get(`/${this.feature}/${action}`, {
      ...config,
      params: params
    })
  }

  /// post请求
  protected post<T extends CommonResponse> (action: string, params: PlainObject = {}, config: PlainObject = {}): any {
    return api.post(`/${this.feature}/${action}`, params, config)
  }
}

export default API_SERVICE
