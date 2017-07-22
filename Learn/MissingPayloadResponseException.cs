using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using Microsoft.AspNetCore.Mvc;
using WebApplicationBasic.ServerBean;

namespace WebApplicationBasic.Learn
{
    public class MissingPayloadResponseException : HttpRequestException {


    }
}