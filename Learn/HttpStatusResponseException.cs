using System;
using System.Net;
using System.Net.Http;

namespace WebApplicationBasic.Learn
{
    public class HttpStatusResponseException : HttpRequestException {
        public HttpStatusCode StatusCode{ get; set; }

        public HttpStatusResponseException( HttpStatusCode statusCode, string message ) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}