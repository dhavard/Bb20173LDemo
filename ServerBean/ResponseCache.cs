using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebApplicationBasic.ServerBean
{
    public class ResponseCache
    {
        public static ResponseCache LAST = new ResponseCache();

        public string Url { get; set; }
        public int StatusCode { get; set; }
        public string Body { get; set; }
        public string RedirectUri { get; set; }
    }
}
