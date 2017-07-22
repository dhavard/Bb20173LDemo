using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebApplicationBasic.ServerBean
{
    public class RequestCache
    {
        public static RequestCache LAST = new RequestCache();

        public string Url { get; set; }
        public string Body { get; set; }
        public string AuthHeader { get; set; }
        public string Method { get; set; }
    }
}
