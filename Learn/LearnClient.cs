using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using Microsoft.AspNetCore.Mvc;
using WebApplicationBasic.ServerBean;

namespace WebApplicationBasic.Learn
{
    public class LearnClient
    {
        private static void AddBasicAuthHeader(HttpClient client)
        {
            String encoded = System.Convert.ToBase64String(Encoding.GetEncoding("ISO-8859-1").GetBytes(Config.CONFIG.ClientKey + ":" + Config.CONFIG.ClientSecret));
            client.DefaultRequestHeaders.Add("Authorization", "Basic " + encoded);
            RequestCache.LAST.AuthHeader = "Basic " + encoded;
        }

        private static void AddBearerAuthHeader(HttpClient client)
        {
            if( Token.TOKEN == null || Token.TOKEN.AccessToken == null )
            {
                AddBasicAuthHeader(client);
                return;
            }
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + Token.TOKEN.AccessToken);
            RequestCache.LAST.AuthHeader = "Bearer " + Token.TOKEN.AccessToken;
        }

        public static async Task<ResponseCache> RequestCode()
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add( new MediaTypeWithQualityHeaderValue(
                "application/json"));
            client.DefaultRequestHeaders.Add("User-Agent", "BbWorld Demo 2017");
            AddBasicAuthHeader(client);

            string bodyStr = "{ \"grant_type\": \"" + Config.CONFIG.TokenType + "\"}";
            string url = Config.CONFIG.BaseUrl + "/learn/api/public/v1/oauth2/authorizationcode";
            url = url + "?redirect_uri=" + Config.CONFIG.RedirectUri 
                                                + "&response_type=code"
                                                + "&client_id=" + Config.CONFIG.ClientKey
                                                + "&scope=" + Config.CONFIG.Scope
                                                + "&state=" + Config.CONFIG.State;
            RequestCache.LAST.Url = url;
            RequestCache.LAST.Body = bodyStr;
            RequestCache.LAST.Method = "GET";

            StringContent postBody = new StringContent(bodyStr, Encoding.UTF8, "application/x-www-form-urlencoded");

            var tokenTask = client.GetAsync(url);
            HttpResponseMessage response = await tokenTask;

            ResponseCache.LAST.Url = url;
            ResponseCache.LAST.StatusCode = (int)response.StatusCode;
            ResponseCache.LAST.Body = await response.Content.ReadAsStringAsync();
            if( ResponseCache.LAST.StatusCode >= 302 && ResponseCache.LAST.StatusCode < 312 )
            {
                ResponseCache.LAST.RedirectUri = response.RequestMessage.RequestUri.ToString();
            }
            else
            {
                ResponseCache.LAST.RedirectUri = String.Empty;
            }

            return ResponseCache.LAST;
        }

        public static Task<Token> RequestToken()
        {
            return RequestToken(null);
        }

        public static async Task<Token> RequestToken(String code)
        {
            Console.WriteLine("TOKEN retrieval started" );
            if( String.IsNullOrWhiteSpace(code) && Token.TOKEN != null ){
                return Token.TOKEN;
            }

            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add( new MediaTypeWithQualityHeaderValue(
                "application/json"));
            client.DefaultRequestHeaders.Add("User-Agent", "BbWorld Demo 2017");
            AddBasicAuthHeader(client);

            string bodyStr = "{ \"grant_type\": \"" + Config.CONFIG.TokenType + "\"}";
            string url = Config.CONFIG.BaseUrl + "/learn/api/public/v1/oauth2/token?grant_type=" + Config.CONFIG.TokenType;
            if( !String.IsNullOrWhiteSpace(code) ) {
                bodyStr =  "{ \"grant_type\": \"authorization_code\"}";
                url = Config.CONFIG.BaseUrl + "/learn/api/public/v1/oauth2/token?grant_type=authorization_code&code="
                     + code + "&redirect_uri=" + Config.CONFIG.RedirectUri;
            }

            RequestCache.LAST.Url = url ;
            RequestCache.LAST.Body = bodyStr;
            RequestCache.LAST.Method = "POST";

            StringContent postBody = new StringContent(bodyStr, Encoding.UTF8, "application/x-www-form-urlencoded");

            var tokenTask = client.PostAsync(RequestCache.LAST.Url, postBody);
            HttpResponseMessage response = await tokenTask;

            ResponseCache.LAST.Url = RequestCache.LAST.Url;
            ResponseCache.LAST.StatusCode = (int)response.StatusCode;
            ResponseCache.LAST.Body = await response.Content.ReadAsStringAsync();
            ResponseCache.LAST.RedirectUri = String.Empty;

            if( ResponseCache.LAST.StatusCode >= 302 && ResponseCache.LAST.StatusCode < 312 )
            {
                ResponseCache.LAST.RedirectUri = response.RequestMessage.RequestUri.ToString();
            } 
            else if( ResponseCache.LAST.StatusCode != 200 )
            {
                return new Token();
            }

            var token = Resource.Deserialize<Token>( ResponseCache.LAST.Body );
            Token.TOKEN = token;

            Console.WriteLine("TOKEN " + token.AccessToken + " retrieved for user:" + token.UserId );

            return token;
        }

        public static Task<ResponseCache> RequestRelativeResource(String method, String relativeUrl, String bodyStr)
        {
            return RequestResource( method, Config.CONFIG.BaseUrl + "/learn/api/public/" + relativeUrl, bodyStr );
        }

        public static async Task<ResponseCache> RequestResource(String method, String url, String bodyStr)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add( new MediaTypeWithQualityHeaderValue(
                "application/json"));
            client.DefaultRequestHeaders.Add("User-Agent", "BbWorld Demo 2017");
            AddBearerAuthHeader(client);

            RequestCache.LAST.Url = url;
            RequestCache.LAST.Method = method;
            RequestCache.LAST.Body = bodyStr;

            Task<HttpResponseMessage> fetchTask = null;
            StringContent postBody;
            switch( method.ToLowerInvariant() )
            {
                case "post":
                    postBody = new StringContent(bodyStr, Encoding.UTF8, "application/json");
                    fetchTask = client.PostAsync(url, postBody);
                    break;
                case "put":
                    postBody = new StringContent(bodyStr, Encoding.UTF8, "application/json");
                    fetchTask = client.PutAsync(url, postBody);
                    break;
                case "patch":
                    postBody = new StringContent(bodyStr, Encoding.UTF8, "application/json");
                    fetchTask = client.SendAsync(new HttpRequestMessage(new HttpMethod("PATCH"), url){ Content = postBody });
                    break;
                case "get":
                    fetchTask = client.GetAsync(url);
                    break;
                default:
                    break;
            }

            if( fetchTask == null )
            {
                return ResponseCache.LAST;
            }

            HttpResponseMessage response = await fetchTask;

            ResponseCache.LAST.Url = url;
            ResponseCache.LAST.StatusCode = (int)response.StatusCode;
            ResponseCache.LAST.Body = await response.Content.ReadAsStringAsync();
            if( ResponseCache.LAST.StatusCode >= 302 && ResponseCache.LAST.StatusCode < 312 )
            {
                ResponseCache.LAST.RedirectUri = response.RequestMessage.RequestUri.ToString();
            }
            else
            {
                ResponseCache.LAST.RedirectUri = String.Empty;
            }

            return ResponseCache.LAST;
        }
    }
}