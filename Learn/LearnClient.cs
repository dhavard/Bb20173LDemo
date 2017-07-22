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
        //https://ultra-dev.int.bbpd.io/learn/api/public/v1/users/me

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

        private static async Task GetToken()
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add( new MediaTypeWithQualityHeaderValue(
                "application/json"));
            client.DefaultRequestHeaders.Add("User-Agent", "BbWorld Demo 2017");
            AddBasicAuthHeader(client);

            var serializer = new DataContractJsonSerializer(typeof(Token));
            var tokenTask = client.GetStreamAsync(Config.CONFIG.BaseUrl + "/learn/api/public/v1/oauth2/token");
            var token = serializer.ReadObject(await tokenTask) as Token;

            Console.WriteLine("TOKEN retrieved for user:" + token.UserId );
        }

        public static async Task<Token> RequestToken()
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add( new MediaTypeWithQualityHeaderValue(
                "application/json"));
            client.DefaultRequestHeaders.Add("User-Agent", "BbWorld Demo 2017");
            AddBasicAuthHeader(client);

            //var serializer = new DataContractJsonSerializer(typeof(Token));

            string bodyStr = "{ \"grant_type\": \"" + Config.CONFIG.TokenType + "\"}";
            string url = Config.CONFIG.BaseUrl + "/learn/api/public/v1/oauth2/token";
            RequestCache.LAST.Url = url;
            RequestCache.LAST.Body = bodyStr;
            RequestCache.LAST.Method = "POST";

            //StringContent postBody = new StringContent(bodyStr, Encoding.UTF8, "application/json");
            StringContent postBody = new StringContent(bodyStr, Encoding.UTF8, "application/x-www-form-urlencoded");

            var tokenTask = client.PostAsync(url + "?grant_type=" + Config.CONFIG.TokenType, postBody);
            HttpResponseMessage response = await tokenTask;

            ResponseCache.LAST.Url = url;
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

            //var token = serializer.ReadObject(await response.Content.ReadAsStreamAsync()) as Token;
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

            //var serializer = new DataContractJsonSerializer(typeof(Token));

            RequestCache.LAST.Url = url;
            RequestCache.LAST.Method = method;
            RequestCache.LAST.Body = bodyStr;

            Task<HttpResponseMessage> fetchTask = null;
            StringContent postBody;
            switch( method.ToLowerInvariant() )
            {
                case "post":
                    //StringContent postBody = new StringContent(bodyStr, Encoding.UTF8, "application/json");
                    postBody = new StringContent(bodyStr, Encoding.UTF8, "application/x-www-form-urlencoded");
                    fetchTask = client.PostAsync(url, postBody);
                    break;
                case "put":
                    postBody = new StringContent(bodyStr, Encoding.UTF8, "application/x-www-form-urlencoded");
                    fetchTask = client.PutAsync(url, postBody);
                    break;
                case "patch":
                    postBody = new StringContent(bodyStr, Encoding.UTF8, "application/x-www-form-urlencoded");
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