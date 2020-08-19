using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepo : IAuthRepo
    {
        private readonly DataContext _context;

        // DEPEND: Injection of Sqlite Data Context
        public AuthRepo(DataContext context)
        {
            _context = context;
        }

        // METHOD: Register a new user into DB
        public async Task<User> Register(User user, string password)
        {
            // METHOD: Creating hash salt password 
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            // Storing into DB Async
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // To free up resources
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                // Getting the KEY and hash from SALT
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        // METHOD: Login user
        public async Task<User> Login(string username, string password)
        {
            // Finding the user from DB
            // IF: Failed returning null
            var user = await _context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Username == username);
            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        // METHOD: Verifing with rigster user
        private bool VerifyPasswordHash(string password, byte[] userPasswordHash, byte[] userPasswordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(userPasswordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int b = 0; b < computedHash.Length; b++)
                {
                    if (computedHash[b] != userPasswordHash[b]) return false;
                }
            }

            return true;
        }

        // METHOD: Finding a user exists or not
        public async Task<bool> UserExists(string username)
            => await _context.Users.AnyAsync(x => x.Username == username);
    }
}
