import { Fn, UnionKeys } from './general';
import { Maybe } from './maybe';
import {setSensitiveData,getSensitiveData ,LocalStorageKey} from './local-storage'






const createUrl = (path: string) => `${"https://adopteriotwebapi.eaton.com/api/v1/"}/${path}`;
const createUrlWrapper = (path: string) => `${"https://qavulcanwebapi.azure-api.net/api/v1/"}/${path}`;

//https://qavulcanwebapi.azure-api.net/v1/security/token?subscription-key=5f4b64441c12445c922496c1c61a202e'
//https://qavulcanwebapi.azure-api.net
//https://adopteriotwebapi.eaton.com/api/v1/accesscontrol/adopters/410c4c76-b5f6-406c-b870-7a99ed70ac74/users
export enum HttpMethod {
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  GET = 'GET',
  DELETE = 'DELETE'
}

type StatusCodes = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 500 | 501 | 503  ;
//type GenericCode = '440000'

type StatusCodeMap = { [K in StatusCodes]: { status: K,errorMessage:string } };

//type GenericCodeMap =  { [K in GenericCode]: { status: K,errorObj:ServerError } };

type GeneralResponseMapping = {
  [key: number]: (...args: Array<any>) => any;
};

export type StatusCodeMapping<TResponseMappings extends GeneralResponseMapping> = {
  [K in keyof TResponseMappings]: TResponseMappings[K] extends Fn<any, infer TOut> ? { status: K; payload: TOut} : { status: number }
};

type SendResponse<TResponses extends {}> = Promise<Maybe<UnionKeys<StatusCodeMapping<TResponses> & StatusCodeMap >>>;

type Optionals = Partial<{
  body: any;
  queryParams: string;
}>;

export class HttpRequest<TResponses extends GeneralResponseMapping = {}> {
  public static get(endpoint: string) {
    return new HttpRequest(HttpMethod.GET, endpoint);
  }
  public static delete(endpoint: string) {
    return new HttpRequest(HttpMethod.DELETE, endpoint);
  }
  public static patch(endpoint: string) {
    return new HttpRequest(HttpMethod.PATCH, endpoint);
  }
  public static post(endpoint: string) {
    return new HttpRequest(HttpMethod.POST, endpoint);
  }
  public static put(endpoint: string) {
    return new HttpRequest(HttpMethod.PUT, endpoint);
  }

  private readonly method: HttpMethod;
  private readonly endpoint: string;
  private responseMappings: TResponses;
  private responseValidators: { [statusCode: number]: Fn<any, any> };
  private body?: any;
  private queryParams?: string;

  private constructor(method: HttpMethod, endpoint: string, optionals: Optionals = {}) {
    this.method = method;
    this.endpoint = endpoint;

    this.responseMappings = {} as TResponses;
    this.responseValidators = {};

    if (optionals) {
      this.body = optionals.body;
      this.queryParams = optionals.queryParams;
    }
  }

 



  private getOptionals(): Optionals {
    return {
      body: this.body,
      queryParams: this.queryParams
    };
  }

  

  public mapResponse(): HttpRequest<TResponses> {
    const newRequest = new HttpRequest<TResponses>(this.method, this.endpoint, this.getOptionals());
    newRequest.responseMappings = (<any>Object).assign({}, this.responseMappings, {
      204: undefined,
     });
    newRequest.responseValidators = (<any>Object).assign({}, this.responseValidators, {
      204: undefined,
      });

    return newRequest;
  }

  public withQueryParams(params: { [k: string]: string | number | boolean }): HttpRequest<TResponses> {
    const keys = Object.keys(params);
    if (keys.length) {
      this.queryParams = '?' + keys.map(key => `${key}=${params[key]}`).join('&');
    }
    return this;
  }

  public withBody<TBody>(body: TBody): HttpRequest<TResponses> {
    this.body = body;

    return this;
  }

  public async send(successCallBack: (message:string) =>void,failedCallBack: (message:string) =>void,expectedstatus:Number){
  
    const endpoint = this.endpoint + (this.queryParams || '');
     // jwt.map(token => ({ Authorization: `Bearer ${token}` })).or(() => ({}))
      const response = await fetch(createUrl(endpoint), {
        method: this.method,
        headers: (<any>Object).assign(
          { 'Content-Type': 'application/json' },
          
          await this.getTokenJSON()
          // jwt.map(token => ({ Authorization: `Bearer ${token}` })).or(() => ({}))
        ),
        body: JSON.stringify(this.body)
      })

       const status = response.status;
      
        // const responseBody = await response.clone().json();
       
        // console.log("response "+ JSON.stringify(responseBody))
    
        const mapper = this.responseMappings[status];
        try {
      if (status ==  expectedstatus) {
         successCallBack("success with status code " + status)
       } else {
        let erroredResponse = response.clone()
          const errorMessage = await erroredResponse.text()
         if (errorMessage){
            failedCallBack("failed with status code " + status)
          }else{
            failedCallBack("failed with status code " + status)
          }
      } }
    catch (e) {
      failedCallBack("GOT INTO EXCEPTION")
     console.log(e)
      //return Maybe.none();
    }
  }



  public async sendForLogin(successCallBack: (message:string) =>void,failedCallBack: (message:string) =>void){
  
    const endpoint = this.endpoint + (this.queryParams || '');
     // jwt.map(token => ({ Authorization: `Bearer ${token}` })).or(() => ({}))
      const response = await fetch(createUrl(endpoint), {
        method: this.method,
        headers: (<any>Object).assign(
          { 'Content-Type': 'application/json' },
          
        
          // jwt.map(token => ({ Authorization: `Bearer ${token}` })).or(() => ({}))
        ),
        body: JSON.stringify(this.body)
      })

       const status = response.status;
      
        // const responseBody = await response.clone().json();
       
        // console.log("response "+ JSON.stringify(responseBody))
    
        const mapper = this.responseMappings[status];
        try {
      if (status == 200) {
        const responseBody = await response.json();
     
        successCallBack(responseBody.Token)
       
      } else {
        
        let erroredResponse = response.clone()
          const errorMessage = await erroredResponse.text()
         
          if (errorMessage){
            failedCallBack("failed with status code " + status)
          }else{
            failedCallBack("failed with status code " + status)
          }
      
    } }
    catch (e) {
      failedCallBack("GOT INTO EXCEPTION")
     console.log(e)
      //return Maybe.none();
    }
  }

  private  async getTokenJSON(){
    const jwt = await getSensitiveData(LocalStorageKey.JWT);
    const token =  await jwt.map(token => token).or(() => ({}))
      if(jwt.isSome()){
        console.log(`Bearer ${token}`)
        return { Authorization: `Bearer ${token}` }
        }else {
         
       return  ({})
       }
     
  }


  }

