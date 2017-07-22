using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebApplicationBasic.ServerBean
{
    public class Config
    {
        public const String FILENAME = "bbworlddemo.conf"; 
        public static Config CONFIG = new Config();

        public string BaseUrl { get; set; }
        public string ClientId { get; set; }
        public string ClientKey { get; set; }
        public string ClientSecret { get; set; }
        public string TokenType { get; set; }
        public string Scope { get; set; }
        public string State { get; set; }
        public string RedirectUri { get; set; }
    }
}
