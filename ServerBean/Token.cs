using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Serialization;

namespace WebApplicationBasic.ServerBean
{
    [DataContract(Name="token")]
    public class Token
    {
        public static Token TOKEN;

        [DataMember(Name="access_token")]
        public string AccessToken { get; set; }

        [DataMember(Name="token_type")]
        public string TokenType { get; set; }

        [DataMember(Name="expires_in")]
        public long ExpiresIn { get; set; }

        [DataMember(Name="refresh_token")]
        public string RefreshToken { get; set; }

        [DataMember(Name="scope")]
        public string Scope { get; set; }

        [DataMember(Name="user_id")]
        public string UserId { get; set; }
    }
}
