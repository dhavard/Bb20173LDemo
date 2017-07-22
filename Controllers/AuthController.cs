using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebApplicationBasic.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public IEnumerable<AuthData> GetAuth(int authDataIndex)
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new AuthData
            {
                DateFormatted = DateTime.Now.AddDays(index + authDataIndex).ToString("d"),
                TemperatureC = rng.Next(75, 155),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }

//dispatch({ type: 'REQUEST_TOKEN', grantType: grantType, code: code, 
//redirectUri: 'http://localhost:5000/auth', refreshToken: refreshToken });
        [HttpGet("getToken")]
        public Token GetToken(string grantType, string code, string redirectUri)
        {
            //TODO send to Learn

            return new Token{
                AccessToken = "dummy-access",
                TokenType = code,
                ExpiresIn = 243524352345,
                RefreshToken = "dummy-refresh",
                Scope = "dummy scope",
                UserId = "notrealuser"
            };
        }

        public class Token
        {
            public string AccessToken { get; set; }
            public string TokenType { get; set; }
            public long ExpiresIn { get; set; }
            public string RefreshToken { get; set; }
            public string Scope { get; set; }
            public string UserId { get; set; }
        }

        public class AuthData
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }
}
