using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DatingApp.API.Controllers {
    [ServiceFilter (typeof (LogUserActivity))]
    [Authorize]
    [Route ("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly IDatingRepo _repo;
        private readonly IMapper _mapper;

        public UsersController (IDatingRepo repo, IMapper mapper) {
            _repo = repo;
            _mapper = mapper;
        }

        // GET: api/<UsersController>
        [HttpGet]
        public async Task<IActionResult> GetUsers ([FromQuery] UserParams userParams) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _repo.GetUser (currentUserId);

            userParams.UserId = currentUserId;

            if (string.IsNullOrEmpty (userParams.Gender))
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";

            var users = await _repo.GetUsers (userParams);

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>> (users);

            Response.AddPagination (users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok (usersToReturn);
        }

        // GET api/<UsersController>/5
        [HttpGet ("{id:int}", Name = "GetUser")]
        public async Task<IActionResult> GetUser (int id) {
            var user = await _repo.GetUser (id);

            var userToReturn = _mapper.Map<UserForDetailedDto> (user);

            return Ok (userToReturn);
        }

        // POST api/<UsersController>
        [HttpPost]
        public void Post ([FromBody] string value) { }

        // PUT api/<UsersController>/5
        [HttpPut ("{id}")]
        public async Task<IActionResult> UpdateUser (int id, [FromBody] UserForUpdateDto updateDto) {
            // Checking if user is logged in who try to update profile
            if (id != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();

            var userFromRepo = await _repo.GetUser (id);

            _mapper.Map (updateDto, userFromRepo);

            if (await _repo.SaveAll ())
                return NoContent ();

            throw new Exception ($"Updating user {id} failed on save");
        }

        // POST api/<UsersController>/5
        [HttpPost ("{id:int}/like/{recipientId:int}")]
        public async Task<IActionResult> LikeUser (int id, int recipientId) {
            // Checking if user is logged in who try to update profile
            if (id != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();

            var like = await _repo.GetLike (id, recipientId);

            if (like != null)
                return BadRequest ("You already like this user...");

            if (await _repo.GetUser (recipientId) == null)
                return NotFound ();

            like = new Like {
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add<Like> (like);

            if (await _repo.SaveAll ())
                return Ok ();

            return BadRequest ("Failed to like user...");
        }
    }
}