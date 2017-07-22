using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApplicationBasic.Learn
{
    public class Result<T>
    {
        public T Data { get; set; }
        public Exception Error { get; set; }

        public static Result<T> True(T data)
        {
            Result<T> r = new Result<T>();
            r.Data = data;
            return r;
        }

        public static Result<T> False(Exception ex)
        {
            Result<T> r = new Result<T>();
            r.Error = ex;
            return r;
        }
    }
}