using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _Context;

        public ValuesController(DataContext dataContext)
        {
            _Context = dataContext;
        }

        // GET: api/values
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var values = await _Context.Values.ToListAsync();

            return Ok(values);
        }

        // GET: api/value/4
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var value = await _Context.Values.FirstOrDefaultAsync(x => x.Id == id);

            return Ok(value);
        }

        // POST: api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
            // ...
        }



        //private static readonly string[] Summaries = new[]
        //{
        //    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        //};

        //private readonly ILogger<WeatherForecastController> _logger;

        //public WeatherForecastController(ILogger<WeatherForecastController> logger)
        //{
        //    _logger = logger;
        //}

        //[HttpGet]
        //public IEnumerable<WeatherForecast> Get()
        //{
        //    var rng = new Random();
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateTime.Now.AddDays(index),
        //        TemperatureC = rng.Next(-20, 55),
        //        Summary = Summaries[rng.Next(Summaries.Length)]
        //    })
        //    .ToArray();
        //}
    }
}
