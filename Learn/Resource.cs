using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using WebApplicationBasic.ServerBean;

namespace WebApplicationBasic.Learn
{
public static class Resource
    {
        public static string BaseUrl => Config.CONFIG.BaseUrl;
 
        public static HttpClient NewClient(string sessionId = null)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri(BaseUrl);
            client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
 
 /* 
            if (!string.IsNullOrWhiteSpace(sessionId))
                client.DefaultRequestHeaders.Add(Config.SESSION_HEADER, sessionId);
                */
 
            return client;
        }
 
        public static async Task<T> GetPayloadAsync<T>(HttpResponseMessage response) where T : class
        {
            if (!response.IsSuccessStatusCode)
                throw new HttpStatusResponseException(response.StatusCode, await response.Content.ReadAsStringAsync());
 
            var payload = await response.Content.ReadAsStringAsync();
 
            if (string.IsNullOrWhiteSpace(payload))
                throw new MissingPayloadResponseException();
 
            return Deserialize<T>(payload);
        }
 
        public static T Deserialize<T>(string str) where T : class {
            using( MemoryStream stream = new MemoryStream() ) {
                using( StreamWriter writer = new StreamWriter(stream) ) {
                    writer.Write(str);
                    writer.Flush();
                    stream.Position = 0;
                    return Deserialize<T>(stream);
                }
            }
        }

        public static T Deserialize<T>(MemoryStream stream) where T : class {
            var serializer = new DataContractJsonSerializer(typeof(T));
            T obj = serializer.ReadObject(stream) as T;
            return obj;
        }
 
        public static string Serialize<T>(T obj) {
            string output;
            var serializer = new DataContractJsonSerializer(typeof(T));
            using( MemoryStream stream = new MemoryStream() )
            {
                serializer.WriteObject(stream, obj);
                stream.Position = 0;
                using( StreamReader reader = new StreamReader(stream))
                {
                    output = reader.ReadToEnd();
                }
            }
            return output;
        }
 
        public static HttpContent JsonPayload<T>(T obj) where T : class => new StringContent(Serialize(obj), Encoding.UTF8, "application/json");
 
        public static async Task<Result<T>> GetAsync<T>(string path, string sessionId) where T : class
        {
            try
            {
                if (string.IsNullOrWhiteSpace(path))
                    throw new ArgumentNullException(nameof(path));
 
                HttpClient client = NewClient(sessionId);
 
                var response = await client.GetAsync(path).ConfigureAwait(false);
                var data = await Resource.GetPayloadAsync<T>(response);
 
                return Result<T>.True(data);
            }
            catch (Exception ex)
            {
                return Result<T>.False(ex);
            }
        }
 
        public static async Task<Result<T>> DeleteAsync<T>(string path, string sessionId) where T : class
        {
            try
            {
                if (string.IsNullOrWhiteSpace(path))
                    throw new ArgumentNullException(nameof(path));

                HttpClient client = NewClient(sessionId);
 
                var response = await client.DeleteAsync(path).ConfigureAwait(false);
                var data = await Resource.GetPayloadAsync<T>(response);
 
                return Result<T>.True(data);
            }
            catch (Exception ex)
            {
                return Result<T>.False(ex);
            }
        }
 
        public static async Task<Result<R>> PutAsync<T, R>(string path, T payload, string sessionId)
            where R : class
            where T : class
        {
            try
            {
                if (string.IsNullOrWhiteSpace(path))
                    throw new ArgumentNullException(nameof(path));
 
                if (payload == null)
                    throw new ArgumentNullException(nameof(payload));
 
                HttpClient client = NewClient(sessionId);
 
                var response = await client.PutAsync(path, JsonPayload(payload)).ConfigureAwait(false);
                var data = await Resource.GetPayloadAsync<R>(response);
 
                return Result<R>.True(data);
            }
            catch (Exception ex)
            {
                return Result<R>.False(ex);
            }
        }
 
        public static async Task<Result<R>> PostAsync<T, R>(string path, T payload, string sessionId)
         where R : class
         where T : class
        {
            try
            {
                if (string.IsNullOrWhiteSpace(path))
                    throw new ArgumentNullException(nameof(path));
 
                if (payload == null)
                    throw new ArgumentNullException(nameof(payload));
 
                HttpClient client = NewClient(sessionId);
 
                var response = await client.PostAsync(path, JsonPayload(payload)).ConfigureAwait(false);
                var data = await Resource.GetPayloadAsync<R>(response);
 
                return Result<R>.True(data);
            }
            catch (Exception ex)
            {
                return Result<R>.False(ex);
            }
        }
    }
}