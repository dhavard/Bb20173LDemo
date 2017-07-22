using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplicationBasic.ServerBean;

namespace WebApplicationBasic.Controllers
{
    [Route("api/[controller]")]
    public class ConfigController : Controller
    {
        [HttpPost("[action]")]
        public Config UpdateConfig([FromBody] Config config)
        {
            Config.CONFIG = config;

            var serializer = new DataContractJsonSerializer(typeof(Config));
            using( FileStream stream = new FileStream(Config.FILENAME, FileMode.Create) )
            {
                serializer.WriteObject(stream, config);
            }

            return config;
        }

        [HttpGet("[action]")]
        public Config GetConfig()
        {
            if( String.IsNullOrWhiteSpace( Config.CONFIG.BaseUrl ) )
            {
                var serializer = new DataContractJsonSerializer(typeof(Config));
                try{
                    using( FileStream stream = new FileStream(Config.FILENAME, FileMode.Open) )
                    {
                        Config.CONFIG = (Config)serializer.ReadObject(stream);
                    }
                }
                catch( IOException )
                {
                    //ignore
                }
            }

            return Config.CONFIG;
        }
    }
}
