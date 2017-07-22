using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplicationBasic.ServerBean;
using WebApplicationBasic.Learn;

namespace WebApplicationBasic.Controllers
{
    [Route("api/[controller]")]
    public class ResourceController : Controller
    {
        [HttpPost("[action]")]
        public ResponseCache RequestResource([FromBody] RequestCache request)
        {
            ResponseCache result = LearnClient.RequestResource( request.Method, request.Url, request.Body ).Result;
            return result;
        }
    }
}
