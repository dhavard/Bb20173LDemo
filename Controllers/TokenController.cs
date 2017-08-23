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
    public class TokenController : Controller
    {
        [HttpGet("[action]")]
        public Token GetToken(string grantType, string code, string redirectUri)
        {
            Token result = LearnClient.RequestToken(code).Result;
            return Token.TOKEN;
        }

        [HttpGet("[action]")]
        public ResponseCache GetCode()
        {
            return LearnClient.RequestCode().Result;
        }
    }
}
