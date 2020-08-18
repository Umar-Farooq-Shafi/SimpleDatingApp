using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepo _repo;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthRepo repo, IConfiguration configuration)
        {
            _repo = repo;
            _configuration = configuration;
        }

        // POST api/<AuthController>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDto userToRegisterDto)
        {
            // TODO: Validation request

            userToRegisterDto.Username = userToRegisterDto.Username.ToLower();

            // Checking user exists
            if (await _repo.UserExists(userToRegisterDto.Username)) 
                return BadRequest("Username \'" +
                                  userToRegisterDto.Username + "\' already exists...");

            // Creating new user
            var userToCreate = new User() {Username = userToRegisterDto.Username};

            // Registering into DB
            var createUser = await _repo.Register(userToCreate, userToRegisterDto.Password);

            // TODO: change into 'CreatedAtRoute()'
            return StatusCode(201);
        }

        // POST api/<AuthController>/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            // Login the user and if not exist return UNAUTHORIZED
            var userForRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);
            if (userForRepo == null) return Unauthorized("username or password is wrong...");

            // Creating token
            var claim = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userForRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userForRepo.Username),
            };

            var key = 
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration
                    .GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDesc = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claim),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = cred
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDesc);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}
