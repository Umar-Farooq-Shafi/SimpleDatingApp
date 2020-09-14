using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DatingApp.API.Controllers {
    [AllowAnonymous]
    [Route ("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase {
        private readonly IConfiguration _configuration;
        public readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController (IConfiguration configuration, IMapper mapper, 
        UserManager<User> userManager, SignInManager<User> signInManager) 
        {
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        // POST api/<AuthController>
        [HttpPost ("register")]
        public async Task<IActionResult> Register ([FromBody] UserForRegisterDto userToRegisterDto) {
            // Creating new user
            var userToCreate = _mapper.Map<User> (userToRegisterDto);

            var result = await _userManager.CreateAsync(userToCreate, userToRegisterDto.Password);

            if(!result.Succeeded)
                return BadRequest(result.Errors);

            return CreatedAtRoute ("GetUser",
                new { controller = "Users", id = userToCreate.Id },
                _mapper.Map<UserForDetailedDto> (userToCreate));
        }

        // POST api/<AuthController>/login
        [HttpPost ("login")]
        public async Task<IActionResult> Login (UserForLoginDto userForLoginDto) {
            // Login the user and if not exist return UNAUTHORIZED
            var user = await _userManager.FindByNameAsync(userForLoginDto.Username);

            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);

            if(!result.Succeeded)
                return Unauthorized();

            var appUser = await _userManager.Users.Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.NormalizedUserName == userForLoginDto.Username.ToUpper());

            var userToReturn = _mapper.Map<UserForListDto> (appUser);

            return Ok (new {
                token = GenerateJWTToken(appUser).Result,
                    user = userToReturn
            });
        }

        private async Task<string> GenerateJWTToken(User user)
        {
            // Creating token
            var claims = new List<Claim> 
            {
                new Claim (ClaimTypes.NameIdentifier, user.Id.ToString ()),
                new Claim (ClaimTypes.Name, user.UserName),
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key =
                new SymmetricSecurityKey (Encoding.UTF8.GetBytes (_configuration
                    .GetSection ("AppSettings:Token").Value));

            var cred = new SigningCredentials (key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDesc = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity (claims),
                Expires = DateTime.Now.AddDays (1),
                SigningCredentials = cred
            };

            var tokenHandler = new JwtSecurityTokenHandler ();

            var token = tokenHandler.CreateToken (tokenDesc);

            return tokenHandler.WriteToken(token);
        }
    }
}