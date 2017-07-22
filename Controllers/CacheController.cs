using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplicationBasic.ServerBean;

namespace WebApplicationBasic.Controllers
{
    [Route("api/[controller]")]
    public class CacheController : Controller
    {
        [HttpGet("[action]")]
        public ResponseCache GetLastResponse()
        {
            return ResponseCache.LAST;
        }

        [HttpGet("[action]")]
        public RequestCache GetLastRequest()
        {
            return RequestCache.LAST;
        }
    }
}
