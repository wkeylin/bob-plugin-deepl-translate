import {
  RequestCallbackResponse,
  RequestObject,
  validProvider,
} from '../types/global'

export class Api {
  constructor(private provider: validProvider | null, private token: string) { }

  private get baseUrl(): string {
    switch (this.provider) {
      case 'deepl-pro':
        return 'https://api.deepl.com'

      default:
        return 'https://api-free.deepl.com'
    }
  }

  async request<T = Record<string, unknown>>(
    requestObject: Omit<RequestObject, 'handler' | 'header'>,
  ): Promise<RequestCallbackResponse<T>> {
    try {
      const body: Record<string, any> = {
        ...requestObject.body,
        auth_key: this.token,
      }
      const url = `${this.baseUrl}${requestObject.url}`

      return await $http.request({
        ...requestObject,
        url,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'a-translator-bob/' + process.env.__VERSION__,
        },
        body,
      })
    } catch (e) {
      Object.assign(e, {
        _type: 'network',
        _message: '接口请求错误 ' + e.message,
      })

      throw e
    }
  }
}
